const { spawn } = require('node:child_process')
const { chmodSync, createWriteStream, existsSync, mkdirSync, rmSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { Readable } = require('node:stream')
const { pipeline } = require('node:stream/promises')
const AdmZip = require('adm-zip')
const { log } = require('./log')
const { WORK_DIR } = require('./paths')

const PERCY_SERVER_URL = 'http://localhost:5338'
const BIN_DIR = join(WORK_DIR, 'bin')
const CONFIG_PATH = join(WORK_DIR, '.percy.json')
const PERCY_BIN = join(BIN_DIR, process.platform === 'win32' ? 'percy.exe' : 'percy')
const DOWNLOAD_ASSETS = {
    darwin: 'percy-osx.zip',
    win32: 'percy-win.zip',
    linux: 'percy-linux.zip'
}
const START_TIMEOUT_MS = 180_000

// Percy's standalone CLI is x86_64-only, and so is the Chromium it downloads.
// On Apple Silicon the first Rosetta translation of that Chromium takes longer
// than Percy's 30s launch timeout, so prefer the locally installed Chrome
// (native, and guaranteed present for users of the Chrome extension).
const CHROME_PATHS = {
    darwin: [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ],
    win32: [
        `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
        `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
        `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
        `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`
    ],
    linux: [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
    ]
}

function detectBrowser() {
    if (process.env.PERCY_BROWSER_EXECUTABLE) return process.env.PERCY_BROWSER_EXECUTABLE
    return (CHROME_PATHS[process.platform] || []).find((path) => existsSync(path))
}

let child = null

function isPercyRunning() {
    return fetch(`${PERCY_SERVER_URL}/percy/healthcheck`)
        .then((res) => res.ok)
        .catch(() => false)
}

// The packaged app has no node/npm to lean on, so it runs the standalone
// Percy CLI binary, downloaded once from the latest GitHub release
async function ensurePercyBinary() {
    if (existsSync(PERCY_BIN)) return
    const asset = DOWNLOAD_ASSETS[process.platform]
    if (!asset) throw new Error(`Unsupported platform: ${process.platform}`)

    const url = `https://github.com/percy/cli/releases/latest/download/${asset}`
    log(`[percy] downloading Percy CLI from ${url} ...`)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to download Percy CLI (HTTP ${res.status})`)

    mkdirSync(BIN_DIR, { recursive: true })
    const zipPath = join(BIN_DIR, 'percy.zip')
    await pipeline(Readable.fromWeb(res.body), createWriteStream(zipPath))
    new AdmZip(zipPath).extractAllTo(BIN_DIR, true)
    rmSync(zipPath, { force: true })
    if (!existsSync(PERCY_BIN)) throw new Error('Downloaded archive did not contain the percy binary')
    if (process.platform !== 'win32') chmodSync(PERCY_BIN, 0o755)
    log('[percy] Percy CLI downloaded')
}

function waitForStarted(proc) {
    return new Promise((resolve, reject) => {
        const deadline = Date.now() + START_TIMEOUT_MS
        let settled = false
        let stderr = ''
        const finish = (err) => {
            if (settled) return
            settled = true
            err ? reject(err) : resolve()
        }
        proc.stderr.on('data', (chunk) => { stderr += chunk })
        // "Percy has started!" is the true ready signal — the healthcheck
        // endpoint responds a little earlier, while percy still rejects
        // snapshots with "Not running"
        proc.stdout.on('data', (chunk) => {
            if (String(chunk).includes('Percy has started')) finish()
        })
        proc.on('exit', (code) => {
            finish(new Error(`Percy exited with code ${code} before it was ready.\n${stderr.trim()}`))
        })
        const poll = async () => {
            if (settled || proc.exitCode !== null) return
            if (Date.now() > deadline) {
                proc.kill()
                return finish(new Error('Timed out waiting for the Percy server to start'))
            }
            if (await isPercyRunning()) {
                // fallback in case the log line ever changes: healthy server
                // plus a grace period counts as started
                setTimeout(() => {
                    if (proc.exitCode === null) finish()
                }, 3000)
                return
            }
            setTimeout(poll, 500)
        }
        poll()
    })
}

async function startPercy(config) {
    if (await isPercyRunning()) {
        log('[percy] server is already running')
        return { alreadyRunning: true }
    }
    await ensurePercyBinary()

    // token goes through the environment, everything else through the config file
    const { percy, ...fileConfig } = config
    // generous launch timeout: first launch of Percy's x86_64 Chromium on
    // Apple Silicon needs Rosetta translation, which can exceed the 30s default
    fileConfig.discovery = {
        ...fileConfig.discovery,
        'launch-options': { timeout: 120_000, ...fileConfig.discovery?.['launch-options'] }
    }
    mkdirSync(WORK_DIR, { recursive: true })
    writeFileSync(CONFIG_PATH, JSON.stringify(fileConfig, null, 2))

    const env = {
        ...process.env,
        PERCY_TOKEN: percy.token,
        PERCY_BRANCH: 'percy-web-extension'
    }
    const browser = detectBrowser()
    if (browser) {
        env.PERCY_BROWSER_EXECUTABLE = browser
        log(`[percy] using browser: ${browser}`)
    }

    log('[percy] starting local Percy server...')
    child = spawn(PERCY_BIN, ['exec:start', '--config', CONFIG_PATH], {
        cwd: WORK_DIR,
        env
    })
    child.stdout.on('data', (chunk) => log(`[percy] ${String(chunk).trimEnd()}`))
    child.stderr.on('data', (chunk) => log(`[percy] ${String(chunk).trimEnd()}`))
    child.on('exit', (code) => {
        log(`[percy] server process exited (code ${code})`)
        child = null
    })

    try {
        await waitForStarted(child)
    } catch (err) {
        child = null
        throw err
    }
    log(`[percy] server is up at ${PERCY_SERVER_URL}`)
    return { alreadyRunning: false }
}

async function stopPercy() {
    // ask the Percy CLI server to shut down gracefully, fall back to killing the child
    const stopped = await fetch(`${PERCY_SERVER_URL}/percy/stop`, { method: 'POST' })
        .then((res) => res.ok)
        .catch(() => false)
    if (!stopped && child) {
        child.kill()
        child = null
    }
    return stopped
}

function killPercy() {
    if (child) {
        child.kill()
        child = null
    }
}

module.exports = { PERCY_SERVER_URL, isPercyRunning, startPercy, stopPercy, killPercy }

const { spawn, spawnSync } = require('node:child_process')
const { existsSync, mkdirSync, readFileSync } = require('node:fs')
const { dirname, join } = require('node:path')
const readline = require('node:readline')
const { log } = require('./log')
const { PROJECT_ROOT, RESOURCES_DIR } = require('./paths')

// Menu layout (indexes are the click ids reported back by both tray backends)
const STOP_INDEX = 3
const QUIT_INDEX = 5

function menuItems(version, running) {
    return [
        { title: `Percy Desktop App v${version}`, enabled: false },
        { title: `Percy server: ${running ? 'running' : 'stopped'}`, enabled: false },
        { title: '-' },
        { title: 'Stop Percy server', enabled: running },
        { title: '-' },
        { title: 'Quit', enabled: true }
    ]
}

//#region macOS — native Swift menu bar helper

function compileMacHelper(outPath) {
    mkdirSync(dirname(outPath), { recursive: true })
    log('[tray] compiling native menu bar helper...')
    const result = spawnSync('xcrun', [
        'swiftc', '-O', join(PROJECT_ROOT, 'native', 'tray.swift'), '-o', outPath
    ], { encoding: 'utf8' })
    if (result.status !== 0) {
        throw new Error(`swiftc failed: ${result.stderr || result.error?.message}`)
    }
}

function resolveMacHelper() {
    const bundled = join(RESOURCES_DIR, 'percy-tray')
    if (existsSync(bundled)) return bundled
    const built = join(PROJECT_ROOT, 'native', 'build', 'percy-tray')
    if (!existsSync(built)) compileMacHelper(built)
    return built
}

function startMacTray(version, onAction) {
    const helper = resolveMacHelper()
    const iconPath = join(RESOURCES_DIR, 'tray.png')
    const proc = spawn(helper, existsSync(iconPath) ? [iconPath] : [])
    const lines = readline.createInterface({ input: proc.stdout })

    let running = false
    const pushMenu = () => {
        proc.stdin.write(`${JSON.stringify({
            type: 'menu',
            tooltip: 'Percy Desktop App',
            items: menuItems(version, running)
        })}\n`)
    }

    return new Promise((resolve, reject) => {
        proc.once('error', reject)
        proc.once('exit', (code) => reject(new Error(`tray helper exited early (code ${code})`)))
        lines.on('line', (line) => {
            let message
            try { message = JSON.parse(line) } catch { return }
            if (message.type === 'ready') {
                pushMenu()
                resolve({
                    setPercyRunning(value) {
                        if (value !== running) {
                            running = value
                            pushMenu()
                        }
                    },
                    destroy() { proc.kill() }
                })
            } else if (message.type === 'click') {
                onAction(message.index)
            }
        })
    })
}

//#endregion

//#region Windows / Linux — systray2 (bundled native helper)

async function startSystray(version, onAction) {
    const SysTray = require('systray2').default
    const iconFile = process.platform === 'win32' ? 'icon.ico' : 'tray.png'
    const icon = readFileSync(join(RESOURCES_DIR, iconFile)).toString('base64')

    const toSystrayItem = (item) => item.title === '-'
        ? SysTray.separator
        : { title: item.title, tooltip: '', checked: false, enabled: item.enabled !== false }

    const systray = new SysTray({
        menu: {
            icon,
            isTemplateIcon: process.platform === 'darwin',
            title: '',
            tooltip: 'Percy Desktop App',
            items: menuItems(version, false).map(toSystrayItem)
        },
        debug: false,
        // copy the helper binary out of the pkg snapshot so it can be executed
        copyDir: true
    })
    systray.onClick((action) => onAction(action.seq_id))
    await systray.ready()

    let running = false
    return {
        setPercyRunning(value) {
            if (value === running) return
            running = value
            const items = menuItems(version, running)
            for (const index of [1, STOP_INDEX]) {
                systray.sendAction({
                    type: 'update-item',
                    item: toSystrayItem(items[index]),
                    seq_id: index
                })
            }
        },
        destroy() { systray.kill(false) }
    }
}

//#endregion

// Returns a tray handle, or null when no tray backend works (headless mode)
async function startTray(version, onAction) {
    if (process.platform === 'darwin') {
        try {
            return await startMacTray(version, onAction)
        } catch (err) {
            log(`[tray] native helper unavailable (${err.message}), trying systray fallback`)
        }
    }
    try {
        return await startSystray(version, onAction)
    } catch (err) {
        log(`[tray] no tray icon available, running headless: ${err.message}`)
        return null
    }
}

module.exports = { startTray, STOP_INDEX, QUIT_INDEX }

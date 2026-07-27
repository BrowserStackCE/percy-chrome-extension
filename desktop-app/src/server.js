const { createServer } = require('node:http')
const { ZodError } = require('zod')
const { log } = require('./log')
const { PERCY_SERVER_URL, isPercyRunning, startPercy, stopPercy } = require('./percy')
const { PercyConfig } = require('./schemas')

const APP_PORT = 3778

function readRawBody(req) {
    return new Promise((resolve, reject) => {
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => resolve(body))
        req.on('error', reject)
    })
}

async function readJsonBody(req) {
    const body = await readRawBody(req)
    try {
        return body ? JSON.parse(body) : {}
    } catch {
        throw new Error('Invalid JSON body')
    }
}

function sendJson(res, status, payload) {
    res.writeHead(status, { 'content-type': 'application/json' })
    res.end(JSON.stringify(payload))
}

const ALLOWED_HOSTS = new Set([`localhost:${APP_PORT}`, `127.0.0.1:${APP_PORT}`])

// Websites in the user's browser can send requests to localhost, so only
// accept state-changing requests from the Chrome extension (or from local
// tools like curl, which send no Origin header at all)
function isTrustedOrigin(req) {
    const origin = req.headers.origin
    return origin == null || origin.startsWith('chrome-extension://')
}

async function handle(req, res) {
    // reject DNS-rebinding requests, where the Host header is an attacker's domain
    if (!ALLOWED_HOSTS.has(req.headers.host)) {
        return sendJson(res, 403, { error: 'Forbidden' })
    }

    const { pathname } = new URL(req.url, `http://localhost:${APP_PORT}`)

    if (req.method === 'GET' && pathname === '/healthcheck') {
        return sendJson(res, 200, { app: 'percy-desktop-app', percyRunning: await isPercyRunning() })
    }

    if (req.method === 'POST' && pathname === '/percy/start') {
        if (!isTrustedOrigin(req)) {
            return sendJson(res, 403, { error: 'Forbidden' })
        }
        const body = await readJsonBody(req)
        const config = PercyConfig.parse(body)
        const { alreadyRunning } = await startPercy(config)
        return sendJson(res, 200, { started: true, alreadyRunning })
    }

    // Proxy snapshot uploads to the Percy server. Percy CLI rejects requests
    // carrying a non-loopback Origin (which every chrome-extension request
    // has), so the extension sends snapshots here and we forward them
    // origin-less, server to server.
    if (req.method === 'POST' && pathname === '/percy/snapshot') {
        if (!isTrustedOrigin(req)) {
            return sendJson(res, 403, { error: 'Forbidden' })
        }
        const body = await readRawBody(req)
        const search = new URL(req.url, `http://localhost:${APP_PORT}`).search
        const upstream = await fetch(`${PERCY_SERVER_URL}/percy/snapshot${search}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body
        }).catch(() => null)
        if (!upstream) {
            return sendJson(res, 502, { error: 'Percy server is not running' })
        }
        const text = await upstream.text()
        if (!upstream.ok) {
            log(`[app] percy rejected snapshot (HTTP ${upstream.status}): ${text.slice(0, 1000)}`)
        }
        res.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/json' })
        return res.end(text)
    }

    if (req.method === 'POST' && pathname === '/percy/stop') {
        if (!isTrustedOrigin(req)) {
            return sendJson(res, 403, { error: 'Forbidden' })
        }
        const stopped = await stopPercy()
        return sendJson(res, 200, { stopped })
    }

    sendJson(res, 404, { error: 'Not found' })
}

function startAppServer() {
    const server = createServer((req, res) => {
        handle(req, res).catch((err) => {
            const isBadRequest = err instanceof ZodError || err.message === 'Invalid JSON body'
            const message = err instanceof ZodError
                ? err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
                : err.message
            log(`[app] ${req.method} ${req.url} failed: ${message}`)
            sendJson(res, isBadRequest ? 400 : 500, { error: message })
        })
    })
    return new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(APP_PORT, '127.0.0.1', () => resolve(server))
    })
}

module.exports = { APP_PORT, startAppServer }

#!/usr/bin/env node
const { version } = require('../package.json')
const { log, LOG_PATH } = require('./log')
const { isPercyRunning, killPercy, stopPercy } = require('./percy')
const { APP_PORT, startAppServer } = require('./server')
const { startTray, STOP_INDEX, QUIT_INDEX } = require('./tray')

const STATUS_POLL_MS = 3000

async function main() {
    let tray = null

    const shutdown = () => {
        log('[app] shutting down')
        killPercy()
        tray?.destroy()
        process.exit(0)
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    try {
        await startAppServer()
    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            log(`[app] port ${APP_PORT} is already in use — is another instance of the Percy desktop app running?`)
            process.exit(1)
        }
        throw err
    }
    log(`[app] Percy desktop app v${version} listening on http://localhost:${APP_PORT} (log: ${LOG_PATH})`)

    if (!process.argv.includes('--headless')) {
        tray = await startTray(version, async (index) => {
            if (index === STOP_INDEX) {
                await stopPercy()
                tray?.setPercyRunning(await isPercyRunning())
            } else if (index === QUIT_INDEX) {
                shutdown()
            }
        })
    }
    if (tray) {
        log('[app] menu bar icon is up')
        const refresh = async () => {
            tray.setPercyRunning(await isPercyRunning())
            setTimeout(refresh, STATUS_POLL_MS)
        }
        refresh()
    }
}

main().catch((err) => {
    log(`[app] fatal: ${err.stack || err}`)
    process.exit(1)
})

const { appendFileSync, mkdirSync } = require('node:fs')
const { join } = require('node:path')
const { WORK_DIR } = require('./paths')

// A double-clicked app has no terminal, so mirror everything to a log file
const LOG_PATH = join(WORK_DIR, 'app.log')

function log(...args) {
    const line = args.map(String).join(' ')
    console.log(line)
    try {
        mkdirSync(WORK_DIR, { recursive: true })
        appendFileSync(LOG_PATH, `${new Date().toISOString()} ${line}\n`)
    } catch {
        // logging must never take the app down
    }
}

module.exports = { log, LOG_PATH }

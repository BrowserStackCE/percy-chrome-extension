const { homedir } = require('node:os')
const { dirname, join } = require('node:path')

const IS_PACKAGED = typeof process.pkg !== 'undefined'
const PROJECT_ROOT = join(__dirname, '..')

// Where bundled read-only resources live. In the packaged macOS .app the real
// files sit in Contents/Resources next to the executable; in dev (and inside
// the pkg snapshot for win/linux) they live under the project's assets dir.
const RESOURCES_DIR = IS_PACKAGED && process.platform === 'darwin'
    ? join(dirname(process.execPath), '..', 'Resources')
    : join(PROJECT_ROOT, 'assets')

// Writable per-user state: percy binary, config, logs
const WORK_DIR = join(homedir(), '.percy-desktop-app')

module.exports = {
    IS_PACKAGED,
    PROJECT_ROOT,
    RESOURCES_DIR,
    WORK_DIR
}

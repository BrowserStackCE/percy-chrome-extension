#!/usr/bin/env node
// Builds distributable desktop apps with @yao-pkg/pkg:
//   node scripts/build.js [mac|win|linux]   (defaults to the host platform)
// mac   -> dist/mac/Percy Desktop App.app   (menu bar app, no Dock icon)
// win   -> dist/win/percy-desktop-app.exe
// linux -> dist/linux/percy-desktop-app
const { execFileSync } = require('node:child_process')
const { chmodSync, cpSync, mkdirSync, rmSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { version } = require('../package.json')

const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const HOST = { darwin: 'mac', win32: 'win', linux: 'linux' }[process.platform]
const target = process.argv[2] || HOST

const PKG_TARGETS = {
    mac: `node20-macos-${process.arch === 'arm64' ? 'arm64' : 'x64'}`,
    win: 'node20-win-x64',
    linux: 'node20-linux-x64'
}

function run(cmd, args, opts = {}) {
    console.log(`$ ${cmd} ${args.join(' ')}`)
    execFileSync(cmd, args, { stdio: 'inherit', cwd: ROOT, ...opts })
}

function pkgBuild(pkgTarget, outPath) {
    run('npx', ['pkg', '.', '--targets', pkgTarget, '--output', outPath])
}

function compileMacTrayHelper(outPath) {
    // universal binary so the same .app works on Apple Silicon and Intel Macs
    const src = join(ROOT, 'native', 'tray.swift')
    const tmpArm = join(DIST, 'tray-arm64')
    const tmpX64 = join(DIST, 'tray-x64')
    try {
        run('xcrun', ['swiftc', '-O', '-target', 'arm64-apple-macos11', src, '-o', tmpArm])
        run('xcrun', ['swiftc', '-O', '-target', 'x86_64-apple-macos11', src, '-o', tmpX64])
        run('lipo', ['-create', '-output', outPath, tmpArm, tmpX64])
    } catch {
        console.log('universal build failed, compiling for host architecture only')
        run('xcrun', ['swiftc', '-O', src, '-o', outPath])
    } finally {
        rmSync(tmpArm, { force: true })
        rmSync(tmpX64, { force: true })
    }
}

function infoPlist() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key><string>Percy Desktop App</string>
    <key>CFBundleDisplayName</key><string>Percy Desktop App</string>
    <key>CFBundleIdentifier</key><string>com.browserstack.percy-desktop-app</string>
    <key>CFBundleExecutable</key><string>percy-desktop-app</string>
    <key>CFBundleIconFile</key><string>icon.icns</string>
    <key>CFBundlePackageType</key><string>APPL</string>
    <key>CFBundleVersion</key><string>${version}</string>
    <key>CFBundleShortVersionString</key><string>${version}</string>
    <key>LSMinimumSystemVersion</key><string>11.0</string>
    <key>LSUIElement</key><true/>
    <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
`
}

function buildMac() {
    if (process.platform !== 'darwin') throw new Error('the mac build must run on macOS')
    const appDir = join(DIST, 'mac', 'Percy Desktop App.app')
    const contents = join(appDir, 'Contents')
    const macos = join(contents, 'MacOS')
    const resources = join(contents, 'Resources')
    rmSync(appDir, { recursive: true, force: true })
    mkdirSync(macos, { recursive: true })
    mkdirSync(resources, { recursive: true })

    pkgBuild(PKG_TARGETS.mac, join(macos, 'percy-desktop-app'))
    compileMacTrayHelper(join(resources, 'percy-tray'))
    chmodSync(join(resources, 'percy-tray'), 0o755)
    cpSync(join(ROOT, 'assets', 'icon.icns'), join(resources, 'icon.icns'))
    cpSync(join(ROOT, 'assets', 'tray.png'), join(resources, 'tray.png'))
    writeFileSync(join(contents, 'Info.plist'), infoPlist())

    // ad-hoc signature so macOS on Apple Silicon will launch the bundle;
    // replace with a Developer ID identity + notarization for distribution
    run('codesign', ['--force', '--deep', '--sign', '-', appDir])
    console.log(`\nBuilt ${appDir}`)
}

function buildFlat(name) {
    const out = join(DIST, name, `percy-desktop-app${name === 'win' ? '.exe' : ''}`)
    mkdirSync(join(DIST, name), { recursive: true })
    pkgBuild(PKG_TARGETS[name], out)
    console.log(`\nBuilt ${out}`)
}

if (target === 'mac') buildMac()
else if (target === 'win' || target === 'linux') buildFlat(target)
else throw new Error(`Unknown target "${target}" — use mac, win or linux`)

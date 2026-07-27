# Percy Desktop App

A lightweight desktop menu bar app for the [Percy Chrome Extension](https://github.com/BrowserStackCE/percy-chrome-extension), built with plain Node.js — no Electron. It replaces the previous Electron-based desktop app.

The Chrome extension captures DOM snapshots in the browser, but uploading them to Percy requires a local Percy server (the Percy CLI). This app sits in your menu bar / system tray and exposes a small HTTP API on `localhost:3778` that the extension calls to start that server when you finalize a build.

Once launched you get a small Percy icon in the macOS menu bar (or Windows/Linux system tray) with:

- **Percy server: running / stopped** — live status
- **Stop Percy server**
- **Quit**

## Why not Electron?

The Electron app only used Electron for the tray icon — the actual work is a tiny HTTP server that spawns the Percy CLI. This version does the same with a plain Node.js process, a ~100-line native Swift menu bar helper on macOS (universal arm64 + Intel), and the small [systray2](https://www.npmjs.com/package/systray2) helper on Windows/Linux. No ~200 MB browser runtime.

## Install / Run (from a build)

Download or build the app for your OS (see Building below), then:

- **macOS**: open `Percy Desktop App.app` (right-click → Open the first time, since the build is not notarized). The Percy icon appears in the menu bar; there is no Dock icon.
- **Windows**: run `percy-desktop-app.exe`. The tray icon appears next to the clock (a console window with logs also opens).
- **Linux**: run `percy-desktop-app`.

On the first build finalization the app downloads the standalone Percy CLI (~80 MB) from the [official percy/cli releases](https://github.com/percy/cli/releases) into `~/.percy-desktop-app/bin` — a one-time step, after which starting the Percy server takes a few seconds.

## Run from source (development)

Requires Node.js 18+:

```bash
cd desktop-app
npm install
npm start
```

On macOS the native menu bar helper is compiled on first run (needs Xcode command line tools); without them it falls back to the bundled systray helper, and failing that it runs headless. `npm start -- --headless` skips the tray entirely.

## Building the apps

```bash
npm run build:mac     # dist/mac/Percy Desktop App.app   (run on macOS)
npm run build:win     # dist/win/percy-desktop-app.exe
npm run build:linux   # dist/linux/percy-desktop-app
```

Packaging uses [@yao-pkg/pkg](https://github.com/yao-pkg/pkg) to produce self-contained executables (Node.js bundled in — end users do not need Node). The mac build compiles the Swift tray helper as a universal binary, assembles the `.app` bundle (`LSUIElement` = menu-bar-only, no Dock icon), and applies an ad-hoc code signature; for public distribution, sign with a Developer ID certificate and notarize.

## HTTP API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/healthcheck` | App health, plus whether the Percy server is running |
| `POST` | `/percy/start` | Start the local Percy server. Body: Percy config JSON (`version`, `percy.token`, `snapshot`, `discovery`) |
| `POST` | `/percy/snapshot` | Proxy a snapshot upload to the Percy server (which rejects requests with a `chrome-extension://` Origin, so the extension can't call it directly) |
| `POST` | `/percy/stop` | Stop the local Percy server |

`POST /percy/start` responds `200` once the Percy server is healthy, `400` for invalid config, and `500` with the underlying Percy error (e.g. `Invalid API token.`) if the server fails to start.

## Notes

- The server binds to `127.0.0.1` only — it is not reachable from other machines.
- State-changing endpoints (`/percy/start`, `/percy/stop`) reject requests from web page origins; only the Chrome extension (`chrome-extension://` origin) and local tools without an `Origin` header (e.g. `curl`) are accepted. The `Host` header is also validated to defend against DNS rebinding.
- Snapshot/discovery config is written to `~/.percy-desktop-app/.percy.json`. Your Percy token is never written to disk; it is passed to the Percy CLI through the environment.
- Logs are written to `~/.percy-desktop-app/app.log`.
- The Percy server itself listens on `localhost:5338`, the standard Percy CLI port the extension talks to directly for snapshots and stopping.

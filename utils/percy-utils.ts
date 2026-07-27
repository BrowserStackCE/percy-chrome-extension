import type { PercyBuild } from "~schemas/build";
import { type Preferences, PreferncesSchema } from "~schemas/preferences";
import type { Snapshot } from '~schemas/snapshot'
import { AutoCapture } from "./auto-capture";
import { LocalStorage, SessionStorage } from "./storage";

const baseurl = 'http://localhost:5338'
const appUrl = 'http://localhost:3778'
export class Percy {

    static async setToken(token:string){
        const build = await Percy.getBuild()
        build.token = token
        Percy.setBuild(build);
    }

    static createBuild(token: string) {
        return LocalStorage.set('build', {
            token: token,
            snapshots: {}
        })
    }

    static async clearBuild() {
        const build = await Percy.getBuild()
        return Percy.createBuild(build.token)
    }

    static setBuild(build: PercyBuild) {
        return LocalStorage.set('build', build)
    }

    static getBuild() {
        return LocalStorage.get<PercyBuild>('build')
    }

    static listen(callback: (build: PercyBuild) => void) {
        return LocalStorage.listen('build', callback)
    }

    static async addSnapshot(snapshot: Snapshot) {
        const build = await Percy.getBuild()
        build.snapshots[snapshot.options.name] = snapshot
        await Percy.setBuild(build)
    }

    static async isEnabled() {
        return fetch(`${baseurl}/percy/healthcheck`).then((res) => {
            if (res.status == 200) {
                return res.json()
            } else {
                return false
            }
        }).catch(() => false)
    }

    static async sendSnapshot(options: any, params?: any) {
        let query = params ? `?${new URLSearchParams(params)}` : '';
        // routed through the desktop app: percy CLI rejects requests with a
        // chrome-extension:// Origin, the app forwards them origin-less
        return fetch(`${appUrl}/percy/snapshot${query}`, {
            body: JSON.stringify(options),
            method: 'POST'
        }).then(async (res) => {
            if (res.status == 200) {
                return res.json()
            } else {
                throw await res.text()
            }
        })
    }

    static async stopPercy() {
        // routed through the desktop app (percy CLI rejects cross-origin
        // requests); the app POSTs percy's /percy/stop for us
        return fetch(`${appUrl}/percy/stop`, { method: 'POST' }).then((res) => res.status == 200).catch(() => false)
    }

    static async startPercy() {
        const preferences = await LocalStorage.get<Preferences>('preferences', PreferncesSchema.parse({}))
        const build = await Percy.getBuild()
        const percyConfig: any = {}
        const discoveryOptions = {
            ...preferences.discoveryOptions,
            "request-headers": preferences.discoveryOptions?.["request-headers"]?.reduce((map, item) => {
                map[item.key] = item.value
                return map
            }, {}) || {}
        }
        percyConfig['version'] = "2"
        percyConfig['snapshot'] = preferences.defaultSnapshotOptions
        percyConfig['discovery'] = discoveryOptions
        percyConfig['percy'] = {
            token: build.token
        }
        console.log(percyConfig)
        return fetch(`${appUrl}/percy/start`, {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(percyConfig)
        }).then((res) => {
            res.text().then(console.log)
            return res.status == 200
        }).catch((err) => {
            return false
        })
    }

    static async finalise() {
        await LocalStorage.set('finalizing', true)
        // Starting percy and uploading snapshots involve fetches that can run
        // well past 30s, and pending fetches don't reset Chrome's service
        // worker idle timer — without keepalive pings the worker is killed
        // mid-finalize. Extension API calls do reset the timer.
        const keepAlive = setInterval(() => chrome.runtime.getPlatformInfo(), 20_000)
        try {
            const running = await Percy.isEnabled()
            if (!running) {
                const started = await Percy.startPercy()
                if (!started) {
                    return false
                }
            }
            await AutoCapture.stop()
            const build = await Percy.getBuild()
            const errors = []
            const success = []
            const plaformInfo = await chrome.runtime.getPlatformInfo()
            const manifest = chrome.runtime.getManifest()
            for (const snapshot of Object.values(build.snapshots)) {
                const percySnapshot = {
                    // required
                    name: snapshot.options.name,
                    url: snapshot.url,
                    domSnapshot: snapshot.dom,
                    // optional
                    environmentInfo: [`${plaformInfo.os}/${plaformInfo.arch}`],
                    clientInfo: `browser-extension/${manifest.version}`,
                    widths: snapshot.options.widths?.map((w) => Number(w)).filter((w) => !Number.isNaN(w)),
                    minHeight: Number(snapshot.options["min-height"] || 0),
                    enableJavaScript: snapshot.options["enable-javascript"],
                    requestHeaders: snapshot.headers
                }
                try {
                    const res = await Percy.sendSnapshot(percySnapshot)
                    success.push(res)
                } catch (err) {
                    errors.push(err)
                }
            }
            const buildInfo = await Percy.isEnabled()
            await Percy.stopPercy()
            if (errors.length == 0) {
                await Percy.clearBuild()
            }
            console.log(running)
            chrome.tabs.create({
                url: buildInfo?.build?.url
            })
            return true;
        } catch (err) {
            console.log(err)
            return false
        } finally {
            clearInterval(keepAlive)
            await LocalStorage.set('finalizing', false)
        }
    }

}
import { it } from "node:test";
import { PercyBuild } from "~schemas/build";
import { Preferences, PreferncesSchema } from "~schemas/preferences";
import { Snapshot } from '~schemas/snapshot'
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
        return fetch(`${baseurl}/percy/snapshot${query}`, {
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
        return fetch(`${baseurl}/percy/stop`).then((res) => res.status == 200).catch(() => false)
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
                    widths: snapshot.options.widths?.map((w) => Number(w)).filter((w) => w != NaN),
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
            await LocalStorage.set('finalizing', false)
        }
    }

}
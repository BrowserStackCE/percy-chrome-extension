// Minimal menu bar helper for the Percy desktop app.
// Protocol (JSON lines over stdio):
//   stdin:  {"type":"menu","tooltip":"...","items":[{"title":"...","enabled":true}, {"title":"-"}]}
//   stdout: {"type":"ready"} once, then {"type":"click","index":N} per click
// argv[1]: path to the tray icon PNG (rendered as a template image).
// Exits when stdin closes (i.e. the parent Node process dies).
import AppKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem!

    func applicationDidFinishLaunching(_ notification: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        if CommandLine.arguments.count > 1, let image = NSImage(contentsOfFile: CommandLine.arguments[1]) {
            image.isTemplate = true
            image.size = NSSize(width: 18, height: 18)
            statusItem.button?.image = image
        } else {
            statusItem.button?.title = "P"
        }
        statusItem.menu = NSMenu()
        readCommands()
        emit("{\"type\":\"ready\"}")
    }

    func emit(_ line: String) {
        print(line)
        fflush(stdout)
    }

    func readCommands() {
        DispatchQueue.global(qos: .utility).async {
            while let line = readLine(strippingNewline: true) {
                guard let data = line.data(using: .utf8),
                      let command = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any]
                else { continue }
                DispatchQueue.main.async { self.apply(command) }
            }
            DispatchQueue.main.async { NSApp.terminate(nil) }
        }
    }

    func apply(_ command: [String: Any]) {
        guard command["type"] as? String == "menu",
              let itemSpecs = command["items"] as? [[String: Any]]
        else { return }
        let menu = NSMenu()
        menu.autoenablesItems = false
        for (index, spec) in itemSpecs.enumerated() {
            let title = spec["title"] as? String ?? ""
            if title == "-" {
                menu.addItem(.separator())
                continue
            }
            let item = NSMenuItem(title: title, action: #selector(clicked(_:)), keyEquivalent: "")
            item.target = self
            item.tag = index
            item.isEnabled = spec["enabled"] as? Bool ?? true
            menu.addItem(item)
        }
        statusItem.menu = menu
        if let tooltip = command["tooltip"] as? String {
            statusItem.button?.toolTip = tooltip
        }
    }

    @objc func clicked(_ sender: NSMenuItem) {
        emit("{\"type\":\"click\",\"index\":\(sender.tag)}")
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = AppDelegate()
app.delegate = delegate
app.run()

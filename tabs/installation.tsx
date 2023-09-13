import {
  ConfigProvider,
  Layout,
} from "antd"
import Logo from "data-base64:~assets/icon.svg"
import React from "react"


import theme from "../theme"

import "./installation.scss"

export default function Installation() {
  return (
    <ConfigProvider theme={theme}>
      <Layout className="layout">
        <Layout.Header className="header">
          <div className="content">
            <div className="logo">
              <img src={Logo} alt="Percy | BrowserStack" />
            </div>
          </div>
        </Layout.Header>
        <Layout.Content className="background-container">
          <div className="content-container">
            <h1>Getting Started with Percy Chrome Extension</h1>

            <p>
              Make sure the steps below are followed to compare your snapshots
              on Percy:
            </p>

            <h2>Step 1: Signup/Login to your Percy Account</h2>
            <ul>
              <li>
                Visit <a href="https://percy.io/">percy.io</a>, sign in or Login
                here
              </li>
            </ul>

            <h2>Step 2: Create a Percy Project</h2>
            <ul>
              <li>
                Visit <a href="https://percy.io/">percy.io</a>
              </li>
              <li>Go to dashboard & click "Create new project".</li>
              <li>Specify the "Project name".</li>
              <li>Click "Create Project".</li>
            </ul>

            <h2>Step 3: Using Percy Token</h2>
            <ul>
              <li>
                After the project is created, a token is generated which will
                identify your project builds to Percy servers.
              </li>
            </ul>

            <h2>Step 4: Download Percy Executable file</h2>
            <ul>
              <li>
                Based on your device OS download Percy executable for
                <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-osx.zip">
                  &nbsp;MAC
                </a>
                <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-win.zip">
                  &nbsp;, Windows
                </a>
                &nbsp;or
                <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-linux.zip">
                  &nbsp;Linux
                </a>
              </li>
              <li>Unzip the file and open the extracted Percy Folder</li>
              <li>
                Start the command line at this specific location of Percy
                executable
              </li>
            </ul>

            <h2>Step 5: Start Percy Server</h2>
            <ul>
              <li>
                Export the PERCY_TOKEN from the project settings in your command
                line, e.g.,
              </li>
              <li>
                <code>export PERCY_TOKEN=&lt;YOUR_PERCY_TOKEN&gt;</code>
              </li>
              <li>
                After adding your PERCY_TOKEN, start percy server using this
                command: <code>npx percy exec:start</code>
              </li>
            </ul>

            <h2>Step 6: Using Chrome Extension</h2>
            <ul>
              <li>
                You can use the chrome extension interface to capture a single
                snapshot or auto-capture snapshots
              </li>
              <li>
                Once all snapshots are captured, you can review them from the
                view snapshots page or finalize the build
              </li>
              <li>
                When the build is finalized, the extension automatically
                navigates you to the Percy project dashboard where you can
                review the changes.
              </li>
            </ul>
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

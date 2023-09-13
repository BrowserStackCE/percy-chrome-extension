import { ConfigProvider, Layout } from "antd"
import Logo from "data-base64:~assets/icon.svg"
import React from "react"

import theme from "../theme"

import "./getStarted.scss"

export default function GettingStarted() {
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
        <Layout.Content className="getStarted-content">
          <h1>Getting Started with Percy Chrome Extension</h1>
          <div>
            <div>
              <h2>Step 1: Sign Up/Login to your Percy Account</h2>
              <ul>
                <li>
                  Visit <a href="https://percy.io/">percy.io</a>
                </li>
                <li>Click "Sign Up" or "Log In" to access your account</li>
              </ul>
            </div>
            <div>
              <h2>Step 2: Create a Percy Project</h2>
              <ul>
                <li>
                  From <a href="https://percy.io/">percy.io</a>
                </li>
                <li>Go to the dashboard</li>
                <li>Click "Create New Project"</li>
                <li>Specify the "Project Name"</li>
                <li>Click "Create Project"</li>
                <li>
                  After you've created the project, you'll be shown a token
                  environment variable.
                </li>
                <li>You can use this token in Step 4</li>
              </ul>
            </div>
            <div>
              <h2>Step 3: Download Percy Executable</h2>
              <ul>
                <li>
                  Download the Percy executable for your operating system:
                </li>
                <ul>
                  <li>
                    <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-osx.zip">
                      Mac
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-win.zip">
                      Windows
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/percy/cli/releases/download/v1.27.1/percy-linux.zip">
                      Linux
                    </a>
                  </li>
                </ul>
                <li>Unzip the downloaded file</li>
                <li>Open the extracted Percy folder</li>
                <li>
                  Start the command line at this specific location of the Percy
                  executable
                </li>
              </ul>
            </div>
            <div>
              <h2>Step 4: Export Percy Token</h2>
              <ul>
                <li>
                  Copy the token from project settings page, as discussed in
                  Step2{" "}
                </li>
                <li>Export this token in your command line:</li>
                <code>export PERCY_TOKEN=&lt;YOUR_PERCY_TOKEN&gt;</code>
              </ul>
            </div>
            <div>
              <h2>Step 5: Start Percy Server</h2>
              <ul>
                <li>
                  After adding your PERCY_TOKEN, start the Percy server using
                  this command:
                </li>
                <code>npx percy exec:start</code>
              </ul>
            </div>
            <div>
              <h2>Step 6: Use Chrome Extension</h2>
              <ul>
                <li>
                  Use the Chrome extension interface to capture single snapshots
                  or auto-capture snapshots
                </li>
                <li>
                  After capturing all snapshots, you can review them from the
                  "View Snapshots" page
                </li>
                <li>
                  Once the build is finalized, the extension will automatically
                  navigate you to the Percy project dashboard to review the
                  changes
                </li>
              </ul>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

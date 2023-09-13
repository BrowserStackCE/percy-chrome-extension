// import "./index.css"

import { FileDoneOutlined, UserOutlined } from "@ant-design/icons"
import { Layout, Menu, theme } from "antd"
import Logo from "data-base64:~assets/icon.svg"
import React from "react"

const { Header, Content, Footer, Sider } = Layout

const App: React.FC = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Getting Started"
            },
            {
              key: "2",
              icon: <FileDoneOutlined />,
              label: "Go to Percy Docs"
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              fontFamily: "verdana"
            }}>
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
        </Content>
        <Footer style={{ textAlign: "center" }}>BrowserStack ©2023 </Footer>
      </Layout>
    </Layout>
  )
}

export default App

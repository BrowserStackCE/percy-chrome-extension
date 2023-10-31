import { ConfigProvider, Layout } from "antd"
import Logo from "data-base64:~assets/icon.svg"
import './index.scss'
import theme from "~theme"
import { Route, Routes } from 'react-router-dom'
import { StaticRouter as Router } from "react-router-dom/server";
import { StartView } from "~views/start.view"
import { CaptureView } from "~views/capture.view"
import { useLocalStorage } from "~hooks/use-storage"

function IndexPopup() {
  return (
    <ConfigProvider theme={theme}>
      <Router location={'/capture'} >
        <Layout className="popup-layout">
          <Layout.Header className="header">
            <div className="content">
              <div className="logo">
                <img src={Logo} alt="Percy | BrowserStack" />
              </div>
            </div>
          </Layout.Header>
          <Layout.Content className="popup-content">
            <Routes>
              <Route path="/capture" element={<CaptureView />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default IndexPopup

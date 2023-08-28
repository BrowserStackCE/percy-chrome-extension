import { ConfigProvider, Layout } from "antd"
import Logo from "data-base64:~assets/icon.svg"
import '~styles.scss'
import theme from "~theme"
import { Route, Routes } from 'react-router-dom'
import { StaticRouter as Router } from "react-router-dom/server";
import { StartView } from "~views/start.view"
import { CaptureView } from "~views/capture.view"
import { useRoute } from "~ hooks/use-route"
import { SnapshotsListView } from "~views/snapshots-list.view"
function IndexPopup() {
  const { route } = useRoute()
  return (
    <ConfigProvider theme={theme}>
      <Router location={route} >
        <Layout className="popup-layout">
          <Layout.Header className="header">
            <div className="logo">
              <img src={Logo} alt="Percy | BrowserStack" />
            </div>
          </Layout.Header>
          <Layout.Content className="popup-content">
            <Routes>
              <Route path="/" element={<StartView />} />
              <Route path="/capture" element={<CaptureView />} />
              <Route path="/snapshots" element={<SnapshotsListView />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default IndexPopup

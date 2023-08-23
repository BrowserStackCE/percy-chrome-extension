import { Button, ConfigProvider, Divider, Form, Input, Layout, Space } from "antd"
import { useState } from "react"
import Logo from "data-base64:~assets/icon.svg"
import './styles.scss'
import theme from "~theme"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <ConfigProvider theme={theme}>
      <Layout className="popup-layout">
        <Layout.Header className="header">
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
        </Layout.Header>
        <Layout.Content className="popup-content">
          <Form>
            <Form.Item label="Snapshot Name">
              <Input size="large" />
            </Form.Item>
            <Form.Item>
              <Button size="large" block>Capture</Button>
            </Form.Item>
          </Form>
          <Button block size="large" type="primary" >Auto Capture</Button>
          <Divider />
          <Space style={{width:'100%'}} direction="vertical" >
            <Button block size="large" type="dashed" >View Snapshots</Button>
            <Button block size="large" type="primary" >Finalize</Button>
          </Space>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  )
}

export default IndexPopup

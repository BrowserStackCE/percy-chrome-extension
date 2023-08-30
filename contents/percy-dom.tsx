import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import Serialize from '@percy/dom'
import { ConfigProvider, Form, Modal } from "antd"
import SnapshotForm from "~components/snapshot.form"
import theme from "~theme"
import { useState } from "react"
export const config: PlasmoCSConfig = {}
export default function SnapshotModal() {
    const [modalOpen, SetModalOpen] = useState(false)
    useMessage<any, any>(async (req, res) => {
        if (req.name === 'take_snapshot') {
            const body = req.body as any
            const dom = Serialize({ enableJavascript: body.enableJavascript || false })
            res.send({
                dom
            })
        }
    })
    return <ConfigProvider theme={theme} >
        <Modal okText="Capture" onCancel={() => SetModalOpen(false)} title="Take Snapshot" open={modalOpen} >
            <Form layout="vertical">
                <SnapshotForm />
            </Form>
        </Modal>
    </ConfigProvider>;
}
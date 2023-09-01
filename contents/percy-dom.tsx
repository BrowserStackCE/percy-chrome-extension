import type { PlasmoCSConfig } from "plasmo"
import { useMessage } from "@plasmohq/messaging/hook"
import Serialize from '@percy/dom'
import { ConfigProvider, Form, Modal } from "antd"
import SnapshotForm from "~components/snapshot.form"
import theme from "~theme"
import { useState } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { SnapshotOptions, SnapshotOptionsSchema } from "~schemas/snapshot"


export const config: PlasmoCSConfig = {}

export default function SnapshotModal() {
    const [modalOpen, SetModalOpen] = useState(false)
    const [capturing, SetCapturing] = useState(false)
    const [form] = Form.useForm()
    useMessage<SnapshotOptions, void>(async (req, res) => {
        console.debug(`Received Request ${JSON.stringify(req, undefined, 2)}`)
        if (req.name === 'take_snapshot') {
            try {
                const options = SnapshotOptionsSchema.parse(req.body)
                actions.captureSnapshot(options)
            } catch (err) {
                console.error(err)
            }
        } else if (req.name === 'take_snapshot_with_modal') {
            SetModalOpen(true)
        }
        res.send()
    })

    const actions = {
        captureSnapshot: async (options: SnapshotOptions) => {
            console.info(`Serializing the DOM`)
            try {
                const dom = Serialize({ enableJavascript: options['enable-javascript'] || false })
                console.info(`DOM serialized successfully`)
                await sendToBackground({
                    name: "save-snapshot",
                    body: {
                        dom,
                        options
                    }
                })
            } catch (err) {
                console.error(err)
            }
        },
        captureSnapshotWithModal: async () => {
            console.info("Capturing the snapshot")
            SetCapturing(true)
            form.validateFields().then(async (options) => {
                console.info("Closing the Modal")
                SetModalOpen(false)
                console.info(`Capturing the snapshot with options ${JSON.stringify(options)}`)
                setTimeout(()=>{
                    actions.captureSnapshot(options)
                },500)
            }).finally(() => {
                SetCapturing(false)
            })
        }
    }
    return <ConfigProvider theme={theme} >
        <Modal okButtonProps={{ loading: capturing }} onOk={actions.captureSnapshotWithModal} okText="Capture" onCancel={() => SetModalOpen(false)} title="Take Snapshot" open={modalOpen} >
            <Form form={form} layout="vertical">
                <SnapshotForm />
            </Form>
        </Modal>
    </ConfigProvider>;
}
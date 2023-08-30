import { sendToContentScript } from "@plasmohq/messaging";
import { Button, Divider, Form, Input, Modal, Space } from "antd";
import React from "react";
import { useRoute } from "~hooks/use-route";
import SnapshotForm from "~components/snapshot.form";

export function CaptureView() {
    const { Navigate } = useRoute()
    const [form] = Form.useForm()
    const actions = {
        capture: () => {
            sendToContentScript({
                name: 'take_snapshot',
                body:{
                    enableJavascript: false,
                    options: form.getFieldsValue()
                }
            }).then(console.info)
        },
        cancelBuild: () => {
            Navigate('/')
        },
        viewSnapshots: () => {
            Navigate('/snapshots')
        }
    }

    return (
        <React.Fragment>
            <Form form={form} layout="vertical">
                <SnapshotForm />
            </Form>
            <Space className="w-100" direction="vertical">
                <Button onClick={actions.capture} block size="large" >Capture Snapshot</Button>
                <Button block size="large" type="primary" >Enable Auto Capture</Button>
            </Space>
            <Divider />
            <Space className="w-100" direction="vertical" >
                <Button onClick={actions.viewSnapshots} block size="large" type="dashed" >View Snapshots</Button>
                <Button block size="large" type="primary" >Finalize</Button>
                <Button onClick={actions.cancelBuild} block size="large" danger type="text" >Cancel Build</Button>
            </Space>
        </React.Fragment>
    )
}
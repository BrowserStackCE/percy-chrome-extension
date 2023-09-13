import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";
import { Button, Divider, Form, Input, message, Modal, Space } from "antd";
import React, { useState } from "react";
import SnapshotForm from "~components/snapshot.form";
import { useAutoCapture } from "~hooks/use-autocapture";
import { useFinalizing } from "~hooks/use-finalizing";
import { DeleteBuild } from "~utils/build";

export function CaptureView() {
    const [form] = Form.useForm()
    const { autoCapture, ToggleAutoCapture } = useAutoCapture()
    const [capturing,SetCapturing] = useState(false)
    const {finalizing,triggerFinalize} = useFinalizing()
    const actions = {
        capture: () => {
            SetCapturing(true)
            form.validateFields().then(async (options)=>{
                console.debug(`Snapshot Options: ${JSON.stringify(options, undefined, 2)}`)
                await sendToContentScript({
                    name: 'take_snapshot',
                    body: options
                }).then(() => {
                    form.resetFields(['name']);
                }).catch((err)=>{
                    console.error(err)
                    message.error(err)
                })
            }).catch(console.error).finally(()=>{
                SetCapturing(false)
            })
        },
        cancelBuild: () => {
            DeleteBuild()
        },
        viewSnapshots: () => {
            chrome.tabs.create({
                url: "./tabs/snapshots.html"
            })
        },
        toggleCapture: () => {
            ToggleAutoCapture()
        },
        finaliseBuild:()=>{
            triggerFinalize()
        }
    }

    return (
        <React.Fragment>
            <Form form={form} layout="vertical">
                <SnapshotForm />
            </Form>
            <Space className="w-100" direction="vertical">
                <Button loading={capturing} onClick={actions.capture} block size="large" >Capture Snapshot</Button>
                <Button danger={autoCapture} onClick={actions.toggleCapture} block size="large" type="primary" >{autoCapture ? "Stop Auto Capture" : "Start Auto Capture"}</Button>
            </Space>
            <Divider />
            <Space className="w-100" direction="vertical" >
                <Button onClick={actions.viewSnapshots} block size="large" type="dashed" >View Snapshots</Button>
                <Button loading={finalizing} onClick={actions.finaliseBuild} block size="large" type="primary" >Finalize</Button>
                <Button onClick={actions.cancelBuild} block size="large" danger type="text" >Cancel Build</Button>
            </Space>
        </React.Fragment>
    )
}
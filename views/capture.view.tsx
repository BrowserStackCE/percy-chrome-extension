import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";
import { Button, Divider, Form, Input, message, Modal, Popconfirm, Space } from "antd";
import React, { useEffect, useState } from "react";
import SnapshotForm from "~components/snapshot.form";
import { useAutoCapture } from "~hooks/use-autocapture";
import { usePreferences } from "~hooks/use-preferences";
import { DeleteBuild } from "~utils/build";

export function CaptureView() {
    const [form] = Form.useForm()
    const { autoCapture, ToggleAutoCapture } = useAutoCapture()
    const [capturing, SetCapturing] = useState(false)
    const [finalizing, SetFinalising] = useState(false)
    const { preferences } = usePreferences()
    const actions = {
        capture: () => {
            SetCapturing(true)
            form.validateFields().then(async (options) => {
                console.debug(`Snapshot Options: ${JSON.stringify(options, undefined, 2)}`)
                await sendToContentScript({
                    name: 'take_snapshot',
                    body: options
                }).then(() => {
                    form.resetFields(['name']);
                }).catch((err) => {
                    console.error(err)
                    message.error(err)
                })
            }).catch(console.error).finally(() => {
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
        finaliseBuild: () => {
            SetFinalising(true)
            sendToBackground({ name: 'finalize-build' }).finally(() => {
                SetFinalising(false)
            }).then(() => {

            })
        }
    }
    useEffect(() => {
        if (preferences) {
            form.setFieldsValue(preferences.defaultOptions)
        }
    }, [preferences])
    return (
        <React.Fragment>
            <Form initialValues={{ options: preferences?.defaultOptions }} form={form} layout="vertical">
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
                <Popconfirm onConfirm={actions.cancelBuild} title="Cancel Build?" description="Are you sure you want to Cancel this build? This cannot be undone.">
                    <Button block size="large" danger type="text" >Cancel Build</Button>
                </Popconfirm>
            </Space>
        </React.Fragment>
    )
}
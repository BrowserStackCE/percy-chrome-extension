import { CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging";
import { Button, Divider, Form, Input, message, notification, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import SnapshotForm from "~components/snapshot.form";
import { useLocalStorage, useSessionStorage } from "~hooks/use-storage";
import type { PercyBuild } from "~schemas/build";
import { PreferncesSchema } from "~schemas/preferences";
import { SnapshotOptionsSchema, SnapshotSchema } from "~schemas/snapshot";
import { Percy } from "~utils/percy-utils";

export function CaptureView() {
    const [form] = Form.useForm()
    const [autoCapture, SetAutoCapture] = useLocalStorage('autoCapture', false)
    const [capturing, SetCapturing] = useState(false)
    const [finalizing] = useLocalStorage('finalizing', false)
    const [preferences] = useLocalStorage('preferences', PreferncesSchema.parse({}))
    const [build] = useLocalStorage<PercyBuild>('build')
    const [editPercyToken, SetEditPercyToken] = useState(false)
    const actions = {
        capture: () => {
            SetCapturing(true)
            form.validateFields().then(async (res) => {
                const options = SnapshotOptionsSchema.parse(res.options)
                await sendToContentScript({
                    name: 'take_snapshot',
                    body: {
                        name: res.name,
                        options
                    }
                }).then(() => {
                    form.resetFields(['name']);
                }).catch((err) => {
                    console.error(err)
                    message.error(err)
                })
            }).catch((err) => {
                console.error(err)
                message.error(err)
            }).finally(() => {
                SetCapturing(false)

            })
        },
        cancelBuild: () => {
            Percy.clearBuild()
        },
        viewSnapshots: () => {
            chrome.tabs.create({
                url: "./tabs/snapshots.html"
            })
        },
        toggleCapture: () => {
            SetAutoCapture(!autoCapture)
        },
        finaliseBuild: () => {
            sendToBackground({ name: 'finalize-build' }).then((res) => {
                if (!res) {
                    message.error("Failed to start percy. Please make sure the desktop app is running and Percy token was entered correctly.")
                }
            })
        }
    }
    useEffect(() => {
        if (preferences) {
            form.setFieldsValue({ options: preferences.defaultSnapshotOptions })
        }
    }, [preferences])

    useEffect(() => {
        if (editPercyToken == false && build) {
            const token = form.getFieldValue('token')
            Percy.setToken(token)
        }
    }, [editPercyToken])

    useEffect(() => {
        form.setFieldValue('token', build?.token)
    }, [build])
    return (
        <React.Fragment>
            <Form form={form} initialValues={{ options: preferences?.defaultSnapshotOptions, token: build?.token }} layout="vertical">
                <Form.Item label="Percy Token" name={['token']} >
                    <Input onBlur={() => SetEditPercyToken(!editPercyToken)} addonAfter={<Button type='text' onClick={() => SetEditPercyToken(!editPercyToken)} icon={editPercyToken ? <CheckCircleOutlined /> : <EditOutlined />} />} disabled={!editPercyToken} size="large" />
                </Form.Item>
                <SnapshotForm />
            </Form>
            <Space className="w-100" direction="vertical">
                <Tooltip title="Alt + Q">
                <Button loading={capturing} onClick={actions.capture} block size="large" >Capture Snapshot</Button>
                </Tooltip>
                <Button danger={autoCapture} onClick={actions.toggleCapture} block size="large" type="primary" >{autoCapture ? "Stop Auto Capture" : "Start Auto Capture"}</Button>
            </Space>
            <Divider />
            <Space className="w-100" direction="vertical" >
                <Button onClick={actions.viewSnapshots} block size="large" type="dashed" >View Snapshots</Button>
                <Button loading={finalizing} onClick={actions.finaliseBuild} block size="large" type="primary" >Finalize</Button>
                <Popconfirm onConfirm={actions.cancelBuild} title="Clear Build?" description="Are you sure you want to Clear this build? This cannot be undone.">
                    <Button block size="large" danger type="text" >Clear Build</Button>
                </Popconfirm>
            </Space>
            <Divider/>
            <Space direction="vertical" >
                <Typography.Title level={4} >Keyboard Shortcuts</Typography.Title>
                <div>
                    <Tag>Alt | ⌥</Tag> + Q : Capture Snapshot
                </div>
                <div>
                    <Tag>Alt | ⌥</Tag> + W : Toggle Autocapture
                </div>
                <div>
                    <Tag>Alt | ⌥</Tag> + E : View Snapshots
                </div>
                <div>
                    <Tag>Alt | ⌥</Tag> + R : Open Options
                </div>
            </Space>
        </React.Fragment>
    )
}
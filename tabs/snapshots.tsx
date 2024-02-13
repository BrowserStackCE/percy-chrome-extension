import { Button, Card, Col, ConfigProvider, Descriptions, Empty, Form, Layout, message, Modal, Popconfirm, Row, Space, Table } from "antd";
import React, { useState } from "react";
import './snapshots.scss';
import Logo from "data-base64:~assets/icon.svg";
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import theme from '../theme'
import SnapshotForm from "~components/snapshot.form";
import { Snapshot } from "~schemas/snapshot";
import { useLocalStorage, useSessionStorage } from "~hooks/use-storage";
import { Percy } from "~utils/percy-utils";
import { sendToBackground } from "@plasmohq/messaging";
import { PercyBuild } from "~schemas/build";
export default function SnapshotsList() {
    const [build] = useLocalStorage<PercyBuild>('build')
    const [modalOpen, SetModal] = useState({ open: false, name: undefined })
    const [finalizing] = useLocalStorage('finalizing', false)
    const [form] = Form.useForm()
    const actions = {
        editSnapshot: (snapshot: Snapshot, name: string) => {
            form.setFieldsValue({ options: snapshot.options,name:snapshot.options.name });
            SetModal({ open: true, name })
        },
        updateSnapshot: () => {
            form.validateFields().then(({ options,name }) => {
                const snapshot = build.snapshots[modalOpen.name]
                if (snapshot) {
                    snapshot.options = options
                    snapshot.options.name = name
                    build.snapshots[options.name] = snapshot
                    build.snapshots[modalOpen.name].options = options
                    delete build.snapshots[modalOpen.name]
                    Percy.setBuild(build)
                    form.resetFields()
                    SetModal({ open: false, name: undefined })
                }
                
            })
        },
        deleteSnapshot: (name: string) => {
            delete build.snapshots[name]
            Percy.setBuild(build)
        },
        finalize: () => {
            sendToBackground({ name: 'finalize-build' }).then((res) => {
                if (!res) {
                    message.error("Failed to start percy. Please make sure the desktop app is running and Percy token was entered correctly.")
                }
            })
        },
        clearBuild: () => {
            Percy.clearBuild()
        },
        openPreview: (snapshot: Snapshot) => {
            var newWindow = window.open("");
            newWindow.document.write(snapshot.dom.html)
        }
    }
    return (
        <ConfigProvider theme={theme}>
            <Layout className="layout" >
                <Layout.Header className="header">
                    <div className="content">
                        <div className="logo">
                            <img src={Logo} alt="Percy | BrowserStack" />
                        </div>
                    </div>
                    <Space>
                        <Button loading={finalizing} onClick={actions.finalize} type="primary" >Finalize</Button>
                        <Popconfirm onConfirm={actions.clearBuild} title="Clear Snapshots?" description="Are you sure you want to clear all captured snapshots?">
                            <Button >Clear</Button>
                        </Popconfirm>
                    </Space>
                </Layout.Header>
                <Layout.Content>
                    <Table columns={[
                        {
                            key: "name",
                            title: "Snapshot Name",
                            dataIndex: ["options", "name"]
                        },
                        {
                            key: "widths",
                            title: "Widths",
                            dataIndex: ["options", "widths"],
                            render: (widths) => widths.join(',')
                        },
                        {
                            key: "min-height",
                            title: "Min Height",
                            dataIndex: ["options", "min-height"]
                        },
                        {
                            key: "enable-javascript",
                            title: "Enable Javascript",
                            dataIndex: ["options", "enable-javascript"],
                            render: (val, record) => val || "false"
                        },
                        {
                            key: "actions",
                            render: (_, record) => {
                                return (
                                    <Space>
                                        <Button onClick={() => actions.editSnapshot(record, record.options.name)} icon={<EditOutlined />} />
                                        {/* <Button onClick={() => actions.openPreview(record)} icon={<EyeOutlined/>} /> */}
                                        <Popconfirm key="delete" onConfirm={() => actions.deleteSnapshot(record.options.name)} title="Delete Snapshot?" description="Are you sure you want to delete this snapshot? This cannot be undone.">
                                            <Button danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </Space>
                                )
                            }
                        }
                    ]} dataSource={Object.values(build?.snapshots || {})} />
                    {/* <Row style={{ padding: 20 }} gutter={[20, 20]}>
                        {Object.values(build?.snapshots || {}).map((snapshot) => {
                            return (
                                <Col key={snapshot.options.name} span={24} lg={6}>
                                    <Card extra={[
                                        <Popconfirm key="delete" onConfirm={() => actions.deleteSnapshot(snapshot.options.name)} title="Delete Snapshot?" description="Are you sure you want to delete this snapshot? This cannot be undone.">
                                            <Button danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    ]} title={snapshot.options?.name} className="card" actions={[
                                        <Button type="primary" onClick={() => actions.editSnapshot(snapshot, snapshot.options.name)} block key="edit" icon={<EditOutlined />} >Edit</Button>,
                                        <Button onClick={() => actions.openPreview(snapshot)} >Preview</Button>
                                    ]} >
                                        <img className="item-image" src={snapshot.screenshot} alt={snapshot.options.name} />
                                        <Descriptions column={1} >
                                            {Object.entries(snapshot.options).map(([key, value], i) => {
                                                return (
                                                    <Descriptions.Item key={key + i} label={key} >{value?.toString()}</Descriptions.Item>
                                                )
                                            })}
                                        </Descriptions>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row> */}
                    {/* {Object.values(build?.snapshots || {}).length > 0 ? null : <div className="empty-container">
                        <Empty description="No snapshots captured yet." />
                    </div>} */}
                    <Modal onOk={actions.updateSnapshot} okText="Save" onCancel={() => SetModal({ open: false, name: undefined })} title="Take Snapshot" open={modalOpen.open} >
                        <Form form={form} layout="vertical">
                            <SnapshotForm />
                        </Form>
                    </Modal>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    )
}
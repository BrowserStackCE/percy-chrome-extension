import { Button, Card, Col, ConfigProvider, Descriptions, Empty, Form, Layout, Modal, Popconfirm, Row, Space } from "antd";
import React, { useState } from "react";
import './snapshots.scss';
import Logo from "data-base64:~assets/icon.svg";
import { usePercyBuild } from "~hooks/use-percy-state";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import theme from '../theme'
import SnapshotForm from "~components/snapshot.form";
import { Snapshot } from "~schemas/snapshot";
import { ClearBuild, UpdateBuild } from "~utils/build";
export default function SnapshotsList() {
    const { build } = usePercyBuild()
    const [modalOpen, SetModal] = useState({ open: false, index: undefined })
    const [form] = Form.useForm()
    const actions = {
        editSnapshot: (snapshot: Snapshot, index: number) => {
            form.setFieldsValue(snapshot.options);
            SetModal({ open: true, index: index })
        },
        updateSnapshot: () => {
            form.validateFields().then((options) => {
                build.snapshots[modalOpen.index].options = options
                UpdateBuild(build)
                form.resetFields()
                SetModal({ open: false, index: undefined })
            })
        },
        deleteSnapshot: (index: number) => {
            build.snapshots = build.snapshots.filter((s, i) => i !== index);
            UpdateBuild(build)
        },
        clearBuild: ()=>{
            ClearBuild()
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
                        <Button type="primary" >Finalize</Button>
                        <Popconfirm onConfirm={actions.clearBuild} title="Clear Snapshots?" description="Are you sure you want to clear all captured snapshots?">
                            <Button >Clear</Button>
                        </Popconfirm>
                    </Space>
                </Layout.Header>
                <Layout.Content>
                    <Row style={{ padding: 20 }} gutter={[20, 20]}>
                        {build?.snapshots?.map((snapshot, i) => {
                            return (
                                <Col key={i} span={24} lg={6}>
                                    <Card extra={[
                                        <Popconfirm onConfirm={() => actions.deleteSnapshot(i)} title="Delete Snapshot?" description="Are you sure you want to delete this snapshot? This cannot be undone.">
                                            <Button danger key="delete" icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    ]} title={snapshot.options?.name} className="card" actions={[
                                        <Button type="primary" onClick={() => actions.editSnapshot(snapshot, i)} block key="edit" icon={<EditOutlined />} >Edit</Button>
                                    ]} >
                                        <img className="item-image" src={snapshot.screenshot} alt={snapshot.options.name} />
                                        <Descriptions column={1} >
                                            {Object.entries(snapshot.options).map(([key, value]) => {
                                                return (
                                                    <Descriptions.Item key={key} label={key} >{value?.toString()}</Descriptions.Item>
                                                )
                                            })}
                                        </Descriptions>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                    {build?.snapshots?.length > 0 ? null : <div className="empty-container">
                        <Empty description="No snapshots captured yet." />
                    </div>}
                    <Modal onOk={actions.updateSnapshot} okText="Save" onCancel={() => SetModal({ open: false, index: undefined })} title="Take Snapshot" open={modalOpen.open} >
                        <Form form={form} layout="vertical">
                            <SnapshotForm />
                        </Form>
                    </Modal>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    )
}
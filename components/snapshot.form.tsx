import { Collapse, Form, Input, Select, Space, Switch } from "antd";
import React from "react";

export default function SnapshotForm() {
    return (
        <React.Fragment>
            <Form.Item rules={[{
                required: true
            }]} name="name" className="mb-0" label="Snapshot Name">
                <Input size="large" />
            </Form.Item>
            <Collapse expandIconPosition='end' ghost items={[{
                key: "options",
                label: "Snapshot Options",
                forceRender: true,
                children: (
                    <SnapshotForm.Options />
                )
            }]} />
        </React.Fragment>
    )
}

SnapshotForm.Options = function () {
    return (
        <React.Fragment>
            <Form.Item rules={[{
                required: true
            }]} name="widths" initialValue={["375", "1280"]} label="Widths" >
                <Select mode="tags" />
            </Form.Item>
            <Form.Item rules={[{
                required: true
            }]} name="min-height" initialValue={"1024"} label="Min Height" >
                <Input inputMode="numeric" type="number" />
            </Form.Item>
            <Form.Item name="percy-css" label="Percy CSS" >
                <Input.TextArea autoSize style={{ minHeight: 100 }} />
            </Form.Item>
            <Form.Item valuePropName="checked" initialValue={false} rules={[{
                required: true
            }]} name="enable-javascript" label="Enable Javascript" >
                <Switch />
            </Form.Item>
            <Form.Item name="scope" label="Scope" >
                <Input />
            </Form.Item>
        </React.Fragment>
    )
}
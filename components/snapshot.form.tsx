import { Collapse, Form, Input, Select, Space, Switch } from "antd";
import React from "react";

export default function SnapshotForm() {
    return (
        <React.Fragment>
            <Form.Item name="name" className="mb-0" label="Snapshot Name">
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
            }]} name={["options","widths"]} label="Widths" >
                <Select mode="tags" />
            </Form.Item>
            <Form.Item rules={[{
                required: true
            }]} name={["options","min-height"]} label="Min Height" >
                <Input inputMode="numeric" type="number" />
            </Form.Item>
            <Form.Item name={["options","percy-css"]} label="Percy CSS" >
                <Input.TextArea autoSize style={{ minHeight: 100 }} />
            </Form.Item>
            <Form.Item valuePropName="checked" rules={[{
                required: true
            }]} name={["options","enable-javascript"]} label="Enable Javascript" >
                <Switch />
            </Form.Item>
            <Form.Item valuePropName="checked" rules={[{
                required: true
            }]} name={["options","enable-layout"]} label="Layout Only" >
                <Switch />
            </Form.Item>
            <Form.Item name={["options","scope"]} label="Scope" >
                <Input  />
            </Form.Item>
        </React.Fragment>
    )
}
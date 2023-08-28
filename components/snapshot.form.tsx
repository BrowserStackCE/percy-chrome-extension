import { Collapse, Form, Input, Select, Space } from "antd";
import React from "react";

export default function SnapshotForm() {
    return (
        <React.Fragment>
            <Form.Item className="mb-0" label="Snapshot Name">
                <Input size="large" />
            </Form.Item>
            <Collapse expandIconPosition='end' ghost items={[
                {
                    key: 'per-snapshot-options',
                    label: "Per Snapshot Options",
                    children: (
                        <React.Fragment>
                            <Form.Item name="widths" initialValue={["375", "1280"]} label="Widths" >
                                <Select mode="tags" />
                            </Form.Item>
                            <Form.Item name="min-height" initialValue={"1024"} label="Min Height" >
                                <Input inputMode="numeric" type="number" />
                            </Form.Item>
                            <Form.Item name="percy-css" label="Percy CSS" >
                                <Input.TextArea autoSize style={{ minHeight: 100 }} />
                            </Form.Item>
                            <Form.Item name="scope" label="Scope" >
                                <Input />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            ]} />
        </React.Fragment>
    )
}
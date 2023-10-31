import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Typography } from "antd";
import React from "react";

export default function DiscoveryOptionsForm() {
    return (
        <React.Fragment>
            <Form.Item label="Allowed Hostnames" name={["allowed-hostnames"]} >
                <Select mode="tags" />
            </Form.Item>
            <Form.Item label="Disallowed Hostnames" name={["disallowed-hostnames"]} >
                <Select mode="tags" />
            </Form.Item>
            <Form.List name={["request-headers"]} >
                {(fields, { add, remove }) => {
                    return (
                        <React.Fragment>
                            <label style={{ marginBottom: '1rem', display: 'block' }}>Headers</label>
                            {fields.map((field) => {
                                return (
                                    <Space>
                                        <Form.Item name={[field.name, "key"]}>
                                            <Input placeholder="Key" size="large" />
                                        </Form.Item>
                                        <Form.Item name={[field.name, "value"]}>
                                            <Input placeholder="Value" size="large" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button onClick={() => remove(field.name)} icon={<DeleteOutlined />} />
                                        </Form.Item>
                                    </Space>
                                )
                            })}
                            <div>
                                <Button block onClick={() => add({})} type='dashed' >Add Header</Button>
                            </div>
                        </React.Fragment>
                    )
                }}
            </Form.List>
            <label style={{ margin: '1rem 0', display: 'block' }}>Authorization</label>
            <Space>
                <Form.Item name={["authorization", "username"]}>
                    <Input size="large" placeholder="Username" />
                </Form.Item>
                <Form.Item name={["authorization", "password"]}>
                    <Input size="large" placeholder="Password" />
                </Form.Item>
            </Space>
            <Form.Item label="Disable Cache" name={["disable-cache"]} >
                <Select options={[
                    {
                        label: "True",
                        value: true
                    },
                    {
                        label: "False",
                        value: false
                    }
                ]} />
            </Form.Item>
            <Form.Item label="Cookies" name={["cookies"]} >
               <Input.TextArea />
            </Form.Item>
            <Form.Item label="Device Pixel Ratio" name={["device-pixel-ratio"]} >
               <Input type="number" />
            </Form.Item>
            <Form.Item label="User Agent" name={["user-agent"]} >
               <Input.TextArea />
            </Form.Item>
            <Form.Item label="Network Idle Timeout" name={["network-idle-timeout"]} >
               <Input type="number" />
            </Form.Item>
            <Form.Item label="Concurrency" name={["concurrency"]} >
               <Input type="number" />
            </Form.Item>
        </React.Fragment>
    )
}
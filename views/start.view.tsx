import { Button, Form, Input } from "antd";
import React from "react";
import { Percy } from "~utils/percy-utils";


export function StartView() {
    const [form] = Form.useForm()
    const actions = {
        cretaeBuild:()=>{
            const token = form.getFieldValue('token')
            Percy.createBuild(token)
        }
    }
    return (
        <React.Fragment>
            <Form form={form}>
                <Form.Item label="Percy Token" name={['token']} >
                    <Input size="large" />
                </Form.Item>
            </Form>
            <Button onClick={actions.cretaeBuild} block type="primary">Start</Button>
        </React.Fragment>
    )
}
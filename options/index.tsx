import { Button, Card, ConfigProvider, Form, Layout, List, notification, Space } from "antd";
import React, { useEffect } from "react";
import Logo from "data-base64:~assets/icon.svg";
import './index.scss'
import SnapshotForm from "~components/snapshot.form";
import { usePreferences } from "~hooks/use-preferences";
import theme from '../theme'
import { SetPreferences } from "~utils/preferences";
export default function ChromeExtensionOptions() {
    const [form] = Form.useForm()
    const { preferences } = usePreferences()
    useEffect(() => {
        if (preferences) {
            form.setFieldsValue(preferences.defaultOptions)
        }
    }, [preferences])

    const actions = {
        savePreferences:()=>{
            form.validateFields().then((values)=>{
                SetPreferences({
                    defaultOptions: values
                })
            }).then(()=>{
                notification.success({message:"Preferences Updated!"})
            })
        }
    }
    return (
        <ConfigProvider theme={theme}>
            <Layout>
            <Layout.Header className="header">
                <div className="logo">
                    <img src={Logo} alt="Percy | BrowserStack" />
                </div>
            </Layout.Header>
            <Layout.Content>
                <section id="default-settings" >
                    <Card title="Default Snapshot Options" >
                        <Form form={form} initialValues={preferences?.defaultOptions} layout='vertical'>
                            <SnapshotForm.Options />
                        </Form>
                    </Card>
                </section>
                <section>
                    <Button onClick={actions.savePreferences} block>Save Preferences</Button>
                </section>
            </Layout.Content>
        </Layout>
        </ConfigProvider>
    )
}
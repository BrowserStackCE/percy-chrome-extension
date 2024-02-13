import { Button, Card, ConfigProvider, Form, Layout, List, notification, Space } from "antd";
import React, { useEffect } from "react";
import Logo from "data-base64:~assets/icon.svg";
import './index.scss'
import SnapshotForm from "~components/snapshot.form";
import theme from '../theme'
import { useLocalStorage } from "~hooks/use-storage";
import { Preferences, PreferncesSchema } from "~schemas/preferences";
import { LocalStorage } from "~utils/storage";
import { SnapshotOptionsSchema } from "~schemas/snapshot";
import DiscoveryOptionsForm from "~components/discovery-options.form";
import { DiscoveryOptionsSchema } from "~schemas/discovery";
export default function ChromeExtensionOptions() {
    const [snapshotOptions] = Form.useForm()
    const [discoveryOptions] = Form.useForm()
    const [preferences] = useLocalStorage<Preferences>('preferences')
    useEffect(() => {
        if (preferences) {
            snapshotOptions.setFieldsValue({ options: preferences.defaultSnapshotOptions })
            discoveryOptions.setFieldsValue(preferences.discoveryOptions)
        }
    }, [preferences])

    const actions = {
        saveSnapshotOptions: () => {
            snapshotOptions.validateFields().then((values) => {
                const prefs = Object.assign({},preferences)
                const options = SnapshotOptionsSchema.parse(values.options)
                prefs.defaultSnapshotOptions = options
                LocalStorage.set('preferences',prefs)
            }).then(() => {
                notification.success({ message: "Default Options Updated!" })
            }).catch(() => {
                notification.error({ message: "Something went wrong!" })
            })
        },
        saveDiscoveryOptions: () => {
            discoveryOptions.validateFields().then((values)=>{
                const prefs = Object.assign({},preferences)
                const options = DiscoveryOptionsSchema.parse(values)
                prefs.discoveryOptions = options
                LocalStorage.set('preferences',prefs)
            }).then(() => {
                notification.success({ message: "Discovery Options Updated!" })
            }).catch((err) => {
                console.error(err)
                notification.error({ message: "Something went wrong!" })
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
                        <Card extra={[
                            <Button key="snapshot-options" onClick={actions.saveSnapshotOptions} block>Save</Button>
                        ]} title="Default Snapshot Options" >
                            <Form form={snapshotOptions} initialValues={preferences?.defaultSnapshotOptions} layout='vertical'>
                                <SnapshotForm.Options />
                            </Form>
                        </Card>
                    </section>
                    <section id="discovery-options" >
                        <Card extra={[
                            <Button key="snapshot-options" onClick={actions.saveDiscoveryOptions} block>Save</Button>
                        ]} title="Discovery Options" >
                            <Form initialValues={preferences?.discoveryOptions} form={discoveryOptions} layout='vertical'>
                                <DiscoveryOptionsForm />
                            </Form>
                        </Card>
                    </section>
                </Layout.Content>
            </Layout>
        </ConfigProvider>
    )
}
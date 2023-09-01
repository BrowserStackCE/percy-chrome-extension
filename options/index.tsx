import { Card, Form, Layout, List, Space } from "antd";
import React from "react";
import Logo from "data-base64:~assets/icon.svg";
import './index.scss'
import SnapshotForm from "~components/snapshot.form";
export default function ChromeExtensionOptions() {
    return (
        <Layout>
            <Layout.Header className="header">
                <div className="logo">
                    <img src={Logo} alt="Percy | BrowserStack" />
                </div>
            </Layout.Header>
            <Layout.Content>
                <section id="default-settings" >
                    <Card title="Default Snapshot Options" >
                        <Form layout='vertical'>
                            <SnapshotForm.Options />
                        </Form>
                    </Card>
                </section>
                <section id="autocapture-settings" >
                    <Card title="Autocapture Settings" >
                        <Form layout='vertical'>
                            <List>
                                <List.Item>
                                    ChildList
                                </List.Item>
                                <List.Item>
                                    Attributes
                                </List.Item>
                                <List.Item>
                                    Character Data
                                </List.Item>
                            </List>
                        </Form>
                    </Card>
                </section>
            </Layout.Content>
        </Layout>
    )
}
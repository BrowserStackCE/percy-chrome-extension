import { ConfigProvider, Form, Modal } from "antd";
import type { PlasmoCSConfig } from "plasmo"
import theme from '../theme'
import {  useState } from "react";
import SnapshotForm from "~components/snapshot.form";
export const config: PlasmoCSConfig = {}
export default function SnapshotModal() {
    const [modalOpen, SetModalOpen] = useState(true)
    return (
        <ConfigProvider theme={theme} >
            <Modal okText="Capture" onCancel={() => SetModalOpen(false)} title="Take Snapshot" open={modalOpen} >
                <Form layout="vertical">
                    <SnapshotForm />
                </Form>
            </Modal>
        </ConfigProvider>
    )
}
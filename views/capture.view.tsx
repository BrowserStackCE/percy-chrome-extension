import { Button, Divider, Form, Input, message, Modal, Space } from "antd"
import React, { useState } from "react"
import { action } from "webdriverio/build/commands/browser"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import SnapshotForm from "~components/snapshot.form"
import { useAutoCapture } from "~hooks/use-autocapture"
import { DeleteBuild } from "~utils/build"

export function CaptureView() {
  const [form] = Form.useForm()
  const { autoCapture, ToggleAutoCapture } = useAutoCapture()
  const [capturing, SetCapturing] = useState(false)
  const actions = {
    capture: () => {
      SetCapturing(true)
      form
        .validateFields()
        .then(async (options) => {
          console.debug(
            `Snapshot Options: ${JSON.stringify(options, undefined, 2)}`
          )
          await sendToContentScript({
            name: "take_snapshot",
            body: options
          })
            .then(() => {
              form.resetFields(["name"])
              message.success("Snapshot Captured!")
            })
            .catch((err) => {
              console.error(err)
              message.error(err)
            })
        })
        .catch(console.error)
        .finally(() => {
          SetCapturing(false)
        })
    },
    cancelBuild: () => {
      DeleteBuild()
    },
    finalise: () => {
      sendToBackground({
        name: "finalize-build"
      })
    },
    viewSnapshots: () => {
      chrome.tabs.create({
        url: "./tabs/snapshots.html"
      })
    },
    toggleCapture: () => {
      ToggleAutoCapture()
    }
  }

  return (
    <React.Fragment>
      <Form form={form} layout="vertical">
        <SnapshotForm />
      </Form>
      <Space className="w-100" direction="vertical">
        <Button
          loading={capturing}
          onClick={actions.capture}
          block
          size="large">
          Capture Snapshot
        </Button>
        <Button
          danger={autoCapture}
          onClick={actions.toggleCapture}
          block
          size="large"
          type="primary">
          {autoCapture ? "Stop Auto Capture" : "Start Auto Capture"}
        </Button>
      </Space>
      <Divider />
      <Space className="w-100" direction="vertical">
        <Button
          onClick={actions.viewSnapshots}
          block
          size="large"
          type="dashed">
          View Snapshots
        </Button>
        <Button onClick={actions.finalise} block size="large" type="primary">
          Finalize
        </Button>
        <Button
          onClick={actions.cancelBuild}
          block
          size="large"
          danger
          type="text">
          Cancel Build
        </Button>
      </Space>
    </React.Fragment>
  )
}

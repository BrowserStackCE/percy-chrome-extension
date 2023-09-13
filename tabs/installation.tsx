import React from "react";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Empty,
  Form,
  Layout,
  Modal,
  Popconfirm,
  Row,
  Space
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Logo from "data-base64:~assets/icon.svg";
import { useFinalizing } from "~hooks/use-finalizing";
import { usePercyBuild } from "~hooks/use-percy-state";
import { Snapshot } from "~schemas/snapshot";
import { UpdateBuild } from "~utils/build";
import theme from "../theme";
import SnapshotForm from "~components/snapshot.form";

import "./installation.scss";

export default function Installation() {
  return (
    <ConfigProvider theme={theme}>
      <Layout className="layout">
        <Layout.Header className="header">
          <div className="content">
            <div className="logo">
              <img src={Logo} alt="Percy | BrowserStack" />
            </div>
          </div>
        </Layout.Header>
        <Layout.Content className="background-container">
          <div className="content-container">
            {/* Add your installation steps here */}
            <h1>Steps to Set Up Percy Server</h1>
            <ol style={{ paddingLeft: "20px", marginBottom: "20px" }}>
              <li>
                Go ahead and create a new project on the Percy Dashboard. You can follow{" "}
                <a
                  href="https://docs.percy.io/docs/your-first-percy-build#2-create-a-percy-project"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this documentation
                </a>{" "}
                on how to get started.
              </li>
              <li>
                Download the Percy executable file:
                <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                  <li>
                    {" "}
                    <a
                      href="https://github.com/percy/cli/releases/download/v1.27.1/percy-osx.zip"
                      download
                    >
                      Download for Mac
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/percy/cli/releases/download/v1.27.1/percy-win.zip"
                      download
                    >
                      Download for Windows
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/percy/cli/releases/download/v1.27.1/percy-linux.zip"
                      download
                    >
                      Download for Linux
                    </a>
                  </li>
                </ul>
              </li>
              <li>Unzip the zip file and open the extracted Percy folder.</li>
              <li>Now start a terminal at this specific location.</li>
              <li>
                Copy the <strong>PERCY_TOKEN</strong> from the Project Setting Tab of your Percy Project Dashboard.
              </li>
              <li>
                Save the copied <strong>PERCY_TOKEN</strong> as an environment variable. You can use the respective command in the open terminal to do so:
                <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
                  <li>For MAC and Linux: <strong>export PERCY_TOKEN="Your percy token"</strong></li>
                  <li>For Windows: <strong>set PERCY_TOKEN="Your percy token"</strong></li>
                </ul>
              </li>
              <li>Now run the following command: <strong>percy exec:start</strong></li>
              <li>Now that the Percy Server has started, you can go ahead and finalize your build.</li>
              {/* Add more steps as needed */}
            </ol>
          </div>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
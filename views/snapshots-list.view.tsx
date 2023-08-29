import { Button, Divider, Form, Input, Space } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRoute } from "~hooks/use-route";

export function SnapshotsListView() {
    const { Navigate } = useRoute()

    const actions = {
        back: () => {
            Navigate('/capture')
        }
    }

    return (
        <React.Fragment>
            <div className="w-100 h-100">

            </div>
            <Divider/>
            <Button block onClick={actions.back} >Back</Button>
        </React.Fragment>
    )
}
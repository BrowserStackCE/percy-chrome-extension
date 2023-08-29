import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useRoute } from "~hooks/use-route";

export function StartView() {
    const { Navigate } = useRoute()

    const actions = {
        startBuild:()=>{
            Navigate('/capture')
        }
    }
    return (
        <React.Fragment>
            <Link to="/capture">
                <Button onClick={actions.startBuild} block type="primary">Start</Button>
            </Link>
        </React.Fragment>
    )
}
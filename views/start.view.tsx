import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { CreateBuild } from "~utils/build";


export function StartView() {
    return (
        <React.Fragment>
            <Button onClick={()=>CreateBuild()} block type="primary">Start</Button>
        </React.Fragment>
    )
}
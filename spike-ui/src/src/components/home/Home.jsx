import React from "react";
import Card from '@material-ui/core/Card';
import NavBar from "../NavBar";

export default function Home() {
    return (
        <div>
            <NavBar />
            <Card><span>Home</span></Card>
        </div>
    )
}
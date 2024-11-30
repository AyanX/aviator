import { Outlet } from "react-router-dom";

import { useEffect } from "react";
import socket from "../../utils/socket";
export default function Header() {
    useEffect(() => {
        socket.emit("update");
        socket.emit("get_players")
      }, []);
    return (
        <div style={{
            minHeight: "100svh",
            width:"100%",
            backgroundColor: "#00000A"
        }}>
            <h1> </h1>
            <Outlet/>
            </div>
    )
}
import socket from "../../connection/socket";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function WaitingPage(){
    const params = useParams<{roomID: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("onPlayerReady", Number(params.roomID));
        socket.on("startGameSession", () =>{
            navigate(`/game/${params.roomID}`)
        })

        return () => {
            socket.off("startGameSession")
        }
    },[navigate,params])
    return (
        <div>
            waiting
        </div>
    )
}
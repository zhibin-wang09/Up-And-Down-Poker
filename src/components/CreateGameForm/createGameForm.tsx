import { useEffect } from "react";
import socket from "../../connection/socket";
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
interface joinGameInput {
  roomID: number;
  playerName: string;
}

function CreateGameForm() {
  const { register, handleSubmit, watch } = useForm<joinGameInput>();
  const watchPlayerName = watch("playerName");
    const navigate = useNavigate();
  useEffect(() => {
    socket.on("sendRoomID", (roomID) => {
        navigate(`/waiting/${roomID}`);
    });

    return () => {
      socket.off("sendRoomID");
    };
  }, [watchPlayerName,navigate]);

  const createGame: SubmitHandler<joinGameInput> = (data: joinGameInput) => {
    socket.emit("joinGameRoom", data.roomID);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(createGame)}>
        <input {...register("roomID")} placeholder="roomID"></input>
        <input {...register("playerName")} placeholder="player name"></input>
        <input type="submit" value={"Start Game"}></input>
      </form>
    </div>
  );
}

export default CreateGameForm;

import { useEffect, useState } from "react";
import Hand from "./components/Hand/hand";
import Pile from "./components/Pile/pile";
import {
  Pile as TPile,
  Card,
  Player,
  PlayerId,
  Game,
} from "./types";
import { Box } from "@chakra-ui/react";
import socket from "./connection/socket";
import { useParams } from "react-router-dom";

export default function GameBoard() {
  const {roomID} = useParams();
  const [centerPile1, setcenterPile1] = useState<TPile>([]);
  const [centerPile2, setcenterPile2] = useState<TPile>([]);
  const [centerDrawPile1, setcenterDrawPile1] = useState<TPile>([]);
  const [centerDrawPile2, setcenterDrawPile2] = useState<TPile>([]);
  const [player1, setPlayer1] = useState<Player>(new Player([],[],PlayerId.Default));
  const [player2, setPlayer2] = useState<Player>(new Player([],[],PlayerId.Default));

  useEffect(() => {
    socket.emit("getGameState", parseInt(roomID!));

    socket.on("sendGameState", (response) => {
      const game: Game = response;
      if(game.player1.name === socket.id){
        setPlayer1(game.player1);
        setPlayer2(game.player2);
      }else{
        setPlayer1(game.player2);
        setPlayer2(game.player1);
      }
      setcenterDrawPile1(game.centerDrawPile1);
      setcenterDrawPile2(game.centerDrawPile2);
      setcenterPile1(game.centerPile1);
      setcenterPile2(game.centerPile2);
    });

    return () => {
      socket.off("sendGameState");
    };
  }, [roomID]);

  function playCard(card: Card, player: Player) {
    console.log("play");
    socket.emit("playCard", card, parseInt(roomID!), player);
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
      backgroundColor="#35654D"
      position="fixed"
      height="100%"
      width="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Hand cards={player1.hand} playCard={playCard} player={player1} isFlipped ={true}></Hand>
        <Pile Cards={player1.drawPile} isFlipped={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Pile Cards={centerDrawPile1} isFlipped={true} />
        <Pile Cards={centerPile1} isFlipped={false} />
        <Pile Cards={centerPile2} isFlipped={false} />
        <Pile Cards={centerDrawPile2} isFlipped={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Hand cards={player2.hand} playCard={playCard} player={player2} isFlipped={false}></Hand>
        <Pile Cards={player2.drawPile} isFlipped={true} />
      </Box>
    </Box>
  );
}

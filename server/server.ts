import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Card, Game, Player } from "../shared/types/types";
import { initializeGameState, useCard } from "./apis/socketApi";
import {
  ClientToServer,
  SocketData,
  ServerToClient,
} from "../shared/types/events";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServer, ServerToClient, SocketData>(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

const games = new Map<number, Game>();

// listens for the connection event
io.on("connection", (socket) => {
  // initialize the games in socket data

  socket.on("getGameState", (gameID: number) => {
    // if the game was already created, join that game instead
    const existingGame = games.get(gameID);
    if (existingGame) {
      socket.emit("sendGameState", existingGame);
      return;
    }
    const game: Game = initializeGameState();
    games.set(gameID, game);
    socket.emit("sendGameState", game);
  });

  socket.on("playCard", (card: Card, gameID: number, player: Player) => {
    let game = games.get(gameID);
    if (!game) {
      console.log("ERROR!!!");
      return;
    }
    game = useCard(card, player, game);
    if (!game) return;
    io.sockets.in("" + gameID).emit("sendGameState", game);
  });

  socket.on("joinGameRoom", (roomID: number) => {
    console.log("edafdasfdas")
    const newRoomID = Math.floor(Date.now() * Math.random());
    const gameID = roomID ? "" + roomID : "" + newRoomID;
    const existingGame = games.get(Number(gameID));
    if (existingGame) {
      socket.emit("sendGameState", existingGame);
      return;
    }
    const game: Game = initializeGameState();
    games.set(Number(gameID), game);
    socket.join(roomID ? "" + roomID : "" + newRoomID);
    console.log("joined");
    socket.emit("sendRoomID", roomID ? roomID : newRoomID);
  });

  socket.on("onPlayerReady", (gameID: number) => {
    let game = games.get(gameID);
    game?.incNumPlayersInGame();
    console.log("Detect player in: " + game?.numPlayersInGame)
    if(game?.numPlayersInGame == 2){
      console.log("start")
      io.sockets.in("" + gameID).emit("startGameSession");
    }
  })

  socket.on("disconnect", () => {});
});

httpServer.listen(8080);

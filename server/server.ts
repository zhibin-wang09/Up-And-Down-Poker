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
  console.log(`user ${socket.id} joined`);
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
    const newRoomID = Math.floor(Date.now() * Math.random());
    const roomIDString = roomID ? "" + roomID : "" + newRoomID;
    const gameID = roomIDString;
    let game = games.get(Number(gameID));
    if(!game){
      game = initializeGameState();
    }
    games.set(Number(gameID), game);
    socket.join(roomIDString);
    console.log("joined");
    socket.emit("sendRoomID", roomID ? roomID : newRoomID);
  });

  socket.on("onPlayerReady", (gameID: number) => {
    const room = io.sockets.adapter.rooms.get("" + gameID);
    if(room?.size == 2){
      console.log("start")
      io.sockets.in("" + gameID).emit("startGameSession");
    }
  })

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left`);
  });
});

httpServer.listen(8080);

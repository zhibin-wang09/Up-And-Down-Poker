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
import {createMachine, assign, createActor, setup} from 'xstate';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServer, ServerToClient, SocketData>(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

const games = new Map<number, Game>();
const socketToGame = new Map<string,number>();

// listens for the connection event
io.on("connection", (socket) => {
  console.log(`user ${socket.id} joined`);

  //  initialize the games in socket data
  //  this assumes that the game has been created when the room is created
  //  since the game has been created and players has been assigned
  //  we will only send game state visible to that player
  socket.on("getGameState", (gameID: number) => {
    // if the game was already created, join that game instead
    let existingGame = games.get(gameID);
    if (existingGame) {
      socket.emit("sendGameState", existingGame);
      return;
    }
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

    // make sure players are restricted at 2
    if(io.sockets.adapter.rooms.get(roomIDString)?.size === 2){
      return;
    }

    socket.join(roomIDString);
    console.log("joined");
    socket.emit("sendRoomID", roomID ? roomID : newRoomID);
  });

  socket.on("onPlayerReady", (gameID: number) => {
    const room = io.sockets.adapter.rooms.get("" + gameID);
    let game = games.get(Number(gameID));
    socketToGame.set(socket.id, gameID);

    // create game if it does not already exist
    if(!game){
      game = initializeGameState();
    }

    // set up the player name by id so we can identify player using socket id
    if(!game.player1.name){
      game.player1.name = socket.id;
    }else if(!game.player2.name){
      game.player2.name = socket.id;
    }


    // wait for 2 players to start game
    if(room?.size == 2){
      console.log("start");
      games.set(Number(gameID), game);
      io.sockets.in("" + gameID).emit("startGameSession");
    }
  })

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} left`);
    const gameID = socketToGame.get(socket.id);
    const userWhoLeft = socket.id;
    let userStillInGame = '';
    let game = games.get(gameID!);
    userStillInGame = game?.player1.name == userWhoLeft ? game?.player2.name! :  game?.player2.name!;
    console.log("on disconnect", gameID, userWhoLeft, userStillInGame);
    socketToGame.delete(userStillInGame);
    socketToGame.delete(userWhoLeft);
    games.delete(gameID!);
    io.in("" + gameID).socketsLeave("" + gameID);
    io.to(userStillInGame).emit("endGame");
  });
});

httpServer.listen(8080);

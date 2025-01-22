"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var socketApi_1 = require("./apis/socketApi");
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: { origin: "http://localhost:3000" },
});
var games = new Map();
var socketToGame = new Map();
// listens for the connection event
io.on("connection", function (socket) {
    console.log("user ".concat(socket.id, " joined"));
    //  initialize the games in socket data
    //  this assumes that the game has been created when the room is created
    //  since the game has been created and players has been assigned
    //  we will only send game state visible to that player
    socket.on("getGameState", function (gameID) {
        // if the game was already created, join that game instead
        var existingGame = games.get(gameID);
        if (existingGame) {
            socket.emit("sendGameState", existingGame);
            return;
        }
    });
    socket.on("playCard", function (card, gameID, player) {
        var game = games.get(gameID);
        if (!game) {
            console.log("ERROR!!!");
            return;
        }
        game = (0, socketApi_1.useCard)(card, player, game);
        if (!game)
            return;
        io.sockets.in("" + gameID).emit("sendGameState", game);
    });
    socket.on("joinGameRoom", function (roomID) {
        var _a;
        var newRoomID = Math.floor(Date.now() * Math.random());
        var roomIDString = roomID ? "" + roomID : "" + newRoomID;
        // make sure players are restricted at 2
        if (((_a = io.sockets.adapter.rooms.get(roomIDString)) === null || _a === void 0 ? void 0 : _a.size) === 2) {
            return;
        }
        socket.join(roomIDString);
        console.log("joined");
        socket.emit("sendRoomID", roomID ? roomID : newRoomID);
    });
    socket.on("onPlayerReady", function (gameID) {
        var room = io.sockets.adapter.rooms.get("" + gameID);
        var game = games.get(Number(gameID));
        socketToGame.set(socket.id, gameID);
        // create game if it does not already exist
        if (!game) {
            game = (0, socketApi_1.initializeGameState)();
        }
        // set up the player name by id so we can identify player using socket id
        if (!game.player1.name) {
            game.player1.name = socket.id;
        }
        else if (!game.player2.name) {
            game.player2.name = socket.id;
        }
        // wait for 2 players to start game
        if ((room === null || room === void 0 ? void 0 : room.size) == 2) {
            console.log("start");
            games.set(Number(gameID), game);
            io.sockets.in("" + gameID).emit("startGameSession");
        }
    });
    socket.on("disconnect", function () {
        console.log("user ".concat(socket.id, " left"));
        // const gameID = socketToGame.get(socket.id);
        // const player1 = socket.id;
        // let player2 = '';
        // let game = games.get(gameID!);
        // player2 = game?.player1.name == player1 ? player2: player1;
        console.log("test test");
        // socketToGame.delete(player1);
        // socketToGame.delete(player2);
        // games.delete(gameID!);
        // io.in("" + gameID).socketsLeave("" + gameID);
        // io.to(player2).emit("endGame");
    });
});
httpServer.listen(8080);

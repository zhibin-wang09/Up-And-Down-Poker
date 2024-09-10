// the list of events taht goes from server to client

import { Card, Player } from "./types";
import { Game } from "./types";

// should be used to emit events to the client side
export interface ServerToClient {
  sendGameState: (game: Game) => void;
  sendRoomID: (roomID: number) => void;
  startGameSession: () => void;
  endGame: () => void;
}

// the list of events that goes from client to server
// should be used to listen for events  on the server side
export interface ClientToServer {
  initializeGameState: (gameID: number) => void;
  onPlayerReady: (gameID: number) => void;
  playCard: (card: Card, gameID: number, player: Player) => void;
  joinGameRoom: (roomID: number) => void;
  createGameRoom: () => void;
  getGameState: (gameID: number) => void;
}

// typescript method of storing data on the socket
export interface SocketData {
  game: Map<number, Game>;
}

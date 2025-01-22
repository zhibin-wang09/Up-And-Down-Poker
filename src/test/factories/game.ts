import { Factory } from "fishery";
import { Cards, Game } from "../../types";
import { playerFactory } from "./player";
import { cardFactory } from "./cards";
import { dealCards } from "../../library/lib";

export const gameFactory = Factory.define<Game>(() => {
  let deck: Cards = cardFactory.build();
  let game: Game = new Game(
    playerFactory.build({
      hand: dealCards(deck, 4),
      drawPile: dealCards(deck, 16),
      playerId: 1,
    }),
    playerFactory.build({
      hand: dealCards(deck, 4),
      drawPile: dealCards(deck, 16),
      playerId: 2,
    }),
    dealCards(deck, 1),
    dealCards(deck, 1),
    dealCards(deck, 5),
    dealCards(deck, 5)
  );

  return game;
});

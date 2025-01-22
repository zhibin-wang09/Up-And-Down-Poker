"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameState = initializeGameState;
exports.useCard = useCard;
var types_1 = require("../../shared/types/types");
var cardApi_1 = require("./cardApi");
function initializeGameState() {
    var game = (0, cardApi_1.initializeGameUntilNotDead)();
    return game;
}
function useCard(card, player, game) {
    if (game) {
        var index = player.hand.indexOf(card);
        var targetCard = player.hand[index];
        var destination = types_1.Destination.CenterPile2;
        var result = (0, cardApi_1.validateMove)(game.centerPile1[0], game.centerPile2[0], targetCard);
        if (result == types_1.Validality.CENTER1VALID) {
            destination = types_1.Destination.CenterPile1;
        }
        else if (result == types_1.Validality.INVALID) {
            return game;
        }
        var newCard = player.drawPile.length > 0 ? player.drawPile[0] : types_1.CARD_HOLDER;
        var copy = __spreadArray([], player.hand, true);
        copy[index] = newCard;
        if (player.playerId == types_1.PlayerId.Player1) {
            game.player1.hand = copy;
            game.player1.drawPile =
                player.drawPile.length > 0 ? player.drawPile.slice(1) : player.drawPile;
        }
        else if (player.playerId == types_1.PlayerId.Player2) {
            game.player2.hand = copy;
            game.player2.drawPile =
                player.drawPile.length > 0 ? player.drawPile.slice(1) : player.drawPile;
        }
        if (destination == types_1.Destination.CenterPile1) {
            game.centerPile1 = __spreadArray([targetCard], game.centerPile1, true);
        }
        else {
            game.centerPile2 = __spreadArray([targetCard], game.centerPile2, true);
        }
        game = (0, cardApi_1.shuffleUntilNotDead)(game);
        return game;
    }
}

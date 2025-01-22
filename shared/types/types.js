"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validality = exports.Game = exports.Player = exports.SUIT_BIN_WIDTH = exports.CARD_HOLDER = exports.PlayerId = exports.Destination = exports.FaceValue = exports.Suit = void 0;
var Suit;
(function (Suit) {
    Suit[Suit["Diamonds"] = 0] = "Diamonds";
    Suit[Suit["Clubs"] = 1] = "Clubs";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit || (exports.Suit = Suit = {}));
var FaceValue;
(function (FaceValue) {
    FaceValue[FaceValue["Two"] = 0] = "Two";
    FaceValue[FaceValue["Three"] = 1] = "Three";
    FaceValue[FaceValue["Four"] = 2] = "Four";
    FaceValue[FaceValue["Five"] = 3] = "Five";
    FaceValue[FaceValue["Six"] = 4] = "Six";
    FaceValue[FaceValue["Seven"] = 5] = "Seven";
    FaceValue[FaceValue["Eight"] = 6] = "Eight";
    FaceValue[FaceValue["Nine"] = 7] = "Nine";
    FaceValue[FaceValue["Ten"] = 8] = "Ten";
    FaceValue[FaceValue["Jack"] = 9] = "Jack";
    FaceValue[FaceValue["Queen"] = 10] = "Queen";
    FaceValue[FaceValue["King"] = 11] = "King";
    FaceValue[FaceValue["Ace"] = 12] = "Ace";
})(FaceValue || (exports.FaceValue = FaceValue = {}));
var Destination;
(function (Destination) {
    Destination[Destination["P1hand"] = 0] = "P1hand";
    Destination[Destination["P2hand"] = 1] = "P2hand";
    Destination[Destination["P1DrawPile"] = 2] = "P1DrawPile";
    Destination[Destination["P2DrawPile"] = 3] = "P2DrawPile";
    Destination[Destination["CenterPile1"] = 4] = "CenterPile1";
    Destination[Destination["CenterPile2"] = 5] = "CenterPile2";
    Destination[Destination["centerDrawPile1"] = 6] = "centerDrawPile1";
    Destination[Destination["centerDrawPile2"] = 7] = "centerDrawPile2";
})(Destination || (exports.Destination = Destination = {}));
var PlayerId;
(function (PlayerId) {
    PlayerId[PlayerId["Default"] = 0] = "Default";
    PlayerId[PlayerId["Player1"] = 1] = "Player1";
    PlayerId[PlayerId["Player2"] = 2] = "Player2";
})(PlayerId || (exports.PlayerId = PlayerId = {}));
exports.CARD_HOLDER = -1;
exports.SUIT_BIN_WIDTH = 2; // two bits used to store information about the suite of a card because there are only 4 suites so 00, 01, 10, 11
var Player = /** @class */ (function () {
    function Player(hand, drawPile, playerId) {
        this.hand = [];
        this.drawPile = [];
        this.playerId = PlayerId.Default;
        this.hand = hand;
        this.drawPile = drawPile;
        this.playerId = playerId;
        this.name = "";
        this.isReady = false;
    }
    Player.prototype.setName = function (name) {
        this.name = name;
    };
    Player.prototype.setIsReady = function (isReady) {
        this.isReady = isReady;
    };
    return Player;
}());
exports.Player = Player;
var Game = /** @class */ (function () {
    function Game(player1, player2, centerPile1, centerPile2, centerDrawPile1, centerDrawPile2) {
        this.player1 = new Player([], [], 1);
        this.player2 = new Player([], [], 2);
        this.centerPile1 = [];
        this.centerPile2 = [];
        this.centerDrawPile1 = [];
        this.centerDrawPile2 = [];
        this.player1 = player1;
        this.player2 = player2;
        this.centerPile1 = centerPile1;
        this.centerPile2 = centerPile2;
        this.centerDrawPile1 = centerDrawPile1;
        this.centerDrawPile2 = centerDrawPile2;
    }
    return Game;
}());
exports.Game = Game;
var Validality;
(function (Validality) {
    Validality[Validality["CENTER1VALID"] = 0] = "CENTER1VALID";
    Validality[Validality["CENTER2VALID"] = 1] = "CENTER2VALID";
    Validality[Validality["INVALID"] = 2] = "INVALID";
})(Validality || (exports.Validality = Validality = {}));

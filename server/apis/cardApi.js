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
exports.createCard = createCard;
exports.getSuit = getSuit;
exports.getFaceValue = getFaceValue;
exports.createSuits = createSuits;
exports.createFaceValues = createFaceValues;
exports.createDeck = createDeck;
exports.dealCards = dealCards;
exports.dealCardToPlayer = dealCardToPlayer;
exports.validateMove = validateMove;
exports.checkIsDead = checkIsDead;
exports.shuffleUntilNotDead = shuffleUntilNotDead;
exports.initializeGameUntilNotDead = initializeGameUntilNotDead;
var types_1 = require("../../shared/types/types");
function createCard(suit, faceValue) {
    return (faceValue << types_1.SUIT_BIN_WIDTH) | suit;
}
function getSuit(card) {
    return mask(types_1.SUIT_BIN_WIDTH) & card;
}
function mask(n) {
    return (1 << n) - 1; // create a mask of 00111.11 depend on the position of bits shifted
}
function getFaceValue(card) {
    return card >> types_1.SUIT_BIN_WIDTH;
}
function createSuits() {
    return [types_1.Suit.Diamonds, types_1.Suit.Clubs, types_1.Suit.Hearts, types_1.Suit.Spades];
}
function createFaceValues() {
    return [
        types_1.FaceValue.Two,
        types_1.FaceValue.Three,
        types_1.FaceValue.Four,
        types_1.FaceValue.Five,
        types_1.FaceValue.Six,
        types_1.FaceValue.Seven,
        types_1.FaceValue.Eight,
        types_1.FaceValue.Nine,
        types_1.FaceValue.Ten,
        types_1.FaceValue.Jack,
        types_1.FaceValue.Queen,
        types_1.FaceValue.King,
        types_1.FaceValue.Ace,
    ];
}
function createDeck() {
    var deck = createSuits().flatMap(function (s) {
        return createFaceValues().flatMap(function (f) { return createCard(s, f); });
    });
    shuffle(deck);
    return deck; // just a way to create an array of cards using nested flatmap to simulate nested loops
}
function dealCards(deck, numberOfCards) {
    return deck.splice(0, numberOfCards);
}
function shuffle(deck) {
    var _a;
    var currentIndex = deck.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        _a = [
            deck[randomIndex],
            deck[currentIndex],
        ], deck[currentIndex] = _a[0], deck[randomIndex] = _a[1];
    }
}
function dealCardToPlayer(deck, hand) {
    var res = { pile: [], hand: [] };
    var card = deck[0];
    res.hand = __spreadArray([card], hand, true);
    res.pile = deck.filter(function (c) { return c != card; });
    return res;
}
function validateMove(centerPile1TopCard, centerPile2TopCard, card) {
    var twoAndAceDiff = Object.keys(types_1.FaceValue).length / 2 - 1; // the difference between card "2" and "ace" is 12 defined by the FaceValue enum
    if (Math.abs(getFaceValue(centerPile1TopCard) - getFaceValue(card)) == 1) {
        return types_1.Validality.CENTER1VALID;
    }
    else if (Math.abs(getFaceValue(centerPile2TopCard) - getFaceValue(card)) == 1) {
        return types_1.Validality.CENTER2VALID;
    }
    else if (Math.abs(getFaceValue(centerPile1TopCard) - getFaceValue(card)) ==
        twoAndAceDiff) {
        return types_1.Validality.CENTER1VALID;
    }
    else if (Math.abs(getFaceValue(centerPile2TopCard) - getFaceValue(card)) ==
        twoAndAceDiff) {
        return types_1.Validality.CENTER2VALID;
    }
    else {
        return types_1.Validality.INVALID;
    }
}
function checkIsDead(game, player1, player2) {
    var canMove = false;
    player1.hand.forEach(function (c) {
        if (validateMove(game.centerPile1[0], game.centerPile2[0], c) !=
            types_1.Validality.INVALID)
            canMove = true;
    });
    player2.hand.forEach(function (c) {
        if (validateMove(game.centerPile1[0], game.centerPile2[0], c) !=
            types_1.Validality.INVALID)
            canMove = true;
    });
    return !canMove;
}
/**
 * Used during a ongoing game to reset the center piles when ever a dead state occurs
 * @param game The ongoing game
 * @returns A game with center piles reshuffuled
 */
function shuffleUntilNotDead(game) {
    var isDead = checkIsDead(game, game.player1, game.player2);
    while (isDead) {
        isDead = checkIsDead(game, game.player1, game.player2);
        console.log("Cant Move");
        var centerDrawPile1TopCard = game.centerDrawPile1[0];
        var centerDrawPile2TopCard = game.centerDrawPile2[0];
        // in case it's dead and there are no cards to refill from we will take from the center piles and redistribute the cards to the side
        if (game.centerDrawPile1.length == 0 || game.centerDrawPile2.length == 0) {
            game.centerDrawPile1 = __spreadArray(__spreadArray([], game.centerPile1.slice(0, 4), true), game.centerDrawPile1, true);
            game.centerDrawPile2 = __spreadArray(__spreadArray([], game.centerPile2.slice(0, 4), true), game.centerDrawPile2, true);
        }
        game.centerPile1 = __spreadArray([centerDrawPile1TopCard], game.centerPile1, true);
        game.centerPile2 = __spreadArray([centerDrawPile2TopCard], game.centerPile2, true);
        game.centerDrawPile1 = game.centerDrawPile1.slice(1);
        game.centerDrawPile2 = game.centerDrawPile2.slice(1);
    }
    return game;
}
/**
 * Initailize a game that is not dead. Used only when the game is initailized
 * @returns a game that does not have a dead state
 */
function initializeGameUntilNotDead() {
    var game = createGame();
    while (checkIsDead(game, game.player1, game.player2)) {
        game = createGame();
    }
    return game;
}
function createGame() {
    var player1;
    var player2;
    var game;
    var deck = createDeck();
    player1 = new types_1.Player(dealCards(deck, 4), dealCards(deck, 16), 1);
    player2 = new types_1.Player(dealCards(deck, 4), dealCards(deck, 16), 2);
    game = new types_1.Game(player1, player2, dealCards(deck, 1), dealCards(deck, 1), dealCards(deck, 5), dealCards(deck, 5));
    return game;
}

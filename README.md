# Up-And-Down Poker

## For Players

### Set up of the game
- The game requires two players and each player are dealt with 20 cards
- Each player has 4 cards in hand and 16 cards from a draw pile
- There are 4 stacks of cards in the center of the board
    - Two stacks in the middle that starts with 1 card in each stack facing up
    - Rest of the cards are split equally and placed in the outside of the two center stacks facing down


### Rules:
- Player can only put down a card to the center two stacks if the card in hand and the card on the stack has a difference of 1.
    - For example: Ace and Two, Queen and King, King and Ace, Jack and Ten, so on...
- Each turn when a player put down card another card is drawn from the draw pile automatically by system
- If the center stack reachs a point where no cards in both players hand creates a difference of 1 then it draws from the center draw piles automatically.
- The player with no cards left in their hand wins the game.

## For Developers

If this is the first time you download the repo, in the root folder enter the command `npm install`

Running locally:
- In the root folder enter the command `npm start`
- In the server folder enter the command `npx tsx server.ts`
- Go to `localhost:3000`
- You can see the game!

*Note*: Running locally limits the feature where two players get to play cards simultaneously. **Currently developing and going live soon**
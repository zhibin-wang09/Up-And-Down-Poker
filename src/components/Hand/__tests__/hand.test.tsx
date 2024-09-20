/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { Cards } from "../../../types";
import Hand from "../hand";
import { playerFactory } from "../../../test/factories/player";
import userEvent from "@testing-library/user-event";

afterEach(() => {
    jest.clearAllMocks();
})

describe("Hand", () => {
    const hand: Cards = [
        1,23,4,10
    ]
    const playCard = jest.fn();
    const player = playerFactory.build();

    it("render hand", async () => {
        render(<Hand cards={hand}  playCard = {playCard} player = {player} isFlipped={false}/>);
        await screen.findByTestId(`card-${hand[0]}`);
        await screen.findByTestId(`card-${hand[1]}`);
        await screen.findByTestId(`card-${hand[2]}`);
        await screen.findByTestId(`card-${hand[3]}`);
    });

    it("able to play cards", async () => {
        render(<Hand cards={hand}  playCard = {playCard} player = {player} isFlipped={false}/>);
        const card1 = await screen.findByTestId(`card-${hand[0]}`);
        const card2 = await screen.findByTestId(`card-${hand[1]}`);
        const card3 = await screen.findByTestId(`card-${hand[2]}`);
        const card4= await screen.findByTestId(`card-${hand[3]}`);
        const user = userEvent.setup();
        await user.click(card1);
        expect(playCard).toBeCalledTimes(1);
        await user.click(card2);
        expect(playCard).toBeCalledTimes(2);
        await user.click(card3);
        expect(playCard).toBeCalledTimes(3);
        await user.click(card4);
        expect(playCard).toBeCalledTimes(4);
    })
})
/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameBoard from "../gameBoard";
import { gameFactory } from "../../../test/factories/game";

const mockedUseNavigate = jest.fn();
const mockedUseParam = jest.fn();
let mockIo: jest.Mock;

// mock react router dom use navigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
    useParam: () => mockedUseParam
}))

/**
 * Creation of the socket mock
 * 
 * - Mock the module and mock the return io function from the module.
 * - The io function returns a socket so it is mocked function that returns a socket i.e. () => socket
 */
jest.mock('socket.io-client', () => {
    const emit = jest.fn();
    const on = jest.fn();
    const off = jest.fn();
    const socket = {emit,on,off};
    mockIo = jest.fn(() => socket);
    return {io: mockIo};
})

describe("Game board", () => {
  it("it should render game", async () => {
    render(<GameBoard />);
    await waitFor(() => {
      expect(mockIo).toBeCalledTimes(1); // the socket should have been called once = the connection of the socket
    });

    const socket = mockIo.mock.results[0].value;
    const game = gameFactory.build();
    await waitFor(() => {
        // socket.on.mock.calls returns the number of times the function on is called
        // [0] is the first call
        // [1] is the second argument of the first call
        socket.on.mock.calls[0][1](game); // pass the sendGameState listener a game to populate the game board
    })

    screen.getByTestId(`card-${game.centerDrawPile1[0]}`);
  });
});

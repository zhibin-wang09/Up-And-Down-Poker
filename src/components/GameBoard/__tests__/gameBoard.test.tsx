/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { io as mockIO } from "socket.io-client";
import GameBoard from "../gameBoard";

describe("Game board", () => {
  it("it should render game", async () => {
    // render(<GameBoard />);
    // await waitFor(() => {
    //   expect(mockIO).toHaveBeenCalled();
    // });
  });
});

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGameForm from "./components/CreateGameForm/createGameForm";
import WaitingPage from "./components/WaitingPage/waitingPage";
import GameBoard from "./components/GameBoard/gameBoard";
import { ChakraProvider } from "@chakra-ui/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateGameForm />,
  },
  {
    path: "/waiting/:roomID",
    element: <WaitingPage />,
  },
  {
    path: "/game/:roomID",
    element: <GameBoard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

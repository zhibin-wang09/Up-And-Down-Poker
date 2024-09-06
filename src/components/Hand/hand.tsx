import Card from "../Card/card";
import { Box } from "@chakra-ui/react";
import { Pile, Card as TCard, Player } from "../../types";

interface HandProp {
  cards: Pile;
  playCard: (c: TCard, p: Player) => void;
  player: Player;
}

export default function Hand({ cards, playCard, player }: HandProp) {

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      margin="30px"
    >
      {cards.map((c) => {
        if (c !== -1) return (
          <Card
            key={c}
            card={c}
            isFlipped={false}
            playCard={playCard}
            player={player}
          />
        )
        return <></>
      })}
    </Box>
  );
}

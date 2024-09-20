import { Factory } from "fishery";
import { Player } from "../../types";

export const playerFactory = Factory.define<Player>(({params}) => {
    const player = new Player(params.hand ? params.hand : [], params.drawPile ? params.drawPile : [], params.playerId ? params.playerId : 1);
    player.setName("a");
    player.setIsReady(false);
    return player;
})
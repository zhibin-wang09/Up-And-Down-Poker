import { Factory } from "fishery";
import { Player } from "../../types";

export const playerFactory = Factory.define<Player>(() => {
    const player = new Player([],[],1);
    player.setName("a");
    player.setIsReady(false);
    return player;
})
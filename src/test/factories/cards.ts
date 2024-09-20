import { Factory } from "fishery";
import { Cards } from "../../types";
import { createDeck } from "../../library/lib";

export const cardFactory = Factory.define<Cards>(() => {
    return createDeck();
})
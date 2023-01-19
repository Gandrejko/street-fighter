import {showModal} from "./modal";
import {createFighterImage} from "../fighterPreview";

export function showWinnerModal(fighter) {
  showModal({title: fighter.name, bodyElement: createFighterImage(fighter)})
}

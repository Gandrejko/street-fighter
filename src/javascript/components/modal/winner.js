import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

function showWinnerModal(fighter) {
    showModal({ title: fighter.name, bodyElement: createFighterImage(fighter) });
}

export default showWinnerModal;

import { createElement } from '../helpers/domHelper';
import { createFighterImage } from './fighterPreview';
import {fight, getDamage} from "./fight";
import {controls} from "../../constants/controls";
import {showWinnerModal} from "./modal/winner";

export function renderArena(selectedFighters) {
  const root = document.getElementById('root');
  const arena = createArena(selectedFighters);
  root.innerHTML = '';
  root.append(arena);

  fight(...selectedFighters)
      .then(winner => showWinnerModal(winner))
}

function createArena(selectedFighters) {
  const arena = createElement({ tagName: 'div', className: 'arena___root' });
  const healthIndicators = createIndicators(...selectedFighters);
  const fighters = createFighters(...selectedFighters);

  arena.append(healthIndicators, fighters);
  return arena;
}

function createIndicators(leftFighter, rightFighter) {
  const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
  const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
  const leftFighterIndicator = createIndicator(leftFighter, 'left');
  const rightFighterIndicator = createIndicator(rightFighter, 'right');

  healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
  return healthIndicators;
}

function createIndicator(fighter, position) {
  const { name } = fighter;
  const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
  const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
  const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
  const healthBar = createElement({ tagName: 'div', className: 'arena___health-bar', attributes: { id: `${position}-fighter-indicator` }});
  const barShadow = createElement({ tagName: 'div', className: 'arena___health-bar-shadow', attributes: { id: `${position}-fighter-indicator-shadow` }});
  const criticalHitIndicator = createElement({ tagName: 'div', className: 'arena___fighter-critical-hit-indicator', attributes: { id: `${position}-fighter-critical-indicator` } });
  const criticalHitBar = createElement({ tagName: 'div', className: 'arena___fighter-critical-hit-bar', attributes: {name: fighter.name, id: `${position}-fighter-critical-indicator-shadow` } });

  fighterName.innerText = name;
  criticalHitIndicator.append(criticalHitBar);
  indicator.append(healthBar);
  indicator.append(barShadow);
  container.append(fighterName, indicator, criticalHitIndicator);

  return container;
}

function createFighters(firstFighter, secondFighter) {
  const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
  const firstFighterElement = createFighter(firstFighter, 'left');
  const secondFighterElement = createFighter(secondFighter, 'right');

  battleField.append(firstFighterElement, secondFighterElement);
  return battleField;
}

function createFighter(fighter, position) {
  const imgElement = createFighterImage(fighter);
  const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
  const fighterElement = createElement({
    tagName: 'div',
    className: `arena___fighter ${positionClassName}`,
  });

  fighterElement.append(imgElement);
  return fighterElement;
}

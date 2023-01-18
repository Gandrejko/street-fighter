import { controls } from '../../constants/controls';
import {showWinnerModal} from "./modal/winner";

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    window.addEventListener('keydown', (e) => {
      if (e.code === controls.PlayerOneAttack) {
        attack(firstFighter, secondFighter, 'right')
      }
      if (e.code === controls.PlayerTwoAttack) {
        attack(secondFighter, firstFighter, 'left')
      }
    })
  })
}

function attack(attacker, defender, defenderPosition) {
  const damage = +getDamage(attacker, defender);
  const healthBarNode = document.getElementById(`${defenderPosition}-fighter-indicator`);
  const currentHealth = +defender.health;
  const calculatedWidth = healthBarNode.clientWidth - (currentHealth - damage) * 100 / healthBarNode.clientWidth;
  healthBarNode.style.width = (calculatedWidth > 0 ? calculatedWidth : 0) + 'px';

  const healthBarShadowNode = document.getElementById(`${defenderPosition}-fighter-indicator-shadow`);
  healthBarShadowNode.style.width = (calculatedWidth > 0 ? calculatedWidth : 0) + 'px';
}

export function getDamage(attacker, defender) {
  return getHitPower(attacker) - getBlockPower(defender)
}

export function getHitPower(fighter) {
  const criticalHitChance = Math.random() + 1;
  const {attack} = fighter;
  const hitPower = attack * criticalHitChance;
  return hitPower
}

export function getBlockPower(fighter) {
  const dodgeChance = Math.random() + 1;
  const {defense} = fighter;
  const blockPower = defense * dodgeChance;
  return blockPower
}



import { controls } from '../../constants/controls';
import {showWinnerModal} from "./modal/winner";

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const defaultParameters = {
      isAttack: false,
      isBlock: false,
      isCritical: true,
    }
    const playerOne = {
      ...firstFighter,
      maxHealth: firstFighter.health,
      ...defaultParameters
    }
    const playerTwo = {
      ...secondFighter,
      maxHealth: secondFighter.health,
      ...defaultParameters
    }

    let pressedKeys = new Set();


    window.addEventListener('keydown', (event) => {
      pressedKeys.add(event.code);
      switch (event.code) {
        case controls.PlayerOneAttack:
          attack({ attacker: playerOne, defender: playerTwo});
          break;
        case controls.PlayerTwoAttack:
          attack({ attacker: playerTwo, defender: playerOne });
          break;
        case controls.PlayerOneBlock:
          playerOne.isBlock = true;
          break;
        case controls.PlayerTwoBlock:
          playerTwo.isBlock = true;
          break;
      }

      checkCriticalHit({
        keyCombination: controls.PlayerOneCriticalHitCombination,
        attacker: playerOne,
        defender: playerTwo,
        pressedKeys
      });

      checkCriticalHit({
        keyCombination: controls.PlayerTwoCriticalHitCombination,
        attacker: playerTwo,
        defender: playerOne,
        pressedKeys
      });

      updateHealthBar({ leftFighter: playerOne, rightFighter: playerTwo});
      if (playerOne.health <= 0 || playerTwo.health <= 0) {
        const winner = playerOne.health <= 0 ? playerTwo : playerOne;
        const loser = playerOne.health <= 0 ? playerOne : playerTwo;
        animateWin(winner, loser)
        setTimeout(() => resolve(winner), 3000)
      }
    });

    window.addEventListener('keyup', (event) => {
      pressedKeys.delete(event.code);
      switch (event.code) {
        case controls.PlayerOneBlock:
          playerOne.isBlock = false;
          break;
        case controls.PlayerTwoBlock:
          playerTwo.isBlock = false;
          break;
        case controls.PlayerOneAttack:
          playerOne.isAttack = false;
          break;
        case controls.PlayerTwoAttack:
          playerTwo.isAttack = false;
          break;
      }
    });
  })
}

function attack({attacker, defender}) {
  if(!attacker.isBlock && !defender.isBlock) {
    const damage = getDamage(attacker, defender);
    defender.health -= damage;
  }
}

function updateHealthBar({ leftFighter, rightFighter }) {

  const	leftFighterIndicator = document.getElementById('left-fighter-indicator');
  const rightFighterIndicator = document.getElementById('right-fighter-indicator');

  leftFighterIndicator.style.width = getFormatedHealth(leftFighter);
  rightFighterIndicator.style.width = getFormatedHealth(rightFighter);

  const	leftFighterIndicatorShadow = document.getElementById('left-fighter-indicator-shadow');
  const rightFighterIndicatorShadow = document.getElementById('right-fighter-indicator-shadow');

  leftFighterIndicatorShadow.style.width = getFormatedHealth(leftFighter);
  rightFighterIndicatorShadow.style.width = getFormatedHealth(rightFighter);
}

function checkCriticalHit({ keyCombination, attacker, defender, pressedKeys }) {
  const rightСombination = keyCombination.every(code => pressedKeys.has(code));
  if (attacker.isCritical && rightСombination) {
    defender.health -= getCriticalHit(attacker);
    attacker.isCritical = false;
    setTimeout(() => attacker.isCritical = true, 10000);
  }
}

function animateWin(winner, loser) {
  const winnerElement = document.querySelector(`[title=${winner.name}]`);
  const loserElement = document.querySelector(`[title=${loser.name}]`);
  winnerElement.classList.add('win');
  setTimeout(() => {
    loserElement.classList.add('run');
    winnerElement.classList.add('run');
  }, 3000)
}

function getFormatedHealth({ health, maxHealth }) {
  return `${health < 0 ? 0 : (health / maxHealth * 100)}%`;
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
  return Math.max(damage, 0);
}

export function getCriticalHit({ attack }) {
  return 2 * attack;
}

export function getHitPower({attack}) {
  const criticalHitChance = Math.random() + 1;
  const hitPower = attack * criticalHitChance;
  return hitPower
}

export function getBlockPower({defense}) {
  const dodgeChance = Math.random() + 1;
  const blockPower = defense * dodgeChance;
  return blockPower
}



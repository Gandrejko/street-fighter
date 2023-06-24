import controls from '../../constants/controls';

function getFormatedHealth({ health, maxHealth }) {
    return `${health < 0 ? 0 : (health / maxHealth) * 100}%`;
}

export function getHitPower(attacker) {
    const criticalHitChance = Math.random() + 1;
    return attacker.attack * criticalHitChance;
}

export function getBlockPower({ defense }) {
    const dodgeChance = Math.random() + 1;
    return defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return Math.max(damage, 0);
}

export function getCriticalHit(attacker) {
    return 2 * attacker.attack;
}

function attack({ attacker, defender }) {
    if (!attacker.isBlock && !defender.isBlock) {
        const damage = getDamage(attacker, defender);
        return {
            ...defender,
            health: defender.health - damage
        };
    }
    return defender;
}

function updateHealthBar({ leftFighter, rightFighter }) {
    const leftFighterIndicator = document.getElementById('left-fighter-indicator');
    const rightFighterIndicator = document.getElementById('right-fighter-indicator');

    leftFighterIndicator.style.width = getFormatedHealth(leftFighter);
    rightFighterIndicator.style.width = getFormatedHealth(rightFighter);

    const leftFighterIndicatorShadow = document.getElementById('left-fighter-indicator-shadow');
    const rightFighterIndicatorShadow = document.getElementById('right-fighter-indicator-shadow');

    leftFighterIndicatorShadow.style.width = getFormatedHealth(leftFighter);
    rightFighterIndicatorShadow.style.width = getFormatedHealth(rightFighter);
}

function checkCriticalHit({ keyCombination, attacker, defender, pressedKeys }) {
    const rightCombination = keyCombination.every(code => pressedKeys.has(code));
    if (attacker.isCritical && rightCombination) {
        // eslint-disable-next-line no-param-reassign
        defender.health -= getCriticalHit(attacker);
        // eslint-disable-next-line no-param-reassign
        attacker.isCritical = false;
        const attackerElement = document.querySelector(`[name=${attacker.name}]`);
        attackerElement.classList.remove('light');
        attackerElement.style.width = '0';
        for (let i = 0; i <= 9; i += 1) {
            setTimeout(() => {
                attackerElement.style.width = `${(i + 1) * 10}%`;
            }, i * 1000);
        }
        setTimeout(() => {
            attackerElement.classList.add('light');
            // eslint-disable-next-line no-param-reassign
            attacker.isCritical = true;
        }, 10000);
    }
}

function animateWin(winner, loser) {
    const winnerElement = document.querySelector(`[title=${winner.name}]`);
    const loserElement = document.querySelector(`[title=${loser.name}]`);
    winnerElement.classList.add('win');
    setTimeout(() => {
        loserElement.classList.add('run');
        winnerElement.classList.add('run');
    }, 3000);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const defaultParameters = {
            isAttack: false,
            isBlock: false,
            isCritical: true
        };
        let playerOne = {
            ...firstFighter,
            maxHealth: firstFighter.health,
            ...defaultParameters
        };
        let playerTwo = {
            ...secondFighter,
            maxHealth: secondFighter.health,
            ...defaultParameters
        };

        const pressedKeys = new Set();

        window.addEventListener('keydown', event => {
            pressedKeys.add(event.code);
            switch (event.code) {
                case controls.PlayerOneAttack:
                    playerTwo = attack({ attacker: playerOne, defender: playerTwo });
                    break;
                case controls.PlayerTwoAttack:
                    playerOne = attack({ attacker: playerTwo, defender: playerOne });
                    break;
                case controls.PlayerOneBlock:
                    playerOne.isBlock = true;
                    break;
                case controls.PlayerTwoBlock:
                    playerTwo.isBlock = true;
                    break;
                default: {
                    break;
                }
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

            updateHealthBar({ leftFighter: playerOne, rightFighter: playerTwo });
            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                const winner = playerOne.health <= 0 ? playerTwo : playerOne;
                const loser = playerOne.health <= 0 ? playerOne : playerTwo;
                animateWin(winner, loser);
                setTimeout(() => resolve(winner), 3000);
            }
        });

        window.addEventListener('keyup', event => {
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
                default: {
                    break;
                }
            }
        });
    });
}

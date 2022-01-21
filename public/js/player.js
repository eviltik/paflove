import * as utils from './utils.js';

const player = document.querySelector("#player");

export function setRandomPosition(min, max) {

    const position = {
        x: utils.getRandomInt(min, max),
        y: 0, // rather than 1.6 as defined initialy (html)
        z: utils.getRandomInt(min, max)
    }

    if (!player) {
        throw new Error('Could not set player random position, #player not found');
    }

    player.setAttribute('position', position);

}


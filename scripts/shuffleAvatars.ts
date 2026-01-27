import fs from 'fs';

const fn1 = `./chats/avatars.json`;
const fn2 = `./chats/avatars-preview-updated-v2.json`;

/**
 * Shuffles array in place using the Fisher-Yates shuffle algorithm.
 * @param {Array} array The array containing the items to shuffle
 * @returns {Array} The shuffled array (modifies the original array).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shuffleArray(array: any[]) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element using array destructuring.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

fs.writeFileSync(
    'chats/all-avatars.json',
    JSON.stringify(
        shuffleArray([
            ...shuffleArray(JSON.parse(fs.readFileSync(fn1, 'utf-8').toString())),
            ...shuffleArray(JSON.parse(fs.readFileSync(fn2, 'utf-8').toString()))
        ]),
        null,
        '\t'
    )
);
// fs.writeFileSync('chats/outstanding-avatars-keyart.json', JSON.stringify(shuffleArray(JSON.parse(fs.readFileSync(fn2

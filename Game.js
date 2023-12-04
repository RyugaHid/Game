const crypto = require('crypto');
const readline = require('readline-sync');

function getRandomMove(moves){
 const randomIndex = Math.floor(Math.random() * moves.length)
 return moves[randomIndex]
}

function calculateHMAC(key, message) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('hex');
}

function determineWinner(userMoveIndex, computerMoveIndex, totalMoves){
    const half = totalMoves / 2
    if(userMoveIndex === computerMoveIndex){
        return 'Draw'
    }else if((userMoveIndex < computerMoveIndex && computerMoveIndex - userMoveIndex <= half)
    || (userMoveIndex > computerMoveIndex && computerMoveIndex - userMoveIndex > half) 
    ) {
        return 'Win'
    }else
    {
        return 'Lose'
    } 
    
}

function displayHelpTable(moves) {
    const table = [['v PC\\User >', ...moves.map(move => move.charAt(0).toUpperCase() + move.slice(1))]];
    for (let i = 0; i < moves.length; i++) {
        const row = [moves[i]];
        for (let j = 0; j < moves.length; j++) {
            const result = determineWinner(j, i, moves.length);
            row.push(result);
        }
        table.push(row);
    }

    console.table(table);
}

function playGame(moves) {
    const hmacKey = crypto.randomBytes(32).toString('hex');
    const computerMove = getRandomMove(moves);

    console.log(`HMAC: ${calculateHMAC(hmacKey, computerMove)}`);
    console.log('Available moves:');
    moves.forEach((move, index) => console.log(`${index + 1} - ${move}`));
    console.log('0 - exit');
    console.log('? - help');

    const userChoice = readline.question('Enter your move: ');
    if (userChoice === '0') {
        process.exit(0);
    } else if (userChoice === '?') {
        displayHelpTable(moves);
        playGame(moves);
    } else {
        const userMoveIndex = parseInt(userChoice) - 1;
        const result = determineWinner(userMoveIndex, moves.indexOf(computerMove), moves.length);

        console.log(`Your move: ${moves[userMoveIndex]}`);
        console.log(`Computer move: ${computerMove}`);
        console.log(result);
        console.log(`HMAC key: ${hmacKey}`);
    }
}

const moves = process.argv.slice(2);
if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
    console.error('Invalid input. Please provide an odd number of unique moves.');
    process.exit(1);
}

playGame(moves);


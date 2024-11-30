const playersDB = require("../models/aliases.model");


const getActivePlayers = () => {
    function randomActivePlayers(names, count) {
      let shuffled = names.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    let players = randomActivePlayers(playersDB, 15);
  
    function betStake() {
      let rng = Math.floor(Math.random() * (10000 - 1500 + 1)) + 1500;
      let bet = Math.round(rng / 100) * 100;
      return bet;
    }
    function cashOut() {
      let rng = Math.random() * (8.5 - 1.2) + 1.2;
      let cash = (Math.round(rng * 10) / 10).toFixed(2);
      return cash;
    }
    let playersWithBets = [];
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      let stake = betStake();
      let cashOutAt = cashOut();
      playersWithBets.push({
        player,
        stake,
        cashOutAt,
      });
    }
  
    playersWithBets.sort((a,b)=> b.stake  - a.stake);
    
    function getNextNumber(previousNumber) {
      const probabilities = [0.6, 0.3, 0.1]; // Probabilities for the given ranges
      let randomChoice = Math.random();
      let range, min, max;
    
      if (randomChoice < probabilities[0]) {
        // Gap less than 50
        range = Math.floor(Math.random() * 50) + 1;
      } else if (randomChoice < probabilities[0] + probabilities[1]) {
        // Gap between 50 and 100
        range = Math.floor(Math.random() * 50) + 50;
      } else {
        // Gap more than 100
        range = Math.floor(Math.random() * (355 - previousNumber - 100)) + 100;
      }
    
      // Randomly choose to add or subtract the range, ensuring bounds between 80 and 355
      if (Math.random() < 0.5) {
        min = Math.max(80, previousNumber - range);
        max = previousNumber;
      } else {
        min = previousNumber;
        max = Math.min(355, previousNumber + range);
      }
    
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let initialNumber = Math.floor(Math.random() * (355 - 80 + 1)) + 80;
    
    let count = getNextNumber(initialNumber);
  
    return ({playersWithBets,count});
};
  
module.exports = getActivePlayers
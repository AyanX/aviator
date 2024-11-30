const playersDB = require("../models/aliases.model");

const getPlayers = async (req, res) => {
  try {
    // Helper function to get random active players
    function randomActivePlayers(names, count) {
      let shuffled = [...names].sort(() => 0.5 - Math.random()); // Avoid mutating the original array
      return shuffled.slice(0, count);
    }

    // Helper function to generate random bet stake
    function betStake() {
      let rng = Math.floor(Math.random() * (10000 - 1500 + 1)) + 1500; // Random between 1500 and 10000
      return Math.round(rng / 100) * 100; // Round to nearest 100
    }

    // Helper function to generate random cashout value
    function cashOut() {
      let rng = Math.random() * (8.5 - 1.2) + 1.2; // Random between 1.2 and 8.5
      return parseFloat(rng.toFixed(2)); // Limit to 2 decimal places
    }

    // Fetch random players from the database
    const players = randomActivePlayers(playersDB, 15);

    // Build players with bets and cashout data
    const playersWithBets = players.map(player => ({
      player,
      stake: betStake(),
      cashOutAt: cashOut(),
    }));

    // Sort players by stake in descending order
    playersWithBets.sort((a, b) => b.stake - a.stake);

    // Helper function to get the next number based on probabilities
    function getNextNumber(previousNumber) {
      const probabilities = [0.6, 0.3, 0.1]; // Probabilities for ranges
      const randomChoice = Math.random();

      let range;
      if (randomChoice < probabilities[0]) {
        range = Math.floor(Math.random() * 50) + 1; // Gap less than 50
      } else if (randomChoice < probabilities[0] + probabilities[1]) {
        range = Math.floor(Math.random() * 50) + 50; // Gap between 50 and 100
      } else {
        range = Math.floor(Math.random() * (355 - previousNumber - 100)) + 100; // Gap more than 100
      }

      // Ensure new number stays within bounds (80 to 355)
      if (Math.random() < 0.5) {
        return Math.max(80, previousNumber - range);
      } else {
        return Math.min(355, previousNumber + range);
      }
    }

    // Generate initial number and count
    const initialNumber = Math.floor(Math.random() * (355 - 80 + 1)) + 80; // Random between 80 and 355
    const count = getNextNumber(initialNumber);

    // Send the response
    return res.status(200).send({ playersWithBets, count });
  } catch (error) {
    console.error("Error in getPlayers:", error);
    if (!res.headersSent) {
      return res.status(500).send({ error: "An error occurred while processing your request." });
    }
  }
};

module.exports = getPlayers;

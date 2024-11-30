// Required imports and configurations
const { createServer } = require("http");
const app = require("./app");
const getActivePlayers = require("./utils/getActivePlayers");
const startDB = require("./controllers/start_mongo");
require("dotenv").config();
const CryptoJS = require("crypto-js");
const { verifySocketToken } = require("./jwt/jwt");
const port = 8000;
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const SECRET_KEY = process.env.ENCRYPT_BURST;
const usersDB = require("./models/users.model");
const wonUsersDB = require("./models/wonUsers.model");
const burstsDB = require("./models/bursts.model");

// Function to generate random bursts
function randomInt() {
  const probability = Math.random();
  if (probability < 0.6) {
    return (Math.random() * (5.99 - 1.0) + 1.0).toFixed(2);
  } else if (probability < 0.85) {
    return (Math.random() * (10.59 - 6.0) + 6.0).toFixed(2);
  } else if (probability < 0.95) {
    return (Math.random() * (29.99 - 11.0) + 11.0).toFixed(2);
  } else {
    return (Math.random() * (180.99 - 30.0) + 30.0).toFixed(2);
  }
}

// Shared variables for synchronization
let bursts = [randomInt(), randomInt()]; // Preload bursts
let isTimerRunning = false; // Timer status
let requestQueue = []; // Queue to hold requests while the timer is running
let waitingSockets = []; // To track sockets in waiting mode
let burstsArray = []; // Array to store the last 10 bursts

// Function to save burstsArray to MongoDB
async function saveBurstsArrayToDB() {
  try {
    await burstsDB.updateOne(
      {},
      { $set: { bursts: burstsArray } },
      { upsert: true }
    );
  } catch (error) {
  }
}


// Function to handle updates
async function processUpdate() {
  console.log("at index 2 is :",bursts[1])
  if (isTimerRunning) return; // Prevent duplicate timers
  isTimerRunning = true;

  const burst = parseFloat(bursts[0]);
  const delay = burst * 1000 + 12.5 * 1000;

  try {
    const encryptedData = CryptoJS.AES.encrypt(burst.toString(), SECRET_KEY).toString();
    io.emit("new_time", encryptedData);

    console.log(`Broadcasting burst: ${burst}s`);

    const roundedBurst = Math.round(burst * 10) / 10;
    if (burstsArray.length >= 10) {
      burstsArray.shift();
    }
    burstsArray.push(roundedBurst);

    console.log("Updated burstsArray:", burstsArray);

    await saveBurstsArrayToDB();

    waitingSockets.forEach(socket => {
      const adjustedBurst = Math.round((burst - 12.5) * 10) / 10;
      socket.emit("waiting_done", adjustedBurst);
    });
    waitingSockets = [];

    bursts.shift();
    bursts.push(randomInt());
    console.log(`Next burst queued: ${bursts[1]}s`);
  } catch (error) {
    console.error("Error processing update:", error);
  } finally {
    setTimeout(() => {
      isTimerRunning = false;
      if (requestQueue.length > 0) {
        processUpdate();
      }
    }, delay);
  }
}

// WebSocket event handling
io.on("connection", (socket) => {
  const token = socket?.handshake?.headers?.cookie;
  let username;
  if (token) {
    try {
      username = verifySocketToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }

  if (isTimerRunning) {
    socket.emit("waiting", "A burst is currently active, please wait.");
    waitingSockets.push(socket);
  }

  socket.on("login", async (data) => {
    try {
      const phone_number = Number(data);
      if (!phone_number) return;

      const user = await usersDB.findOne({ phone_number });
      if (!user) return;

      socket.emit("balance", user.balance);
    } catch (error) {
      console.error("Error during login:", error);
    }
  });

  socket.on("update", () => {
    try {
      if (isTimerRunning) {
        requestQueue.push(socket);
      } else {
        processUpdate();
      }
    } catch (error) {
      console.error("Error during update request:", error);
    }
  });

  socket.on("get_players", async () => {
    try {
      const players = await getActivePlayers();
      socket.emit("new_players", players);
    } catch (error) {
      console.error("Error fetching active players:", error);
    }
  });

  socket.on("bet", async (userBet,callback) => {
    if (!username) {
      console.log("Token validation failed");
      return callback({message:"login to bet"})
    }

    try {
      const user = await usersDB.findOne({ username });
      if (!user) return;

      const { stake, cashOut } = userBet;
      const { balance } = user;

      if (stake < 20 || cashOut < 1) return;
      if (stake > balance) {
        return;
      }

      const newBalance = (balance - stake).toFixed(1);

      await usersDB.findOneAndUpdate(
        { username },
        { balance: newBalance }
      );
      socket.emit("balance", newBalance);

      if (cashOut > bursts[1]) {
        console.log(`${cashOut} is greater than ${bursts[1]}`)
        console.log("Player lost the bet");
        return;
      }

      const wonAmount = stake * cashOut;
      await wonUsersDB.updateOne(
        { username },
        { username, wonAmount },
        { upsert: true }
      );

      console.log(`Pending win for ${username}: ${wonAmount}`);
    } catch (error) {
      console.error("Error processing bet:", error);
    }
  });

  socket.on("game_end", async () => {
    try {
      const bursts = await burstsDB.find({});
      const savedBursts = bursts[0]?.bursts || [];
      socket.emit("bursts_array", savedBursts);
      console.log(savedBursts)
      if (!username) return;

      const user = await wonUsersDB.findOne({ username });
      if (!user) return;

      const { wonAmount } = user;
      socket.emit("balance", wonAmount);

      await usersDB.findOneAndUpdate(
        { username },
        { $inc: { balance: wonAmount } }
      );
      await wonUsersDB.deleteOne({ username });
    } catch (error) {
      console.error("Error handling game end:", error);
    }
  });
});

// Start the server and database
async function startServer() {
  try {
    await startDB();
    server.listen(port, () => console.log("Server started on port:", port));
  } catch (error) {
    console.error("Could not start server and DB:", error);
    return
  }
}

startServer();

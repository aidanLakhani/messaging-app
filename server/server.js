// Import dependencies
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const http = require("http");
const fs = require("fs");
const chalk = require("chalk");

// Environment variables
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./config.env" });
} else {
  var origins = process.env.CLIENT_URLS.split(",");
}
// Initialize Express
const app = express();
app.use(
  cors({
    origin: process.env.NODE_ENV == "production" ? origins : true,
    credentials: true,
  }),
);
app.use(express.json());

// Initialize server with websockets
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    // origin: "http://localhost:5173",
    origin: process.env.NODE_ENV == "production" ? origins : "*",
    methods: ["GET", "POST"],
  },
});

// Login / Signup routes

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hi",
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      error: "missing-fields",
      message: "Username and password need to be provided",
    });
  }
  sendToken(username, res);
});

app.post("/messages", (req, res) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "Message sent successfully",
    },
  });
});

let usersConnected = 0;
io.on("connection", (socket) => {
  usersConnected++;
  console.log(
    chalk.green("User connected: ") + chalk.bold(usersConnected + " users"),
  );

  socket.on("disconnect", () => {
    usersConnected--;
    console.log(
      chalk.red("User disconnected: ") + chalk.bold(usersConnected + " users"),
    );
  });
  socket.on("send_message", (data) => {
    io.emit("message", data);
  });
});

// JWT functions
function signToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN + "d",
  });
}

function sendToken(username, res) {
  const token = signToken(username);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.cookie("loggedIn", true, { expires: cookieOptions.expires });
  res.status(200).json({
    status: "success",
    token,
    data: {
      username,
    },
  });
}

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

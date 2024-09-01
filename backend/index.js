const { createServer } = require("http");
const { Server } = require("socket.io");
const app = require("./app/api");

require("dotenv").config();

/* constants */
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:2000";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

/* helpers */
const Lobby = require("./lobby");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      FRONTEND_URL,
      process.env.VITE_SOCKET_URL,
      process.env.DOMAIN2,
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

const lobby = new Lobby();

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomData) => {
    const status = lobby.addPlayer(socket, roomData);
    if (status === 1) {
      const players = lobby.getPlayers();
      console.log(players);
      io.to(roomData.ID).emit("StartGame", players);
    } else if (status === 0) {
      socket.emit("waitingForPlayer");
    } else if (status === -1) {
      console.log("Room is full");
    }
  });

  socket.on("playerMove", (room, data) => {
    let player = lobby.getSockPlayer(socket);
    //   let next_player
    io.to(room.ID).emit("moves", data, player.next);
  });

  socket.on("resetGame", (room) => {
    io.to(room.ID).emit("resetGame");
  });

  socket.on("disconnect", () => {
    const status = lobby.removePlayer(socket);
    if (status === 1) {
      io.to(lobby.roomDataT.ID).emit("playerDisconnected", socket.id);
      io.to(lobby.roomDataT.ID).emit("resetGame");
    } else if (status === -1) {
      console.log(`Could not remove player from this room: ${"?"}`);
    } else if (status === -2) {
      console.log("Invalid room");
    }
  });
});

console.log(FRONTEND_URL);
server.listen(PORT, () => {
  console.log(`app listening at ${SERVER_URL}`);
});

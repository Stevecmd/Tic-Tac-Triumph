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
    const player = lobby.addPlayerToRoom(socket);
    console.log("All Rooms: ", lobby.rooms);

    if (player) {
      const roomId = player.room_id;
      const players = lobby.rooms[roomId];
      io.to(roomId).emit("playerJoined", player);
      if (players.length === 2) {
        console.log(players);
        io.to(roomId).emit("StartGame", players);
      } else if (players.length === 1) {
        socket.emit("waitingForPlayer", player);
      } else {
        console.log("Unexpected room state");
      }
    } else {
      socket.emit("roomFullOrError", {
        message: "Room is full or an error occurred.",
      });
    }
  });

  socket.on("playerMove", (data) => {
    const next_player = lobby.getNextPlayer(data.player);
    io.to(data.player.room_id).emit("moves", {
      tiles: data.tiles,
      player: next_player,
    });
  });

  socket.on("resetGame", (player, text) => {
    io.to(player.room_id).emit("resetGame", player, text);
  });

  socket.on("disconnect", () => {
    const result = lobby.removePlayerBySocketId(socket.id);
    if (result && result.player) {
      io.to(result.player.room_id).emit("playerDisconnected", socket.id);
      io.to(result.player.room_id).emit("resetGame");
    } else {
      console.log("Invalid room");
    }
  });
});

console.log(FRONTEND_URL);
server.listen(PORT, () => {
  console.log(`app listening at ${SERVER_URL}`);
});

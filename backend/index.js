<<<<<<< HEAD
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

/* helpers */
const Lobby = require('./lobby');
=======
const express = require('express');
const path = require('path');
>>>>>>> 7d250ef11990a5800b1f333664a88415edcf7803

const app = express();
const port = 3000;
// Configure CORS options
const corsOptions = {
  origin: "http://localhost:2000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

<<<<<<< HEAD
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:2000",
    methods: ["GET", "POST"],
  },
});

/* Serve static files from the 'frontend' directory */
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const lobby = new Lobby();

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomData) => {
        const status = lobby.addPlayer(socket, roomData);
        if (status === 1) {
            const players = lobby.getPlayers();
            console.log(players);
            io.to(roomData.ID).emit('StartGame', players);
        } else if (status === -1 ) {
            console.log('Room is full');
        }
    });
    socket.on('playerMove', (room, data) => {
        io.to(room.ID).emit('moves', data);
    });
    socket.on('disconnect', () => {
        const status = lobby.removePlayer(socket);
        if (status === 1) {
            io.to(lobby.roomDataT.ID).emit('playerDisconnected', socket.id);
        } else if (status === -1) {
            console.log(`Could not remove player from this room: ${'?'}`);
        } else if (status === -2) {
            console.log('Invalid room');
        }
    });
});

server.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
=======
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
>>>>>>> 7d250ef11990a5800b1f333664a88415edcf7803

const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const path = require('path');

const app = express();
const port = 3000;

const server = createServer(app);
const io = new Server(server);

app.get(
    '/',
    (req,
     res) => { res.sendFile(path.join(__dirname, '../frontend/index.html')); });

io.on('connection', (socket) => {
  console.log('player connected');

  socket.on('test', (msg) => { console.log(msg); });
  socket.on('disconnect', () => { console.log('player disconnected'); });
});

server.listen(
    port, () => { console.log(`app listening at http://localhost:${port}`); });
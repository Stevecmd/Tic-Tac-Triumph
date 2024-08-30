class Lobby {
  constructor() {
    this.rooms = {};
    this.roomDataT = {};
  }

  addPlayer(socket, roomData) {
    if (!this.rooms[roomData.ID]) {
      this.rooms[roomData.ID] = [];
      this.roomDataT = roomData;
    }
    let room = this.rooms[roomData.ID];
    let room_length = room.length;
    let player_icon = "X";
    if (room_length < 2) {
      // Assign icon to Player
      if (room_length === 1) {
        const existingPlayer = room.find((sock_player) => sock_player);
        if (existingPlayer) {
          // Determine the opposite icon
          player_icon = existingPlayer.icon === "X" ? "O" : "X";
        }
      }

      //   let player_icon = room_length == 1 ? "X" : "O";
      room.push({ socket_id: socket.id, icon: player_icon });
      socket.join(roomData.ID);

      if (room.length === 2) {
        return 1; // Room is full, start game
      } else {
        return 0; // Waiting for another player
      }
    } else {
      return -1; // Room is full
    }
  }

  removePlayer(socket) {
    console.log(`player ${socket.id} disconnected`);
    if (this.roomDataT && this.rooms[this.roomDataT.ID]) {
      this.rooms[this.roomDataT.ID] = this.rooms[this.roomDataT.ID].filter(
        (player) => player.socket_id !== socket.id
      );
      console.log(`player ${socket.id} removed`);
      return 1;
    } else {
      return -2;
    }
  }

  getSockPlayer(socket) {
    let curr_player = this.rooms[this.roomDataT.ID].find(
      (player) => player.socket_id == socket.id
    );
    let next_player = this.rooms[this.roomDataT.ID].find(
      (player) => player.socket_id != socket.id
    );
    return { curr: curr_player, next: next_player };
  }

  getPlayers() {
    return this.rooms[this.roomDataT.ID];
  }
}

module.exports = Lobby;

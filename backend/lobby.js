class Lobby {
  constructor() {
    this.rooms = { 0: [] };
    this.roomDataT = {};
    this.room_count = Object.keys(this.rooms).length;
  }

  getAvailableRoomID() {
    for (let i = 0; i < this.room_count; i++) {
      if (this.rooms[i]) {
        if (this.rooms[i].length < 2) {
          return i;
        } else if (this.rooms[i].length == 2 && i == this.room_count - 1) {
          console.log("Creating new room", this.room_count);
          const id = this.room_count;
          this.rooms[id] = [];
          this.room_count = Object.keys(this.rooms).length;
          return id;
        }
      }
    }
  }

  getAvailableIcon(room_id) {
    // Get available player icon from the room

    const room = this.rooms[room_id];
    if (room) {
      if (room.length === 0) return "O";
      else {
        const existingPlayer = room.find((player) => player);
        if (existingPlayer) {
          return existingPlayer.player_icon === "X" ? "O" : "X";
        }
      }
    }
    // else return "O";
  }

  addPlayerToRoom(socket) {
    const room_id = this.getAvailableRoomID();

    this.rooms[room_id].push({
      socket_id: socket.id,
      player_icon: this.getAvailableIcon(room_id),
      room_id: room_id,
    });
    socket.join(room_id);

    const player = this.rooms[room_id].find((player) => {
      return player.socket_id == socket.id;
    });
    console.log(`player ${socket.id} added to room ${room_id}`);
    return player;
  }

  removePlayerBySocketId(socket_id) {
    console.log(`player ${socket_id} disconnected`);
    for (let i = 0; i < this.room_count; i++) {
      const room = this.rooms[i];
      if (room.length > 0) {
        const playerIndex = room.findIndex(
          (player) => player.socket_id === socket_id
        );

        // If a player is found, remove them from the room
        if (playerIndex !== -1) {
          room.splice(playerIndex, 1);
          console.log(`player ${socket_id} removed from room ${i}`);
          return { status: true, player: room[playerIndex] };
        }
      }
    }
    console.log(`player ${socket_id} not found in any room`);
    return false;
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

  getNextPlayer(current_player) {
    let next_player = this.rooms[current_player.room_id].find(
      (player) => player.socket_id != current_player.socket_id
    );
    return next_player;
  }

  getPlayers() {
    return this.rooms[this.roomDataT.ID];
  }
}

module.exports = Lobby;

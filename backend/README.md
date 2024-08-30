# Tic-Tac-Triumph Backend

This is the backend server for the Tic-Tac-Triumph multiplayer Tic-Tac-Toe game. It is built using Node.js, Express, and Socket.io to handle real-time game interactions and updates.

## Table of Contents

- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Technologies Used](#technologies-used)


## Project Structure
- `index.js`: Main server file that sets up the Express server and Socket.io.
- `lobby.js`: Handles the game lobby logic and player management.

## API Endpoints
- `GET /score`: Saves players score.
- `GET /scores`: Returns all player's scores.

## Socket Events
Uses Socket.io to handle real-time communication between players through events:

- `connection`: Triggered when a client connects to the server.
- `disconnect`: Triggered when a client disconnects from the server.
- `joinRoom`: Allows a player to join a game room.
- `playerMove`: Handles player moves and updates the game state.

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for handling HTTP requests.
- **Socket.io**: Library for real-time communication between the server and clients.

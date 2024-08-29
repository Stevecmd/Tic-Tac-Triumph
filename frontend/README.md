# Tic-Tac-Toe React App

This is a simple Tic-Tac-Toe game built with React, TypeScript, and Vite.

## Installation

Choose one of the following package managers to install the dependencies:

### npm

`npm install`

### yarn

`yarn install`

### pnpm

`pnpm install`

## Running the App

To run the app on port 3000, use one of the following commands based on your package manager:

### npm

`npm run dev`

### yarn

`yarn dev`

### pnpm

`pnpm run dev`

The app will start running on `http://localhost:3000`.

## Project Structure

The main components of the app are:

1. `App.tsx`: The root component that sets up the game state and context.
2. `TicTacToe.tsx`: The main game component.
3. `Board.tsx`: Renders the game board.
4. `Tile.tsx`: Individual tile component for the game board.
5. `Strike.tsx`: Renders the strike line for winning combinations.
6. `Reset.tsx`: Reset button component.\*\*\*\*

## Game Logic

The game logic is implemented using React hooks and context. The main state is managed in the `App.tsx` component and passed down to child components using the `AppContext`.

## Styling

The app uses CSS modules for styling. The main styles are defined in `src/styles/base.css`.

## Configuration

The app is configured using Vite. The configuration can be found in `vite.config.ts`.

This configuration sets up the development server to run on port 3000 and defines path aliases for easier imports.

---

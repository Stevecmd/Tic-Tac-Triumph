// Game variables
let canvas, ctx, squareSize, rows = 3, cols = 3;
let board = Array(rows).fill(null).map(() => Array(cols).fill(null));
let currentPlayer = 'X', hoveredBox = null;
let xWins = 0, oWins = 0, draws = 0;

// Load sound effects
const clickSound = new Audio('./sounds/mouse-click.mp3');
const winSound = new Audio('./sounds/success-fanfare-trumpets.mp3');
const drawSound = new Audio('./sounds/draw-sword1.mp3');

// Initialize the game on window load
window.onload = () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    drawGrid();

    // Add event listeners for user interactions
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', resizeCanvas);
};

// Draw the game grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let row = 0; row <= rows; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * squareSize);
        ctx.lineTo(cols * squareSize, row * squareSize);
        ctx.stroke();
    }
    for (let col = 0; col <= cols; col++) {
        ctx.beginPath();
        ctx.moveTo(col * squareSize, 0);
        ctx.lineTo(col * squareSize, rows * squareSize);
        ctx.stroke();
    }
}

// Handle canvas click events
function handleCanvasClick(event) {
    clickSound.play();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedCol = Math.floor(x / squareSize);
    const clickedRow = Math.floor(y / squareSize);

    if (clickedCol >= 0 && clickedCol < cols && clickedRow >= 0 && clickedRow < rows) {
        if (board[clickedRow][clickedCol] === null) {
            board[clickedRow][clickedCol] = currentPlayer;
            drawMark(clickedRow, clickedCol, currentPlayer);
            if (checkWin(clickedRow, clickedCol)) {
                winSound.play();
                setTimeout(() => {
                    alert(`${currentPlayer} wins!`);
                    updateScoreboard();
                    resetGame();
                }, 100);
            } else if (checkDraw()) {
                drawSound.play();
                setTimeout(() => {
                    alert("It's a draw!");
                    updateScoreboard(true);
                    resetGame();
                }, 100);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }
}

// Handle mouse move events
function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredCol = Math.floor(x / squareSize);
    const hoveredRow = Math.floor(y / squareSize);

    if (hoveredCol >= 0 && hoveredCol < cols && hoveredRow >= 0 && hoveredRow < rows) {
        if (board[hoveredRow][hoveredCol] === null) {
            if (hoveredBox === null || hoveredBox.row !== hoveredRow || hoveredBox.col !== hoveredCol) {
                if (hoveredBox !== null) {
                    clearGlow(hoveredBox.row, hoveredBox.col);
                }
                hoveredBox = { row: hoveredRow, col: hoveredCol };
                drawGlow(hoveredRow, hoveredCol);
            }
        } else {
            if (hoveredBox !== null) {
                clearGlow(hoveredBox.row, hoveredBox.col);
                hoveredBox = null;
            }
        }
    } else {
        if (hoveredBox !== null) {
            clearGlow(hoveredBox.row, hoveredBox.col);
            hoveredBox = null;
        }
    }
}

// Handle mouse out events
function handleMouseOut() {
    if (hoveredBox !== null) {
        clearGlow(hoveredBox.row, hoveredBox.col);
        hoveredBox = null;
    }
}

// Draw a glowing effect on the hovered box
function drawGlow(row, col) {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;
    ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
}

// Clear the glowing effect from the box
function clearGlow(row, col) {
    ctx.clearRect(col * squareSize, row * squareSize, squareSize, squareSize);
    ctx.fillStyle = 'blue';
    ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
    if (board[row][col] !== null) {
        drawMark(row, col, board[row][col]);
    }
}

// Draw the player's mark on the board
function drawMark(row, col, player) {
    ctx.fillStyle = 'white';
    ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);

    ctx.fillStyle = 'black';
    ctx.font = `${squareSize * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player, col * squareSize + squareSize / 2, row * squareSize + squareSize / 2);
}

// Check if the current player has won
function checkWin(row, col) {
    const player = board[row][col];

    // Check row
    if (board[row].every(cell => cell === player)) {
        drawWinningLine(row, 0, row, cols - 1);
        return true;
    }

    // Check column
    if (board.every(r => r[col] === player)) {
        drawWinningLine(0, col, rows - 1, col);
        return true;
    }

    // Check diagonal
    if (row === col && board.every((r, i) => r[i] === player)) {
        drawWinningLine(0, 0, rows - 1, cols - 1);
        return true;
    }

    // Check anti-diagonal
    if (row + col === cols - 1 && board.every((r, i) => r[cols - 1 - i] === player)) {
        drawWinningLine(0, cols - 1, rows - 1, 0);
        return true;
    }

    return false;
}

// Draw a line indicating the winning combination
function drawWinningLine(startRow, startCol, endRow, endCol) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startCol * squareSize + squareSize / 2, startRow * squareSize + squareSize / 2);
    ctx.lineTo(endCol * squareSize + squareSize / 2, endRow * squareSize + squareSize / 2);
    ctx.stroke();
}

// Check if the game is a draw
function checkDraw() {
    return board.flat().every(cell => cell !== null);
}

// Reset the game board
function resetGame() {
    board = Array(rows).fill(null).map(() => Array(cols).fill(null));
    currentPlayer = 'X';
    drawGrid();
    document.getElementById('restartButton').style.display = 'none';
}

// Update the scoreboard with the current game results
function updateScoreboard(isDraw = false) {
    if (isDraw) {
        draws++;
        document.getElementById('draws').textContent = draws;
    } else {
        if (currentPlayer === 'X') {
            xWins++;
            document.getElementById('xWins').textContent = xWins;
        } else {
            oWins++;
            document.getElementById('oWins').textContent = oWins;
        }
    }
}

// Resize the canvas and redraw the grid and marks
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    squareSize = canvas.width / cols;
    drawGrid();
    board.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell !== null) {
                drawMark(rIndex, cIndex, cell);
            }
        });
    });
}

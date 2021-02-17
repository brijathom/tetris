const cvs = document.getElementById("grid");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");
const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (squareSize = 25);
const VACANT = "#fafaff";
const GAME_OVER = new Audio();
GAME_OVER.src = "/sounds/game_over.mp3";
const LINE = new Audio();
LINE.src = "/sounds/line.mp3";
const ROTATE = new Audio();
ROTATE.src = "/sounds/rotate.mp3";

ROTATE.play();

// Squares on the grid are filled in as required
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// The grid is created
let grid = [];
for (r = 0; r < ROW; r++) {
    grid[r] = [];
    for (c = 0; c < COL; c++) {
        grid[r][c] = VACANT;
    }
}

// The grid is updated as required
function drawGrid() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, grid[r][c]);
        }
    }
}

drawGrid();

// The pieces and their associated colors
const PIECES = [
    [I, "#ff694f"],
    [O, "#ffe54f"],
    [J, "#a7ff4f"],
    [L, "#4fedff"],
    [S, "#4f75ff"],
    [T, "#814fff"],
    [Z, "#ff4fd9"],
];

// A random piece is selected
function randomPiece() {
    let r = (randomN = Math.floor(Math.random() * PIECES.length));
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

// The piece object
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = -2;
}

// The piece is filled in
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
};

// The piece is drawn on the grid
Piece.prototype.draw = function () {
    this.fill(this.color);
};

// The piece is removed from the grid
Piece.prototype.unDraw = function () {
    this.fill(VACANT);
};

// The piece is moved down
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
};

// The piece is moved to the right
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
};

// The piece is moved to the left
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
};

// The piece is rotated
Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
};

let score = 0;

// The piece is locked in place
Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            if (this.y + r < 0) {
                GAME_OVER.play();
                alert("Game Over");
                gameOver = true;
                break;
            }
            grid[this.y + r][this.x + c] = this.color;
        }
    }
    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && grid[r][c] != VACANT;
        }
        if (isRowFull) {
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    grid[y][c] = grid[y - 1][c];
                }
            }
            for (c = 0; c < COL; c++) {
                grid[0][c] = VACANT;
            }
            score += 10;
            LINE.play();
        }
    }
    drawGrid();
    scoreElement.innerHTML = score;
};

// The collision function
Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }

            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }

            if (newY < 0) {
                continue;
            }

            if (grid[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
};

document.addEventListener("keydown", control);

// Keypad controls
function control(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        ROTATE.play();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

// Button controls
function buttons(button) {
    if (button == "left") {
        p.moveLeft();
        dropStart = Date.now();
    } else if (button == "rotate") {
        p.rotate();
        ROTATE.play();
        dropStart = Date.now();
    } else if (button == "right") {
        p.moveRight();
        dropStart = Date.now();
    } else if (button == "down") {
        p.moveDown();
    }
}

// The rate at which pieces drop
let dropStart = Date.now();
let gameOver = false;
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();

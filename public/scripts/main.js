// The contents of the game grid are stored in an array of arrays.
// The colors of the squares in each respective row are contained in their own array.
// Initially all of the squares are set to the color assigned to the EMPTY constant.
let grid = [];
for (r = 0; r < ROW; r++) {
    grid[r] = [];
    for (c = 0; c < COLUMN; c++) {
        grid[r][c] = EMPTY;
    }
}

// The squares that make up the initial grid are drawn.
// The fill style of the square is set to the designated color of the piece.
// The stroke style of each square is set to the color assigned to the STROKE_STYLE constant.
function initialDrawSquare(x, y, color) {
    CONTEXT.fillStyle = color;
    CONTEXT.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    CONTEXT.strokeStyle = STROKE_STYLE;
    CONTEXT.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

// The grid is displayed on the page by drawing each square based on the colors stored stored in the grid array.
function initialDrawGrid() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COLUMN; c++) {
            initialDrawSquare(c, r, grid[r][c]);
        }
    }
}

// The initialDrawGrid function is called here in order to draw the blank grid at the start of the game.
initialDrawGrid();

// This function controls the game.
function play() {
    // The initial score for the game is set to 0.
    let score = 0;
    SCORE_ELEMENT.innerHTML = score;

    // The contents of the game grid are stored in an array of arrays.
    // The colors of the squares in each respective row are contained
    // in their own array.
    // Initially all of the squares are set to the color assigned to the EMPTY constant.
    let grid = [];
    for (r = 0; r < ROW; r++) {
        grid[r] = [];
        for (c = 0; c < COLUMN; c++) {
            grid[r][c] = EMPTY;
        }
    }

    // The squares that make up the initial grid are drawn.
    // The fill style of the square is set to the designated color of the piece.
    // The stroke style of each square is set to the color assigned to the STROKE_STYLE constant.
    function drawSquare(x, y, color) {
        CONTEXT.fillStyle = color;
        CONTEXT.fillRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        CONTEXT.strokeStyle = STROKE_STYLE;
        CONTEXT.strokeRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

    // The grid is displayed on the page by drawing each square based on the colors stored stored in the grid array.
    function drawGrid() {
        for (r = 0; r < ROW; r++) {
            for (c = 0; c < COLUMN; c++) {
                drawSquare(c, r, grid[r][c]);
            }
        }
    }

    // The drawGrid function is called here in order to draw the blank grid at the start of a new game.
    drawGrid();

    // The shapes (as set in the tetrominos.js file) and colours of the respective pieces are stored in the PIECES array.
    const PIECES = [
        [I, "#ff694f"],
        [O, "#ffe54f"],
        [J, "#a7ff4f"],
        [L, "#4fedff"],
        [S, "#4f75ff"],
        [T, "#814fff"],
        [Z, "#ff4fd9"],
    ];

    // The Piece class is definied.
    // The tetrominoNumber attribute refers to the orientation of the piece.
    // The numbers 0-3 refer to the 4 orientations that each tetromino shape can take respectively.
    // The activeTetromino attribute refers to the current orientation that is displayed on the grid.
    // The initial coordinates of the top right corner of the Pieces are set so that they are off of the canvas.
    // This allows them to appear at the top of the grid as they start their descent down the grid.
    class Piece {
        constructor(tetromino, color) {
            this.tetromino = tetromino;
            this.color = color;
            this.tetrominoNumber = 0;
            this.activeTetromino = this.tetromino[this.tetrominoNumber];
            this.x = 3;
            this.y = -2;
        }
    }

    // The fill method fills the squares appropriately on the grid.
    Piece.prototype.fill = function (color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    };

    // The draw method passes the color of tetrominos to the fill function.
    Piece.prototype.draw = function () {
        this.fill(this.color);
    };

    // The unDraw method passes the EMPTY color to the fill function.
    Piece.prototype.unDraw = function () {
        this.fill(EMPTY);
    };

    // The collision method prevents a movement being performed on a piece that would cause it to collide with any of the walls of the grid or any other pieces already in place on the board.
    Piece.prototype.collision = function (x, y, piece) {
        for (r = 0; r < piece.length; r++) {
            for (c = 0; c < piece.length; c++) {
                if (!piece[r][c]) {
                    continue;
                }
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if (newX < 0 || newX >= COLUMN || newY >= ROW) {
                    return true;
                }
                if (newY < 0) {
                    continue;
                }
                if (grid[newY][newX] != EMPTY) {
                    return true;
                }
            }
        }
        return false;
    };

    // The moveDown method moves a piece down by incrementing the y coordinate by 1 if there is no collision.
    // If the piece collides with other pieces and locks in place then a new random piece is generated.
    // If the game is over a new random piece is not generated.
    Piece.prototype.moveDown = function () {
        if (!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            if (gameOver != true) {
                p = randomPiece();
            } else {
                return;
            }
        }
    };

    // The moveRight method moves a piece to the right by incrementing the x coordinate by 1.
    Piece.prototype.moveRight = function () {
        if (!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    };

    // The moveLeft method moves a piece to the left by decrementing the x coordinate by 1.
    Piece.prototype.moveLeft = function () {
        if (!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    };

    // The rotate method rotates the piece by selecting the next pattern of the piece.
    // If the rotation will cause a collision with the right wall the piece is kicked to the left.
    // If the rotation will cause a collision with the left wall the piece will be kicked to the right.
    Piece.prototype.rotate = function () {
        let nextPattern = this.tetromino[(this.tetrominoNumber + 1) % this.tetromino.length];
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > COLUMN / 2) {
                kick = -1;
            } else {
                kick = 1;
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.tetrominoNumber = (this.tetrominoNumber + 1) % this.tetromino.length;
            this.activeTetromino = this.tetromino[this.tetrominoNumber];
            this.draw();
        }
    };

    // The lock method locks a piece in place.
    // This is performed by adding adding the piece in its current postion to the grid array.
    // This method also checks if there is a full row.
    // This is done by checking if there are any rows with no vacant squares.
    // If there are full rows they are removed from the grid and the points total is increased by 10.
    Piece.prototype.lock = function () {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                if (this.y + r < 0) {
                    gameOver = true;
                    BUTTON_GROUP.style.display = "none";
                    PLAY_BUTTON.style.display = "inline-block";
                    gameOverSound.play();
                    break;
                }
                grid[this.y + r][this.x + c] = this.color;
            }
        }
        for (r = 0; r < ROW; r++) {
            let isRowFull = true;
            for (c = 0; c < COLUMN; c++) {
                isRowFull = isRowFull && grid[r][c] != EMPTY;
            }
            if (isRowFull) {
                for (y = r; y > 1; y--) {
                    for (c = 0; c < COLUMN; c++) {
                        grid[y][c] = grid[y - 1][c];
                    }
                }
                for (c = 0; c < COLUMN; c++) {
                    grid[0][c] = EMPTY;
                }
                score += 10;
                lineSound.play();
            }
        }
        drawGrid();
        SCORE_ELEMENT.innerHTML = score;
    };

    // Pieces can be controlled using the arrow keys on the keypad.
    function keyControl(event) {
        if (event.keyCode == 37 && buttonPressed != true && gameOver != true) {
            keyPressed = true;
            p.moveLeft();
        } else if (event.keyCode == 38 && buttonPressed != true && gameOver != true) {
            keyPressed = true;
            p.rotate();
            rotateSound.play();
        } else if (event.keyCode == 39 && buttonPressed != true && gameOver != true) {
            keyPressed = true;
            p.moveRight();
        } else if (event.keyCode == 40 && buttonPressed != true && gameOver != true) {
            keyPressed = true;
            p.moveDown();
        }
    }

    function keyRelease() {
        keyPressed = false;
    }

    // The keyControl function will be called when a keydown event is detected.
    var keyPressed = false;
    document.addEventListener("keydown", keyControl);

    //  // The keyRelease function will be called when a keydown event is detected.
    buttonPressed = false;
    document.addEventListener("keyup", keyRelease);

    // Pieces can be controlled using the onscreen buttons.
    function buttons(button) {
        if (button == "left-button" && keyPressed != true && gameOver != true) {
            buttonPressed = true;
            p.moveLeft();
        } else if (button == "rotate-button" && keyPressed != true && gameOver != true) {
            buttonPressed = true;
            p.rotate();
            rotateSound.play();
        } else if (button == "right-button" && keyPressed != true && gameOver != true) {
            buttonPressed = true;
            p.moveRight();
        } else if (button == "down-button" && keyPressed != true && gameOver != true) {
            buttonPressed = true;
            p.moveDown();
        }
    }

    // A random piece is selected from the PIECES array.
    function randomPiece() {
        let r = (randomN = Math.floor(Math.random() * PIECES.length));
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }

    // The randomPiece() function is called here in order to generate the first piece at the start of the game.
    let p = randomPiece();

    // The rate at which pieces drop down the grid is controlled.
    // The requestAnimationFrame method will keep calling the drop function until the game is over.
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

    // Functionality is added to the game buttons.
    var interval = null;
    var timeout = null;
    var buttonPressed = false;

    LEFT_BUTTON.addEventListener("mousedown", function () {
        buttons("left-button");
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("left-button");
            }, 33);
        }, 400);
    });

    LEFT_BUTTON.addEventListener("mouseup", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    LEFT_BUTTON.addEventListener("mouseout", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    RIGHT_BUTTON.addEventListener("mousedown", function () {
        buttons("right-button");
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("right-button");
            }, 33);
        }, 400);
    });

    RIGHT_BUTTON.addEventListener("mouseup", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    RIGHT_BUTTON.addEventListener("mouseout", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    ROTATE_BUTTON.addEventListener("mousedown", function () {
        buttons("rotate-button");
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("rotate-button");
            }, 33);
        }, 400);
    });

    ROTATE_BUTTON.addEventListener("mouseup", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    ROTATE_BUTTON.addEventListener("mouseout", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    DOWN_BUTTON.addEventListener("mousedown", function () {
        buttons("down-button");
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("down-button");
            }, 33);
        }, 400);
    });

    DOWN_BUTTON.addEventListener("mouseup", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    DOWN_BUTTON.addEventListener("mouseout", function () {
        buttonPressed = false;
        clearInterval(interval);
        clearTimeout(timeout);
    });

    LEFT_BUTTON.addEventListener("touchstart", function (event) {
        buttons("left-button");
        event.preventDefault();
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("left-button");
            }, 33);
        }, 400);
    });

    LEFT_BUTTON.addEventListener("touchend", function () {
        clearInterval(interval);
        clearTimeout(timeout);
    });

    RIGHT_BUTTON.addEventListener("touchstart", function (event) {
        buttons("right-button");
        event.preventDefault();
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("right-button");
            }, 33);
        }, 400);
    });

    RIGHT_BUTTON.addEventListener("touchend", function () {
        clearInterval(interval);
        clearTimeout(timeout);
    });

    ROTATE_BUTTON.addEventListener("touchstart", function (event) {
        buttons("rotate-button");
        event.preventDefault();
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("rotate-button");
            }, 33);
        }, 400);
    });

    ROTATE_BUTTON.addEventListener("touchend", function () {
        clearInterval(interval);
        clearTimeout(timeout);
    });

    DOWN_BUTTON.addEventListener("touchstart", function (event) {
        buttons("down-button");
        event.preventDefault();
        timeout = setTimeout(function () {
            interval = setInterval(function () {
                buttons("down-button");
            }, 33);
        }, 400);
    });

    DOWN_BUTTON.addEventListener("touchend", function () {
        clearInterval(interval);
        clearTimeout(timeout);
    });

    // The drop function is called here in order to start the game.
    drop();

    // The play button is hidden and the game controls are displayed.
    PLAY_BUTTON.style.display = "none";
    BUTTON_GROUP.style.display = "block";
}

// When the play button is pressed the sound files are loaded and the play function is called.
PLAY_BUTTON.addEventListener("mousedown", function () {
    loadSounds();
    play();
});

PLAY_BUTTON.addEventListener("touchstart", function (event) {
    event.preventDefault();
    loadSounds();
    play();
});

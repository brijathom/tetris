// The main components required for the game are initialised.
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const ROW = 20;
const COLUMN = 10;
const SQUARE_SIZE = 20;
const EMPTY = "#fafaff";
const STROKE_STYLE = "#211f1f";
const SCORE_ELEMENT = document.getElementById("score");
const BUTTON_GROUP = document.getElementById("button-group");
const PLAY_BUTTON = document.getElementById("play-button");
const LEFT_BUTTON = document.getElementById("left-button");
const RIGHT_BUTTON = document.getElementById("right-button");
const ROTATE_BUTTON = document.getElementById("rotate-button");
const DOWN_BUTTON = document.getElementById("down-button");

let audioContext;
let rotateSound;
let lineSound;
let gameOverSound;

function loadSounds() {
    if (!audioContext) {
        rotateSound = new Howl({
            src: ["/sounds/rotate.mp3"],
        });
        lineSound = new Howl({
            src: ["/sounds/line.mp3"],
        });
        gameOverSound = new Howl({
            src: ["/sounds/game_over.mp3"],
        });
    }
}

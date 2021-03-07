// The main components required for the game are initialised.
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const SCORE_ELEMENT = document.getElementById("score");
const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (SQUARE_SIZE = 20);
const EMPTY = "#fafaff";
const STROKE_STYLE = "#211f1f";
const BUTTON_GROUP = document.getElementById("button-group");
const PLAY_BUTTON = document.getElementById("play-button");

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

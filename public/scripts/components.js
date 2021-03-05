// The main components required for the game are initialised here.
const CANVAS = document.getElementById("canvas");
const CONTEXT = CANVAS.getContext("2d");
const SCORE_ELEMENT = document.getElementById("score");
const ROW = 20;
const COL = (COLUMN = 10);
const SQ = (SQUARE_SIZE = 20);
const EMPTY = "#fafaff";
const STROKE_STYLE = "#211f1f";
const BUTTON_GROUP = document.getElementById("button-group");
const PLAY = document.getElementById("play");

let audioContext;
let ROTATE;
let LINE;
let GAME_OVER;

function loadSounds() {
    if (!audioContext) {
        audioContext = new AudioContext();
        ROTATE = new Audio("/sounds/rotate.mp3");
        LINE = new Audio("/sounds/line.mp3");
        GAME_OVER = new Audio("/sounds/game_over.mp3");
    }
}

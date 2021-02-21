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
const PLAY_AGAIN = document.getElementById("play-again");

const ROTATE = new Howl({
    src: ["/sounds/rotate.mp3"],
});
const LINE = new Howl({
    src: ["/sounds/line.mp3"],
});
const GAME_OVER = new Howl({
    src: ["/sounds/game_over.mp3"],
});

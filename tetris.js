class Tetris {
    constructor(imageX, imageY, template) {
        this.imageX = imageX;
        this.imageY = imageY;
        this.template = template;
        this.x = squareCountX / 2;
        this.y = 0;
    }

    getTruncedPosition() {
        return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
    }

    checkBottom() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realY + 1 >= squareCountY) {
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX != -1) {
                    return false;
                }
            }
        }
        return true;
    }

    checkLeft() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX - 1 < 0) return false;
                if (gameMap[realY][realX - 1].imageX != -1) return false;
            }
        }
        return true;
    }

    checkRight() {
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX + 1 >= squareCountX) return false;
                if (gameMap[realY][realX + 1].imageX != -1) return false;
            }
        }
        return true;
    }

    moveBottom() {
        if (this.checkBottom()) {
            this.y += 1;
            score += gameSpeed;
        }
    }

    moveRight() {
        if (this.checkRight()) {
            this.x += 1;
        }
    }

    moveLeft() {
        if (this.checkLeft()) {
            this.x -= 1;
        }
    }

    clockwiseRotation() {
        let tempTemplate = [];
        for (let i = 0; i < this.template.length; i++)
            tempTemplate[i] = this.template[i].slice();
        let n = this.template.length;
        for (let layer = 0; layer < n / 2; layer++) {
            let first = layer;
            let last = n - 1 - layer;
            for (let i = first; i < last; i++) {
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[i][last];   // top = right
                this.template[i][last] = this.template[last][last - offset];    // right = bottom
                this.template[last][last - offset] = this.template[last - offset][first];   // bottom = left
                this.template[last - offset][first] = top;  // left = top
            }
        }

        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
                    this.template = tempTemplate;
                    return false;
                }
            }
        }
    }

    counterClockwiseRotation() {
        let tempTemplate = [];
        for (let i = 0; i < this.template.length; i++)
            tempTemplate[i] = this.template[i].slice();
        let n = this.template.length;
        for (let layer = 0; layer < n / 2; layer++) {
            let first = layer;
            let last = n - 1 - layer;
            for (let i = first; i < last; i++) {
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[last - offset][first];  // top = left
                this.template[last - offset][first] = this.template[last][last - offset];   // left = bottom
                this.template[last][last - offset] = this.template[i][last];    // bottom = right
                this.template[i][last] = top;   // right = top
            }
        }

        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
                    this.template = tempTemplate;
                    return false;
                }
            }
        }
    }
}

// Game config
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreText = document.getElementById("scoreText");
const image = document.getElementById("image");
const btnRefresh = document.getElementById("btnRefresh");

const imageSquareSize = 25;
const size = 30;
const framePerSecond = 25;
const gameSpeed = 1;
const displayLineheight = 40;
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

// Constant section
const textGameOver = "Game Over!!";
const textPressNewGame = ["Press 'R'", "for new game"];
const textPause = "Pause";
const textPressContinue = ["Press Space Bar", "for continue"];

// Score section
const scoreDeletedRow = 1000;

// Initial tetris shapes
const shapes = [
    new Tetris(0, 0, [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]),
    new Tetris(0, 25, [
        [1, 1],
        [1, 1]
    ]),
    new Tetris(0, 50, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ]),
    new Tetris(0, 75, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ]),
    new Tetris(0, 100, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]),
    new Tetris(0, 125, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ]),
    new Tetris(0, 150, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ])
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThickness = 3;
let gamePause;
let firstLoop;

const gameLoop = () => {
    setInterval(update, 1000 / gameSpeed);
    setInterval(draw, 1000 / framePerSecond);
};

const deleteCompleteRows = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        let isComplete = true;
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) isComplete = false;
        }
        if (isComplete) {
            console.log("complete row");
            score += scoreDeletedRow;
            for (let k = i; k > 0; k--) {
                gameMap[k] = gameMap[k - 1];
            }
            let temp = [];
            for (let j = 0; j < squareCountX; j++) {
                temp.push({ imageX: -1, imageY: -1 });
            }
            gameMap[0] = temp;
        }
    }
};

const update = () => {
    if (!gamePause) {
        if (gameOver) return;
        if (currentShape.checkBottom()) {
            currentShape.y += 1;
        } else {
            for (let k = 0; k < currentShape.template.length; k++) {
                for (let l = 0; l < currentShape.template.length; l++) {
                    if (currentShape.template[k][l] == 0) continue;
                    const currentTruncePositionXY = currentShape.getTruncedPosition();
                    gameMap[currentTruncePositionXY.y + l][currentTruncePositionXY.x + k] = { imageX: currentShape.imageX, imageY: currentShape.imageY };
                }
            }
            deleteCompleteRows();
            currentShape = nextShape;
            nextShape = getRandomShape();
            if (!currentShape.checkBottom()) {
                gameOver = true;
            }
            score += 100;
            drawNextShape();
        }
    }
};

const drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

const drawBackground = () => {
    drawRect(0, 0, canvas.width, canvas.height, "#cccccc");
    for (let i = 0; i < squareCountX + 1; i++) {
        drawRect(
            size * i - whiteLineThickness,
            0,
            whiteLineThickness,
            canvas.height,
            "white"
        );
    }

    for (let i = 0; i < squareCountY + 1; i++) {
        drawRect(
            0,
            size * i - whiteLineThickness,
            canvas.width,
            whiteLineThickness,
            "white"
        );
    }
};

const drawCurrentTetris = () => {
    for (let i = 0; i < currentShape.template.length; i++) {
        for (let j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x) * size + size * i,
                Math.trunc(currentShape.y) * size + size * j,
                size,
                size
            );
        }
    }
};

const drawSquares = () => {
    for (let i = 0; i < gameMap.length; i++) {
        let t = gameMap[i];
        for (let j = 0; j < t.length; j++) {
            if (t[j].imageX == -1) continue;
            ctx.drawImage(
                image,
                t[j].imageX,
                t[j].imageY,
                imageSquareSize,
                imageSquareSize,
                j * size,
                i * size,
                size,
                size
            );
        }
    }
};

const drawNextShape = () => {
    // nctx.fillStyle = "#000061";
    nctx.fillStyle = "black";
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (let i = 0; i < nextShape.template.length; i++) {
        for (let j = 0; j < nextShape.template.length; j++) {
            if (nextShape.template[i][j] == 0) continue;
            nctx.drawImage(
                image,
                nextShape.imageX,
                nextShape.imageY,
                imageSquareSize,
                imageSquareSize,
                ((nextShapeCanvas.width / 2) - ((nextShape.template.length * size) / 2) + (size * i)),
                ((nextShapeCanvas.width / 2) - ((nextShape.template.length * size) / 2) + (size * j)),
                size,
                size
            );
        }
    }
};

const drawScore = () => {
    scoreText.innerHTML = score;
};

const drawGameOver = () => {
    // Draw background alpha black
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text "Game Over"
    ctx.globalAlpha = 1.0;
    ctx.font = "36px Silkscreen";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(textGameOver, canvas.width / 2, (canvas.height / 2) - displayLineheight);

    // Draw text press button
    ctx.font = "26px Silkscreen";
    for (var j = 0; j < textPressNewGame.length; j++) {
        ctx.fillText(textPressNewGame[j], canvas.width / 2, (canvas.height / 2) + (j * displayLineheight));
    }
};

const drawPause = () => {
    // Draw Background Alpha Black
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Text "Pause"
    ctx.font = "36px Silkscreen";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(textPause, canvas.width / 2, (canvas.height / 2) - displayLineheight);

    // Draw text press button
    ctx.font = "26px Silkscreen";
    for (var j = 0; j < textPressContinue.length; j++) {
        ctx.fillText(textPressContinue[j], canvas.width / 2, (canvas.height / 2) + (j * displayLineheight));
    }
}

const draw = () => {
    if (!gamePause) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawSquares();
        drawCurrentTetris();
        // Check first loop
        if (firstLoop) {
            drawNextShape();
            firstLoop = false;
        }
        drawScore();
        if (gameOver) {
            drawGameOver();
        }
    }
};

const setPause = () => {
    // set pause or continue
    gamePause = !gamePause;
    if (gamePause) {
        drawPause();
    }
};

// Random Tetris Shape
const getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

const resetVars = () => {
    initialTwoDArr = [];
    for (let i = 0; i < squareCountY; i++) {
        let temp = [];
        for (let j = 0; j < squareCountX; j++) {
            temp.push({ imageX: -1, imageY: -1 });
        }
        initialTwoDArr.push(temp);
    }
    score = 0;
    gameOver = false;
    currentShape = getRandomShape();
    nextShape = getRandomShape();
    gameMap = initialTwoDArr;

    // set pause to false
    gamePause = false;

    // set first loop
    firstLoop = true;
};

// Add Event 'Keydown' for play game
window.addEventListener("keydown", (event) => {
    if (gameOver) {
        if (event.keyCode == 82) resetVars();  // key 'r' for refresh game
    } else {
        if (!gamePause) {
            if (event.keyCode == 37) currentShape.moveLeft();   // key 'left' for move to left
            else if (event.keyCode == 38) currentShape.clockwiseRotation();    // key 'up' for Tetris rotation
            else if (event.keyCode == 39) currentShape.moveRight(); // key 'right' for move to bottom
            else if (event.keyCode == 40) currentShape.moveBottom();    // key 'down' for move to bottom
            else if (event.keyCode == 82) resetVars();  // key 'r' for refresh game
            else if (event.keyCode == 68) currentShape.clockwiseRotation();    // key 'd' for Tetris rotation
            else if (event.keyCode == 83) currentShape.counterClockwiseRotation();    // key 's' for Tetris rotation
        }
        if (event.keyCode == 32) setPause();  // key 'spacebar' for pause/continue game
    }
});

// Add Event 'refresh' button click
btnRefresh.addEventListener("click", () => {
    btnRefresh.blur();
    resetVars();
});

resetVars();
gameLoop();
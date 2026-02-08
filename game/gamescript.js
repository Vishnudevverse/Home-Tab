document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const nextCanvas = document.getElementById('next');
    const nextContext = nextCanvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const maxScoreElement = document.getElementById('max-score');
    const toggleBtn = document.getElementById('btn-toggle');
    const gameContainer = document.getElementById('game-container');

    context.scale(20, 20);
    nextContext.scale(20, 20);

    function getColors() {
        const style = getComputedStyle(document.documentElement);
        return {
            bg: style.getPropertyValue('--bg-color').trim(),
            fg: style.getPropertyValue('--fg-color').trim(),
            grid: style.getPropertyValue('--grid-line-color').trim() || '#000000'
        };
    }


    const arena = createMatrix(12, 20);
    const pieces = 'ILJOTSZ';

    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let nextPieceType = null;


    let maxScore = 0;
    try {
        const stored = localStorage.getItem('tetris_max_score');
        if (stored) maxScore = parseInt(stored, 10);
    } catch (e) { console.log("Storage access blocked"); }

    maxScoreElement.innerText = maxScore;

    let isPaused = true;
    let isGameOver = false;
    let requestId = null;

    const player = {
        pos: { x: 0, y: 0 },
        matrix: null,
        score: 0,
    };

    function createPiece(type) {
        if (type === 'I') return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
        if (type === 'L') return [[0, 1, 0], [0, 1, 0], [0, 1, 1]];
        if (type === 'J') return [[0, 1, 0], [0, 1, 0], [1, 1, 0]];
        if (type === 'O') return [[1, 1], [1, 1]];
        if (type === 'Z') return [[1, 1, 0], [0, 1, 1], [0, 0, 0]];
        if (type === 'S') return [[0, 1, 1], [1, 1, 0], [0, 0, 0]];
        if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
    }

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) matrix.push(new Array(w).fill(0));
        return matrix;
    }

    function draw() {
        const colors = getColors();
        context.fillStyle = colors.bg;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawMatrix(arena, { x: 0, y: 0 }, context);
        drawMatrix(player.matrix, player.pos, context);
    }

    function drawMatrix(matrix, offset, ctx) {
        const colors = getColors();
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    ctx.fillStyle = colors.fg;
                    ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                    ctx.lineWidth = 0.05;
                    ctx.strokeStyle = colors.grid;
                    ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    function drawNextPiece() {
        const colors = getColors();
        nextContext.fillStyle = colors.bg;
        nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        if (nextPieceType) {
            const piece = createPiece(nextPieceType);
            const xOffset = (5 - piece[0].length) / 2;
            const yOffset = (5 - piece.length) / 2;
            drawMatrix(piece, { x: xOffset, y: yOffset }, nextContext);
        }
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = 1;
                }
            });
        });
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) matrix.forEach(row => row.reverse());
        else matrix.reverse();
    }

    function playerReset() {
        if (!nextPieceType) nextPieceType = pieces[pieces.length * Math.random() | 0];
        player.matrix = createPiece(nextPieceType);
        nextPieceType = pieces[pieces.length * Math.random() | 0];
        drawNextPiece();

        player.pos.y = 0;
        player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

        if (collide(arena, player)) {
            arena.forEach(row => row.fill(0));


            if (player.score > maxScore) {
                maxScore = player.score;
                localStorage.setItem('tetris_max_score', maxScore);
                maxScoreElement.innerText = maxScore;
            }

            player.score = 0;
            scoreElement.innerText = "0";

            isGameOver = true;
            pauseGame();
            toggleBtn.innerText = "START";
        }
    }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    function arenaSweep() {
        let rowCount = 1;
        outer: for (let y = arena.length - 1; y > 0; --y) {
            for (let x = 0; x < arena[y].length; ++x) {
                if (arena[y][x] === 0) continue outer;
            }
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            ++y;
            player.score += rowCount * 10;
            rowCount *= 2;
            updateScore();
        }
    }

    function updateScore() {
        scoreElement.innerText = player.score;


        if (player.score > maxScore) {
            maxScore = player.score;
            maxScoreElement.innerText = maxScore;
            localStorage.setItem('tetris_max_score', maxScore);
        }
    }

    function update(time = 0) {
        if (isPaused) return;

        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;

        if (dropCounter > dropInterval) {
            playerDrop();
        }
        draw();
        requestId = requestAnimationFrame(update);
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
            arenaSweep();
        }
        dropCounter = 0;
    }

    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(arena, player)) player.pos.x -= dir;
    }

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    function startGame() {
        if (isGameOver) {
            arena.forEach(row => row.fill(0));
            player.score = 0;
            scoreElement.innerText = "0";
            isGameOver = false;
            playerReset();
        }
        isPaused = false;
        toggleBtn.innerText = "PAUSE";
        update();
    }

    function pauseGame() {
        isPaused = true;
        if (requestId) cancelAnimationFrame(requestId);
        if (!isGameOver) {
            toggleBtn.innerText = "RESUME";
        }
    }

    function toggleGame() {
        if (isPaused) {
            startGame();
        } else {
            pauseGame();
        }
    }

    toggleBtn.addEventListener('click', () => {
        toggleGame();
        window.focus();
    });

    document.addEventListener('keydown', event => {
        if (isPaused) return;
        if (event.keyCode === 37) playerMove(-1);
        else if (event.keyCode === 39) playerMove(1);
        else if (event.keyCode === 40) playerDrop();
        else if (event.keyCode === 38) playerRotate(1);
    });

    window.addEventListener('blur', () => {
        if (!isPaused && !isGameOver) {
            pauseGame();
        }
    });

    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        document.getElementById('time').innerText = timeStr;
        document.getElementById('date').innerText = dateStr;
    }
    setInterval(updateClock, 1000);
    updateClock();
    playerReset();
    draw();
});
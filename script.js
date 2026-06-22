const gridElement = document.getElementById("grid");

const SIZE = 4;

const buildings = {
    2 : "tent",
    4 : "house",
    8 : "village",
    16 : "town",
    32 : "castle",
    64 : "king",
    128 : "empire",
    256 : "nation",
    512 : "continent",
    1024 : "world",
    2048 : "galaxy"
}

let grid = [];
let score = 0;

const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart")
const bestElement = document.getElementById("best");
let bestScore = localStorage.getItem("bestScore") || 0;
bestElement.textContent = bestScore;

const moveLight = new Audio("assets/sounds/move-light.mp3");
const moveHeavy = new Audio("assets/sounds/move-heavy.mp3");
const swordLight = new Audio("assets/sounds/sword-light.mp3");
const swordHeavy = new Audio("assets/sounds/sword-heavy.mp3");
const victory = new Audio("assets/sounds/victory.mp3");
const gameStart = new Audio("assets/sounds/game-start.mp3");
const highScore = new Audio("assets/sounds/high-score.mp3");

let highScoreReached = false;

document.addEventListener("keydown", (event) => {

    let moved = false;
    
    if (event.key === "ArrowLeft") moved = moveLeft();
    if (event.key === "ArrowRight") moved = moveRight();
    if (event.key === "ArrowUp") moved = moveUp();
    if (event.key === "ArrowDown") moved = moveDown();
    if (moved) 
    {
        addRandomTile();
        drawGrid();
        setTimeout(() => {
            checkWin();
            checkGameOver();
        }, 100);
    }
});

restartButton.addEventListener("click", startGame);

function createGrid() {
    grid = Array.from( 
        {length: SIZE },
        () => Array(SIZE).fill(0)
    );
}

createGrid();
console.log(grid);

function addRandomTile() {
    const empty = [];

    for (let r = 0; r < SIZE; r++)
    {
        for (let c = 0; c < SIZE; c++)
        {
            if (grid[r][c] === 0)
            {
                empty.push({r,c});
            }
        }
    }
    if (empty.length === 0) return;

    const randomCell = empty[Math.floor(Math.random() * empty.length)];
    grid[randomCell.r][randomCell.c] = 2;
}

function drawGrid()
{
    gridElement.innerHTML = "";

    for (let r = 0; r < SIZE; r++)
    {
        for (let c = 0; c < SIZE; c++)
        {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            const value = grid[r][c];
            if (value !== 0) 
            {
                const img = document.createElement("img");
                img.src = `assets/${buildings[value]}.jpg`;
                img.classList.add("tile-image");
                cell.appendChild(img);
            }
            gridElement.appendChild(cell);
        }
    }
    scoreElement.textContent = score;
    bestElement.textContent = bestScore;
}


function slide(row) 
{
    const filtered = row.filter(value => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++)
    {
        if (filtered[i] == filtered[i + 1])
        {
            filtered[i] *= 2;
            score += filtered[i];

            const newValue = filtered[i];

            if (newValue <= 8)
            {
                moveLight.currentTime = 0;
                moveLight.play();
            }
            else if (newValue <= 64)
            {
                moveHeavy.currentTime = 0;
                moveHeavy.play();
            }
            else if (newValue <= 256)
            {
                swordLight.currentTime = 0;
                swordLight.play();
            }
            else {
                swordHeavy.currentTime = 0;
                swordHeavy.play();
            }

            if (score > bestScore)
            {
                bestScore = score;

                localStorage.setItem("bestScore",bestScore);

                if (!highScoreReached)
                {
                    highScoreReached = true;
                    highScore.currentTime = 0;
                    highScore.play();
                }
            }
            filtered.splice(i + 1, 1);

        }
    }
    while (filtered.length < SIZE)
    {
        filtered.push(0);
    }
    return filtered;
}

function moveLeft() 
{
    let moved = false;

    for (let r = 0; r < SIZE; r++)
    {
        const newRow = slide(grid[r]);
        if (newRow.some((val, i) => val !== grid[r][i]))
        {
            moved = true;
        }
        grid[r] = newRow;
    }
    return moved;
}

function moveRight()
{
    let moved = false;

    for (let r = 0; r < SIZE; r++)
    {
        const reversed = grid[r].slice().reverse();

        const newRow = slide(reversed).reverse();

        if (newRow.some((val, i) => val !== grid[r][i]))
        {
            moved = true;
        }

        grid[r] = newRow;
    }
    return moved;
}

function moveUp()
{
    let moved = false;

    for (let c = 0; c < SIZE; c++)
    {
        const column = grid.map(row => row[c]);

        const newColumn = slide(column);

        for (let r = 0; r < SIZE; r++)
        {
            if (grid[r][c] !== newColumn[r])
            {
                moved = true;
            }
            grid[r][c] = newColumn[r];
        }
    }
    return moved;

}

function moveDown()
{
    let moved = false;

    for (let c = 0; c < SIZE; c++)
    {
        const column = grid.map(row => row[c]).reverse();

        const newColumn = slide(column).reverse();

        for (let r = 0; r < SIZE; r++)
        {
            if (grid[r][c] !== newColumn[r])
            {
                moved = true;
            }
            grid[r][c] = newColumn[r];
        }
    }
    return moved;
}


function checkWin()
{
    for (let r = 0; r < SIZE; r++)
    {
        for (let c = 0; c < SIZE; c++)
        {
            if (grid[r][c] === 2048 && !hasWon)
            {
                hasWon = true;
                victory.currentTime = 0;
                victory.play();
                setTimeout(() => {
                    alert("YOU BUILT THE ULTIMATE 2048 KINGDOM!");
                }, 300); 
                return true;
            }
        }
    }
    return false;
}

function canMoveAny()
{
    for (let r = 0; r < SIZE; r++)
    {
        for (let c = 0; c < SIZE; c++)
        {
            if (grid[r][c] === 0)
            {
                return true;
            }
            if (c < SIZE - 1 && grid[r][c] === grid[r][c+1])
            {
                return true;
            }
            if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c])
            {
                return true;
            }
        }
    }
    return false;
}


function checkGameOver()
{
    if (!canMoveAny())
    {
        alert("GAME OVER! YOUR KINGDOME HAS FALLEN!!!!")
    }
}


function startGame() 
{
    score = 0;
    hasWon = false;
    highScoreReached = false;
    createGrid();
    addRandomTile();
    addRandomTile();
    drawGrid();
    gameStart.currentTime = 0;
    gameStart.play();
}

startGame();
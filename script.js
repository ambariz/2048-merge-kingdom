const gridElement = document.getElementById("grid");

const SIZE = 4;

const buildings = {
    2 : "tent",
    4 : "house",
    8 : "village",
    16 : "town",
    32 : "palace",
    64 : "king"
}

let grid = [];

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
                cell.textContent = buildings[value];
            }
            gridElement.appendChild(cell);
        }
    }
}

function startGame() 
{
    createGrid();
    addRandomTile();
    addRandomTile();
    drawGrid();
}

startGame();
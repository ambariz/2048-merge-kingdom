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
let score = 0;

const scoreElement = document.getElementById("score");

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
    }
});


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
    scoreElement.textContent = score;
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
        const reverse = grid[r].slide().reverse();
        const newRow = slide(reversed).reverse();
        if (newRow.some((val,i) => val != grid[r][i]))
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
            grid[r][c] = newColumn;
        }
    }
    return moved;
}

function startGame() 
{
    createGrid();
    addRandomTile();
    addRandomTile();
    drawGrid();
}

startGame();
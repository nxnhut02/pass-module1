let rows = 3;
let columns = 3;
let currentMode = "easy";
let blankTile; 
let turns = 0;
let imgOrder = [];
let blankImgName = "";
let isGameOver = false;

window.onload = function() {
    startGame();
}

function changeMode(size, modeName) {
    rows = size;
    columns = size;
    currentMode = modeName;
    startGame();
}


function startGame() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    
    turns = 0;
    document.getElementById("turns").innerText = turns;
    isGameOver = false;

    board.style.setProperty('--cols', columns);
    board.style.setProperty('--rows', rows);

    let totalTiles = rows * columns;
    
    blankImgName = totalTiles.toString() + ".jpg";

    generateRandomOrder(totalTiles);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = `${r}-${c}`;
            
            let imgNum = imgOrder.shift();
            let imgName = imgNum + ".jpg";

            tile.src = `images/${currentMode}/${imgName}`;

            if (imgName === blankImgName) {
                blankTile = tile;
                tile.style.opacity = "0";
            } else {
                tile.style.opacity = "1";
            }

            tile.addEventListener("click", clickTile);
            board.append(tile);
        }
    }
}

function generateRandomOrder(totalTiles) {
    imgOrder = [];
    
    for (let i = 1; i < totalTiles; i++) {
        imgOrder.push(i.toString());
    }

    for (let i = imgOrder.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [imgOrder[i], imgOrder[j]] = [imgOrder[j], imgOrder[i]];
    }

    imgOrder.push(totalTiles.toString());
}

function clickTile() {
    if (isGameOver) return;

    if (this.src.includes(blankImgName)) {
        return; 
    }

    let currCoords = this.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let blankCoords = blankTile.id.split("-");
    let r2 = parseInt(blankCoords[0]);
    let c2 = parseInt(blankCoords[1]);

    let moveLeft = (r == r2 && c2 == c - 1);
    let moveRight = (r == r2 && c2 == c + 1);
    let moveUp = (c == c2 && r2 == r - 1);
    let moveDown = (c == c2 && r2 == r + 1);

    if (moveLeft || moveRight || moveUp || moveDown) {
        let currImg = this.src;
        let blankImg = blankTile.src;

        this.src = blankImg;
        blankTile.src = currImg;

        this.style.opacity = "0";
        blankTile.style.opacity = "1";

        blankTile = this;

        turns += 1;
        document.getElementById("turns").innerText = turns;

        setTimeout(checkWin, 100); 
    }
}

function checkWin() {
    const board = document.getElementById("board");
    const tiles = board.getElementsByTagName("img");
    
    let expectedNumber = 1;

    for (let i = 0; i < tiles.length; i++) {

        let srcParts = tiles[i].src.split('/');
        let currentImgName = srcParts[srcParts.length - 1];

        let correctImgName = expectedNumber + ".jpg";

        if (currentImgName !== correctImgName) {
            return; 
        }
        expectedNumber++;
    }

    isGameOver = true;

    blankTile.style.opacity = "1"; 

    alert("You Win! Bạn đã hoàn thành màn chơi sau " + turns + " lượt đi.");
}
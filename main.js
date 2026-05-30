const app = document.getElementById('app');
const pieces = document.getElementById('pieces');
const sampleImage = document.getElementById('sample-image');
const moveInfo = document.getElementById('move-info');

class Game {
    constructor(imgSrc, gridSize=3) {
        this.imgSrc = imgSrc;
        this.gridSize = gridSize;
        this.numOfPieces = gridSize * gridSize;
        this.piecesUrls = [];
        this.riddle = [];
}

    preset() {
        sampleImage.src = this.imgSrc;
    }

    createRiddle() 
    {
        for (let i = 0; i < this.numOfPieces; i++) {
            this.riddle.sort((a,b) => 0.5 - Math.random());
        }

    loadPieces() 
        {
        const img = new Image();
        img.src = this.imgSrc;
        img.onload = () => 
            {
            const minDimension = Math.min(img.naturalWidth, img.naturalWidth);
            const pieceSize = Math.floor(minDimension / this.gridSize);

            for (let i = 0; i < this.gridSize; i++) 
            {
                for (let j = 0; j < this.gridSize; j++) {
                    const cv = document.createElement('canvas');
                    cv.width = pieceSize;
                    cv.height = pieceSize;
                    const ctx = cv.getContext('2d');
                    ctx.drawImage(img, j * pieceSize, i * pieceSize, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
                    this.piecesUrls.push(cv.toDataURL());
                }
            }
            this.riddle.forEach((val, idx) => 
                {
                let ele;
                if (val == this.numOfPieces - 1) ele = document.createElement('div');
                else 
                    {
                    ele = document.createElement('img');
                    ele.src = this.piecesUrls[val];
                    ele.setAttribute('data-index', idx);
                    ele.setAttribute('data-x', 0);
                    ele.setAttribute('data-y', 0);
                    ele.classList.add('piece');

                    ele.addEventListener('click', this.handlePieceClick);
                    }
                pieces.append(ele);
                });
            };
        }

        swap(idx1, idx2)
        {
            [this.riddle[idx1], this.riddle[idx2]] = [this.riddle[idx2], this.riddle[idx1]];
        }

        handlePieceClick(e) 
        {
            const ele = e.target;
            const hiddenPiece = this.numOfPieces - 1;
            const dataX = ele.getAttribute('data-x');
            const dataY = ele.getAttribute('data-y');
            const idx = ele.getAttribute('data-idx');
            let newX = dataX, newY = dataY, newIdx = idx;

            const canMoveLeft = idx => !(idx % this.gridSize === 0);
            const canMoveRight = idx => !((idx + 1) % this.gridSize === 0);
            const canMoveUp = idx => idx > this.gridSize;
            const canMoveDown = idx => idx < this.numOfPieces - this.gridSize;
            
            if (canMoveLeft(idx) && this.riddle[idx - 1] == hiddenPiece){
                newX -= 100;
                this.swap(idx, idx-1);
            }
            if (canMoveRight(idx) && this.riddle[idx + 1] == hiddenPiece){
                newX += 100;
                this.swap(idx, idx+1);
            }
            if (canMoveUp(idx) && this.riddle[idx - this.gridSize] == hiddenPiece){
                newY -= 100;
                this.swap(idx, idx-this.gridSize);
            }
            if (canMoveDown(idx) && this.riddle[idx + this.gridSize] == hiddenPiece){
                newY += 100;
                this.swap(idx, idx+this.gridSize);
            }
        }
    }


    start() {
        this.preset();
    }

}

const game = new Game('./meo.jpg');
game.start();
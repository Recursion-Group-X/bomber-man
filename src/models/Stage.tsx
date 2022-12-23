import { Config } from "../bombermanConfig"

export class Stage {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _numOfBreakableBlocks: number;
    private readonly _notPutArea: number[][];
    private readonly _board: number[][];
    
    constructor(config: Config) {
        this._x = config.x;
        this._y = config.y;
        this._numOfBreakableBlocks = config.breakableBlocks;
        this._notPutArea = config.notPutArea;
        this._board = this.createInitialStage()
    }
  
    getBoard(): number[][] {
        return this._board;
    }
  
    createInitialStage(): number[][] {
        const board: number[][] = [];
        for(let i=0; i<this._y; i++){
            board[i] = [];
            for(let j=0; j<this._x; j++){
                (i % 2 === 1) && (j % 2 === 1) ? board[i][j] = 2 : board[i][j] = 0;
            }
        }
        return board;
    }
  
    setBreakableBlock(): void {
        let currNumOfBlocks = 0;
        while(currNumOfBlocks < this._numOfBreakableBlocks){
            const x = Math.floor(Math.random() * this._x);
            const y = Math.floor(Math.random() * this._y);
            if((this._board[x][y]) === 0 && !(this._notPutArea.some(position => position.includes(x,y)))){
            this._board[x][y] = 1;
            currNumOfBlocks += 1;
            }
        }
    }
    
  }

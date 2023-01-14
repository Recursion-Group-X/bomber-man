import { Bomb } from "./bomb";

interface StageMap {
  [value: string]: number;
}

export class Stage {
  board: number[][];
  bombs: Bomb[] = [];
  static numOfColumn: number = 17;
  static numOfRow: number = 17;
  static size: number = 510;
  static boxSize: number = Stage.size / Stage.numOfRow;
  static numOfBlocks: number = 30;
  static stageValues: StageMap = {
    ground: 0,
    stone: 1,
    wall: 2,
    bomb: 3,
    fireO: 11,
    fireH: 12,
    fireV: 13,
    bombUp: 21,
    fireUp: 22,
    speedUp: 23,
  };

  constructor() {
    this.board = this.createInitialStage();
  }

  getStage(): number[][] {
    return this.board;
  }

  createInitialStage(): number[][] {
    let stage: number[][] = [];
    for (let i = 0; i < Stage.numOfRow; i++) {
      stage[i] = [];
      for (let j = 0; j < Stage.numOfColumn; j++) {
        if (
          i === 0 ||
          i === Stage.numOfRow - 1 ||
          j === 0 ||
          j === Stage.numOfColumn - 1 ||
          (i % 2 == 0 && j % 2 == 0)
        ) {
          stage[i][j] = 2;
        } else {
          stage[i][j] = 0;
        }
      }
    }
    return this.setBreakableBlock(stage);
  }

  setBreakableBlock(stage: number[][]): number[][] {
    let currNumOfBlocks = 0;
    while (currNumOfBlocks < Stage.numOfBlocks) {
      const i = Math.floor(Math.random() * Stage.numOfRow);
      const j = Math.floor(Math.random() * Stage.numOfColumn);
      const aroundPlayer: boolean =
        (i <= 2 && j <= 2) ||
        (i <= 2 && j >= Stage.numOfColumn - 3) ||
        (i >= Stage.numOfRow - 3 && j <= 2) ||
        (i >= Stage.numOfRow - 3 && j >= Stage.numOfColumn - 3);
      if (stage[i][j] === 0 && !aroundPlayer) {
        stage[i][j] = 1;
        currNumOfBlocks += 1;
      }
    }
    return stage;
  }

  setBomb(bomb: Bomb): void {
    this.bombs.push(bomb);
    this.board[bomb.i][bomb.j] = Stage.stageValues.bomb;
  }

  explodeBomb(bomb: Bomb): void {
    if (this.bombs.filter((b) => b.id === bomb.id).length === 0) return;
    // this.bombs = this.bombs.filter((b) => b.id !== bomb.id);
    bomb.explode();
  }
}

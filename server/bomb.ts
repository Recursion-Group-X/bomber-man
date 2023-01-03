import { Player } from "./player";
import { Stage } from "./stage";

interface FireType {
  [type: string]: number;
}

export class Bomb {
  player: Player;
  power: number;
  i: number;
  j: number;
  stage: Stage;
  static fireTypes: FireType = { origin: 11, horizontail: 12, vertical: 13 };

  constructor(i: number, j: number, player: Player, stage: Stage) {
    this.i = i;
    this.j = j;
    this.power = player.bombPower;
    this.player = player;
    this.stage = stage;
  }

  explode(): void {
    const board = this.stage.getStage();
    board[this.i][this.j] = Stage.stageValues.fire;
    this.explodeDirection("up", board);
    this.explodeDirection("down", board);
    this.explodeDirection("left", board);
    this.explodeDirection("right", board);
    setTimeout(() => {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          const f = board[i][j];
          if (Stage.stageValues.fire <= f && f < Stage.stageValues.bombUp) {
            board[i][j] = Stage.stageValues.ground;
          }
        }
      }
    }, 1000);
  }

  explodeDirection(direction: string, board: number[][]): void {
    if (direction === "up" || direction === "down") {
      const sign = direction === "up" ? -1 : 1;
      for (let k: number = 1; k < this.power + 1; k++) {
        const firePosition = board[this.i + k * sign][this.j];
        if (firePosition === Stage.stageValues.wall) {
          break;
        } else if (firePosition === Stage.stageValues.stone) {
          board[this.i + k * sign][this.j] = Stage.stageValues.fire;
          this.randomItem(this.i + k * sign, this.j, board);
          break;
        } else if (firePosition === Stage.stageValues.bomb) {
          board[this.i + k * sign][this.j] = Stage.stageValues.fire;
          this.hitOtherBomb(this.i + k * sign, this.j);
        } else {
          board[this.i + k * sign][this.j] = Stage.stageValues.fire;
        }
      }
    } else {
      const sign = direction === "left" ? -1 : 1;
      for (let k: number = 1; k < this.power + 1; k++) {
        const firePosition = board[this.i][this.j + k * sign];
        if (firePosition === Stage.stageValues.wall) {
          break;
        } else if (firePosition === Stage.stageValues.stone) {
          board[this.i][this.j + k * sign] = Stage.stageValues.fire;
          this.randomItem(this.i, this.j + k * sign, board);
          break;
        } else if (firePosition === Stage.stageValues.bomb) {
          board[this.i][this.j + k * sign] = Stage.stageValues.fire;
          this.hitOtherBomb(this.i, this.j + k * sign);
        } else {
          board[this.i][this.j + k * sign] = Stage.stageValues.fire;
        }
      }
    }
  }

  randomItem(i: number, j: number, board: number[][]): void {
    let random = Math.random();
    if (random > 0.5) {
      random = Math.random();
      if (random > 0.6) {
        board[i][j] = Stage.stageValues.bombUp;
      } else if (random > 0.2) {
        board[i][j] = Stage.stageValues.fireUp;
      } else {
        board[i][j] = Stage.stageValues.speedUp;
      }
    }
  }

  hitOtherBomb(i: number, j: number): void {
    let index: number;
    for (let k: number; k < this.stage.bombs.length; k++) {
      const bomb = this.stage.bombs[k];
      if (bomb.i === i && bomb.j === j) {
        index = k;
        break;
      }
    }
    const targetBomb = this.stage.bombs.splice(index, 1)[0];
    targetBomb.explode();
  }
}

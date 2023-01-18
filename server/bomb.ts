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
  id: string;
  isExploding: boolean;
  static fireTypes: FireType = { origin: 11, horizontail: 12, vertical: 13 };

  constructor(i: number, j: number, player: Player, stage: Stage, id: string) {
    this.i = i;
    this.j = j;
    this.power = player.bombPower;
    this.player = player;
    this.stage = stage;
    this.id = id;
    this.isExploding = false;
  }

  explode(): void {
    const board = this.stage.getStage();
    board[this.i][this.j] = Stage.stageValues.fireO;
    this.isExploding = true;
    this.explodeDirection("up", board);
    this.explodeDirection("down", board);
    this.explodeDirection("left", board);
    this.explodeDirection("right", board);
    setTimeout(() => {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          const f = board[i][j];
          if (Stage.stageValues.fireO <= f && f < Stage.stageValues.bombUp) {
            board[i][j] = Stage.stageValues.ground;
          }
        }
      }
      this.stage.bombs = this.stage.bombs.filter((bomb) => bomb.id !== this.id);
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
          board[this.i + k * sign][this.j] = Stage.stageValues.fireV;
          this.randomItem(this.i + k * sign, this.j, board);
          break;
        } else if (firePosition === Stage.stageValues.bomb) {
          board[this.i + k * sign][this.j] = Stage.stageValues.fireV;
          this.hitOtherBomb(this.i + k * sign, this.j);
        } else {
          board[this.i + k * sign][this.j] = Stage.stageValues.fireV;
        }
      }
    } else {
      const sign = direction === "left" ? -1 : 1;
      for (let k: number = 1; k < this.power + 1; k++) {
        const firePosition = board[this.i][this.j + k * sign];
        if (firePosition === Stage.stageValues.wall) {
          break;
        } else if (firePosition === Stage.stageValues.stone) {
          board[this.i][this.j + k * sign] = Stage.stageValues.fireH;
          this.randomItem(this.i, this.j + k * sign, board);
          break;
        } else if (firePosition === Stage.stageValues.bomb) {
          board[this.i][this.j + k * sign] = Stage.stageValues.fireH;
          this.hitOtherBomb(this.i, this.j + k * sign);
        } else {
          board[this.i][this.j + k * sign] = Stage.stageValues.fireH;
        }
      }
    }
  }

  randomItem(i: number, j: number, board: number[][]): void {
    let random = Math.random();
    if (random > 0.5) {
      random = Math.random();
      if (random > 0.7) {
        board[i][j] = Stage.stageValues.bombUp;
      } else if (random > 0.4) {
        board[i][j] = Stage.stageValues.fireUp;
      } else if (random > 0.2) {
        board[i][j] = Stage.stageValues.speedUp;
      }
      // bombDown 1.5-2.0, fireDown 1.0-1.5, speedDown 0.0-1.0
    }
  }

  hitOtherBomb(i: number, j: number): void {
    const targetBomb: Bomb = this.stage.bombs.filter(
      (b: Bomb) => b.i === i && b.j === j
    )[0];
    const index: number = this.stage.bombs.indexOf(targetBomb);
    this.stage.bombs.splice(index, 1);
    targetBomb.explode();
  }
}

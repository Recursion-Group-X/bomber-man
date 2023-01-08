import { Bomb } from "./bomb";
import { Stage } from "./stage";

class Position {
  x: number;
  y: number;
}

class Index {
  i: number;
  j: number;
}

export class Player {
  playerId: number;
  name: string;
  x: number;
  y: number;
  size: number = 30;
  direction: string = "stay";
  speed: number = 5;
  numOfBombs: number = 1;
  bombPower: number = 1;
  isAlive: boolean = true;
  killedBy: number;
  socketId: string;

  constructor(name: string, id: number, socketId) {
    this.name = name;
    this.playerId = id;
    this.x = this.initializePosition(id).x;
    this.y = this.initializePosition(id).y;
    this.socketId = socketId;
  }

  initializePosition(id: number): Position {
    let pos: Position = new Position();
    if (id === 1) {
      pos.x = 1 * Stage.boxSize;
      pos.y = 1 * Stage.boxSize;
    } else if (id === 2) {
      pos.x = (Stage.numOfColumn - 2) * Stage.boxSize;
      pos.y = 1 * Stage.boxSize;
    } else if (id === 3) {
      pos.x = 1 * Stage.boxSize;
      pos.y = (Stage.numOfRow - 2) * Stage.boxSize;
    } else {
      pos.x = (Stage.numOfColumn - 2) * Stage.boxSize;
      pos.y = (Stage.numOfRow - 2) * Stage.boxSize;
    }
    return pos;
  }

  move(stage: Stage): void {
    const board = stage.getStage();
    if (this.canMove(board) && this.direction !== "stay") {
      this.moveOneStep();
    }
    if (this.hitExplosion(board)) {
      this.isAlive = false;
    }
    if (this.collideWithItem(board)) {
      this.getItem(board);
    }
  }

  // indexに応じて滑らかな動き
  moveOneStep(): void {
    const i: number = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    const j: number = Math.floor((this.x + this.size / 2) / Stage.boxSize);
    if (this.direction === "up") {
      this.x = j * Stage.boxSize;
      this.y -= this.speed;
    } else if (this.direction === "down") {
      this.x = j * Stage.boxSize;
      this.y += this.speed;
    } else if (this.direction === "left") {
      this.x -= this.speed;
      this.y = i * Stage.boxSize;
    } else if (this.direction === "right") {
      this.x += this.speed;
      this.y = i * Stage.boxSize;
    }
  }

  // stageを受け取って移動できるか確認
  canMove(board: number[][]): boolean {
    return !(this.collideWithObjects(board) || this.isOutOfBound());
  }

  // wall or stone or bomb (bound)
  collideWithObjects(board: number[][]): boolean {
    let boundX: number = this.x;
    let boundY: number = this.y;
    let i: number;
    let j: number;
    let stageValue: number;

    if (this.direction === "up") {
      boundY -= this.speed;
      i = Math.floor(boundY / Stage.boxSize);
      j = Math.floor((boundX + this.size / 2) / Stage.boxSize);
      stageValue = board[i][j];
    } else if (this.direction === "down") {
      boundY += this.speed + this.size;
      i = Math.floor(boundY / Stage.boxSize);
      j = Math.floor((boundX + this.size / 2) / Stage.boxSize);
      stageValue = board[i][j];
    } else if (this.direction === "left") {
      boundX -= this.speed;
      i = Math.floor((boundY + this.size / 2) / Stage.boxSize);
      j = Math.floor(boundX / Stage.boxSize);
      stageValue = board[i][j];
    } else if (this.direction === "right") {
      boundX += this.speed + this.size;
      i = Math.floor((boundY + this.size / 2) / Stage.boxSize);
      j = Math.floor(boundX / Stage.boxSize);
      stageValue = board[i][j];
    }
    return (
      stageValue === Stage.stageValues.stone ||
      stageValue === Stage.stageValues.wall ||
      (stageValue === Stage.stageValues.bomb && !this.isOnTheBomb(board))
    );
  }

  // bound
  isOutOfBound(): boolean {
    let boundX: number = this.x;
    let boundY: number = this.y;

    if (this.direction === "up") {
      boundY -= this.speed;
    } else if (this.direction === "down") {
      boundY += this.speed + this.size;
    } else if (this.direction === "left") {
      boundX -= this.speed;
    } else if (this.direction === "right") {
      boundX += this.speed + this.size;
    }

    return !(
      boundX >= 0 &&
      boundY >= 0 &&
      boundX <= Stage.size &&
      boundY <= Stage.size
    );
  }

  isOnTheBomb(board: number[][]): boolean {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    playerIndex.j = Math.floor((this.x + this.size / 2) / Stage.boxSize);

    const top = Math.floor(this.y / Stage.boxSize);
    const bottom = Math.floor((this.y + this.size) / Stage.boxSize);
    const left = Math.floor(this.x / Stage.boxSize);
    const right = Math.floor((this.x + this.size) / Stage.boxSize);

    const bomb = Stage.stageValues.bomb;
    return (
      board[top][playerIndex.j] === bomb ||
      board[bottom][playerIndex.j] === bomb ||
      board[playerIndex.i][left] === bomb ||
      board[playerIndex.i][right] === bomb
    );
  }

  hitExplosion(board: number[][]): boolean {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    playerIndex.j = Math.floor((this.x + this.size / 2) / Stage.boxSize);
    const stageValue = board[playerIndex.i][playerIndex.j];

    return (
      stageValue >= Stage.stageValues.fireO &&
      stageValue < Stage.stageValues.bombUp
    );
  }

  collideWithItem(board: number[][]): boolean {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    playerIndex.j = Math.floor((this.x + this.size / 2) / Stage.boxSize);
    const stageValue = board[playerIndex.i][playerIndex.j];
    return stageValue >= Stage.stageValues.bombUp;
  }

  getItem(board: number[][]): void {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    playerIndex.j = Math.floor((this.x + this.size / 2) / Stage.boxSize);
    const itemType = board[playerIndex.i][playerIndex.j];
    if (itemType === Stage.stageValues.bombUp) {
      this.numOfBombs++;
    } else if (itemType === Stage.stageValues.fireUp) {
      this.bombPower++;
    } else if (itemType === Stage.stageValues.speedUp) {
      this.speed += 2;
    }

    board[playerIndex.i][playerIndex.j] = Stage.stageValues.ground;
  }

  putBomb(stage: Stage): void {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor((this.y + this.size / 2) / Stage.boxSize);
    playerIndex.j = Math.floor((this.x + this.size / 2) / Stage.boxSize);

    const newBomb = new Bomb(playerIndex.i, playerIndex.j, this, stage);
    const bombCount = stage.bombs.filter((b: Bomb) => b.player === this).length;
    if (bombCount < this.numOfBombs) stage.setBomb(newBomb);
  }
}

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
  size: number = 32;
  direction: string = "stay";
  speed: number = 1;
  numOfBombs: number = 1;
  bombPower: number = 1;
  isAlive: boolean = true;

  constructor(name: string, id: number) {
    this.name = name;
    this.playerId = id;
    this.x = this.initializePosition(id).x;
    this.y = this.initializePosition(id).y;
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
    const nextIndex: Index = this.getNextIndex();
    if (this.canMove(board) && this.direction !== "stay") {
      this.moveOneStep(nextIndex);
    }
    if (this.hitExplosion(board)) {
      this.isAlive = false;
    }
    if (this.collideWithItem(board)) {
      this.getItem(board);
    }
  }

  // 移動後にplayerが位置するインデックスを返す
  getNextIndex(): Index {
    let posX: number = this.x;
    let posY: number = this.y;
    if (this.direction === "up") {
      posY -= this.speed;
    } else if (this.direction === "down") {
      posY += this.speed;
    } else if (this.direction === "left") {
      posX -= this.speed;
    } else if (this.direction === "right") {
      posX += this.speed;
    }
    const index: Index = new Index();
    // playerの中心のインデックスを取る
    index.i = Math.floor(Stage.size / (posY + this.size / 2));
    index.j = Math.floor(Stage.size / (posX + this.size / 2));
    return index;
  }

  // indexに応じて滑らかな動き
  moveOneStep(index: Index): void {
    const i: number = index.i;
    const j: number = index.j;
    if (this.direction === "up") {
      this.x = i * Stage.boxSize;
      this.y -= this.speed;
    } else if (this.direction === "down") {
      this.x = i * Stage.boxSize;
      this.y += this.speed;
    } else if (this.direction === "left") {
      this.x -= this.speed;
      this.y = j * Stage.boxSize;
    } else if (this.direction === "right") {
      this.x += this.speed;
      this.y = j * Stage.boxSize;
    }
  }

  // stageを受け取って移動できるか確認
  canMove(board: number[][]): boolean {
    return !(
      (this.collideWithObjects(board) && !this.isOnTheBomb(board)) ||
      this.isOutOfBound()
    );
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
      i = Math.floor(Stage.size / boundY);
      j = Math.floor(Stage.size / (boundX + this.size / 2));
      stageValue = board[i][j];
    } else if (this.direction === "down") {
      boundY += this.speed + this.size;
      i = Math.floor(Stage.size / boundY);
      j = Math.floor(Stage.size / (boundX + this.size / 2));
      stageValue = board[i][j];
    } else if (this.direction === "left") {
      boundX -= this.speed;
      i = Math.floor(Stage.size / (boundY + this.size));
      j = Math.floor(Stage.size / boundX);
      stageValue = board[i][j];
    } else if (this.direction === "right") {
      boundX += this.speed + this.size;
      i = Math.floor(Stage.size / (boundY + this.size));
      j = Math.floor(Stage.size / boundX);
      stageValue = board[i][j];
    }

    return (
      stageValue === Stage.stageValues.stone ||
      stageValue === Stage.stageValues.wall ||
      stageValue === Stage.stageValues.bomb
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
    playerIndex.i = Math.floor(Stage.size / (this.y + this.size / 2));
    playerIndex.j = Math.floor(Stage.size / (this.x + this.size / 2));

    const top = Math.floor(Stage.size / this.y);
    const bottom = Math.floor(Stage.size / (this.y + this.size));
    const left = Math.floor(Stage.size / this.x);
    const right = Math.floor(Stage.size / (this.x + this.size));

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
    playerIndex.i = Math.floor(Stage.size / (this.y + this.size / 2));
    playerIndex.j = Math.floor(Stage.size / (this.x + this.size / 2));
    const stageValue = board[playerIndex.i][playerIndex.j];
    return (
      stageValue >= Stage.stageValues.fire &&
      stageValue < Stage.stageValues.bombUp
    );
  }

  collideWithItem(board: number[][]): boolean {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor(Stage.size / (this.y + this.size / 2));
    playerIndex.j = Math.floor(Stage.size / (this.x + this.size / 2));
    const stageValue = board[playerIndex.i][playerIndex.j];
    return stageValue >= Stage.stageValues.bombUp;
  }

  getItem(board: number[][]): void {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor(Stage.size / (this.y + this.size / 2));
    playerIndex.j = Math.floor(Stage.size / (this.x + this.size / 2));
    const itemType = board[playerIndex.i][playerIndex.j];
    if (itemType === Stage.stageValues.bombUp) {
      this.numOfBombs++;
    } else if (itemType === Stage.stageValues.fireUp) {
      this.bombPower++;
    } else if (itemType === Stage.stageValues.speedUp) {
      this.speed++;
    }

    board[playerIndex.i][playerIndex.j] = Stage.stageValues.ground;
  }

  putBomb(stage: Stage): void {
    const playerIndex: Index = new Index();
    playerIndex.i = Math.floor(Stage.size / (this.y + this.size / 2));
    playerIndex.j = Math.floor(Stage.size / (this.x + this.size / 2));

    const newBomb = new Bomb(playerIndex.i, playerIndex.j, this, stage);
    stage.setBomb(newBomb);
  }
}

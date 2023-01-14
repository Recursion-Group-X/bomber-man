import { Config } from '../bombermanConfig'
import { v4 as uuidv4 } from 'uuid'
import enemyFrontImg from '../assets/enemy-front.png'
import enemyFrontWalk1Img from '../assets/enemy-front-walk1.png'
import enemyFrontWalk2Img from '../assets/enemy-front-walk2.png'
import enemyBackImg from '../assets/enemy-back.png'
import enemyBackWalk1Img from '../assets/enemy-back-walk1.png'
import enemyBackWalk2Img from '../assets/enemy-back-walk2.png'
import enemyLeftImg from '../assets/enemy-left.png'
import enemyLeftWalkImg from '../assets/enemy-left-walk.png'
import enemyRightImg from '../assets/enemy-right.png'
import enemyRightWalkImg from '../assets/enemy-right-walk.png'
import { Player } from './Player'

export class Enemies {
  id: string
  isAlive: boolean = true
  x: number = 0
  y: number = 0
  width: number = 32
  height: number = 32
  direction: string
  pastDirection: string = 'down'
  step: number = 1
  isFirst: boolean = true
  enemyImg: string
  maxBolcks: number
  canvasSize: number = 510
  numOfBox: number = 17
  boxSize: number = this.canvasSize / this.numOfBox
  stageMap = {
    grass: 0,
    stone: 1,
    wall: 2,
    bomb: 3,
    player: 10,
    fireH: 11,
    fireV: 12,
    fireO: 13,
    bombUp: 21,
    fireUp: 22,
    speedUp: 23,
  }

  constructor(config: Config, currentStage: number[][]) {
    this.maxBolcks = config.x
    this.id = uuidv4()
    if (this.isFirst) {
      this.inititalDefinePosition(currentStage)
    } else {
      this.definePosition(currentStage)
    }

    this.direction = this.changeRandomDirection()
    this.enemyImg = enemyFrontImg

    setInterval(() => {
      this.changeDirection(currentStage)
    }, 300)
  }

  inititalDefinePosition(currentStage: number[][]): void {
    const max: number = this.maxBolcks

    let randomNumY: number = Math.floor(Math.random() * (max - 5)) + 5
    let randomNumX: number = Math.floor(Math.random() * (max - 5)) + 5

    while (currentStage[randomNumY][randomNumX] !== 0) {
      randomNumX = Math.floor(Math.random() * (max - 5)) + 5
      randomNumY = Math.floor(Math.random() * (max - 5)) + 5
    }
    this.x = this.boxSize * randomNumX
    this.y = this.boxSize * randomNumY
    this.isFirst = false
  }

  definePosition(currentStage: number[][]): void {
    const max: number = this.maxBolcks

    let randomNumY: number = Math.floor(Math.random() * (max - 1)) + 1
    let randomNumX: number = Math.floor(Math.random() * (max - 1)) + 1

    while (currentStage[randomNumY][randomNumX] !== 0) {
      randomNumX = Math.floor(Math.random() * (max - 1)) + 1
      randomNumY = Math.floor(Math.random() * (max - 1)) + 1
    }
    this.x = this.boxSize * randomNumX
    this.y = this.boxSize * randomNumY
  }

  drawEnemy(canvas: CanvasRenderingContext2D | null | undefined): void {
    const img = document.createElement('img')
    img.src = this.changeEnemyImg()
    canvas?.drawImage(img, this.x, this.y, this.width, this.height)
  }

  moveEnemy(canvas: CanvasRenderingContext2D | null | undefined, currentStage: number[][], player: Player): void {
    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2
    const i: number = this.getIndex(centerY)
    const j: number = this.getIndex(centerX)

    if (this.direction === 'up') {
      this.checkEnemyMove(i, j, this.getIndex(centerY + this.step * -1), j, -1, 'vertical', currentStage, player)
    } else if (this.direction === 'down') {
      this.checkEnemyMove(i, j, this.getIndex(centerY + this.step * 1), j, 1, 'vertical', currentStage, player)
    } else if (this.direction === 'left') {
      this.checkEnemyMove(i, j, i, this.getIndex(centerX + this.step * -1), -1, 'horizontal', currentStage, player)
    } else if (this.direction === 'right') {
      this.checkEnemyMove(i, j, i, this.getIndex(centerX + this.step * 1), 1, 'horizontal', currentStage, player)
    }
  }

  changeDirection(currentStage: number[][]): void {
    const directions: string[] = this.checkDirections(currentStage)
    const randomDirection: string = directions[Math.floor(Math.random() * directions.length)]
    this.direction = randomDirection
  }

  checkDirections(currentStage: number[][]): string[] {
    const i: number = this.getIndex(this.y + this.width / 2)
    const j: number = this.getIndex(this.x + this.height / 2)
    const up: number = currentStage[i - 1][j]
    const down: number = currentStage[i + 1][j]
    const left: number = currentStage[i][j - 1]
    const right: number = currentStage[i][j + 1]

    let directions: string[] = []
    if (up !== this.stageMap.stone && up !== this.stageMap.wall && up !== this.stageMap.bomb) {
      directions.push('up')
    }
    if (down !== this.stageMap.stone && down !== this.stageMap.wall && down !== this.stageMap.bomb) {
      directions.push('down')
    }
    if (left !== this.stageMap.stone && left !== this.stageMap.wall && left !== this.stageMap.bomb) {
      directions.push('left')
    }
    if (right !== this.stageMap.stone && right !== this.stageMap.wall && right !== this.stageMap.bomb) {
      directions.push('right')
    }
    // きた方向以外も動けるとき
    if (directions.length > 1) {
      const opposite = this.getOppositeDirection()
      directions = directions.filter((direction) => direction !== opposite)
    }
    return directions
  }

  getOppositeDirection(): string {
    let opposite: string = ''
    if (this.direction === 'up') {
      opposite = 'down'
    } else if (this.direction === 'down') {
      opposite = 'up'
    } else if (this.direction === 'left') {
      opposite = 'right'
    } else if (this.direction === 'right') {
      opposite = 'left'
    }
    return opposite
  }

  getBound(moveTo: string, direction: number): number {
    let bound: number = 0
    if (moveTo === 'horizontal') {
      bound = this.x + this.step * direction
      if (direction >= 0) bound += this.width
    } else {
      bound = this.y + this.step * direction
      if (direction >= 0) bound += this.height
    }
    return bound
  }

  moveOneStep(i: number, j: number, moveTo: string, direction: number): void {
    if (moveTo === 'horizontal') {
      this.y = i * this.boxSize
      this.x += this.step * direction
    } else {
      this.x = j * this.boxSize
      this.y += this.step * direction
    }
  }

  getIndex(position: number): number {
    return Math.floor(position / this.boxSize)
  }

  changeRandomDirection(): string {
    const Directon: string[] = ['up', 'down', 'left', 'right']
    const randomNum: number = Math.floor(Math.random() * (4 - 0)) + 0

    this.pastDirection = this.direction
    return Directon[randomNum]
  }

  changeEnemyImg(): string {
    let src: string = enemyFrontImg
    if (this.direction === '') {
      if (this.pastDirection === 'up') src = enemyBackImg
      if (this.pastDirection === 'down') src = enemyFrontImg
      else if (this.pastDirection === 'left') src = enemyLeftImg
      else if (this.pastDirection === 'right') src = enemyRightImg
    } else {
      if (this.direction === 'down') {
        src = this.enemyImg === enemyFrontWalk1Img ? enemyFrontWalk2Img : enemyFrontWalk1Img
      } else if (this.direction === 'up') {
        src = this.enemyImg === enemyBackWalk1Img ? enemyBackWalk2Img : enemyBackWalk1Img
      } else if (this.direction === 'left') {
        src = this.enemyImg === enemyLeftImg ? enemyLeftWalkImg : enemyLeftImg
      } else if (this.direction === 'right') {
        src = this.enemyImg === enemyRightImg ? enemyRightWalkImg : enemyRightImg
      }
    }
    this.enemyImg = src
    return src
  }

  checkEnemyMove(
    i: number,
    j: number,
    nextI: number,
    nextJ: number,
    direction: number,
    moveTo: string,
    currentStage: number[][],
    player: Player
  ): void {
    const bound = this.getBound(moveTo, direction)

    // エネミーと爆弾が当たった時の処理
    if (this.hitExplosion(i, j, nextI, nextJ, bound, moveTo, currentStage)) {
      this.isAlive = false
    }
    this.enemyImg = src
    return src
  }

    // エネミーとプレイヤーが当たった時の処理
    if (this.hitPlayer(i, j, nextI, nextJ, bound, moveTo, currentStage)) {
      player.isAlive = false
    }

    if (!this.canMove(i, j, nextI, nextJ, bound, moveTo, currentStage)) return
    else if (nextI !== i || nextJ !== j) {
      // this.changeDirection(currentStage)
      // currentStageのplayerの位置を更新
      // if(currentStage[nextI][nextJ] >= this.stageMap.bombUp){
      //     this.getItem(currentStage[nextI][nextJ])
      // }
      // currentStage[i][j] = this.stageMap.grass
      // currentStage[nextI][nextJ] = this.stageMap.player
    }
    this.moveOneStep(i, j, moveTo, direction)
  }

  hitExplosion(
    i: number,
    j: number,
    nextI: number,
    nextJ: number,
    bound: number,
    moveTo: string,
    currentStage: number[][]
  ): boolean {
    if (
      currentStage[nextI][nextJ] >= this.stageMap.bombUp ||
      currentStage[i][this.getIndex(bound)] >= this.stageMap.bombUp
    ) {
      return false
    }
    if (moveTo === 'horizontal') {
      if (
        currentStage[nextI][nextJ] >= this.stageMap.bombUp ||
        currentStage[i][this.getIndex(bound)] >= this.stageMap.bombUp
      ) {
        return false
      } else {
        return (
          currentStage[nextI][nextJ] > this.stageMap.player ||
          currentStage[i][this.getIndex(bound)] > this.stageMap.player
        )
      }
    } else {
      if (
        currentStage[nextI][nextJ] >= this.stageMap.bombUp ||
        currentStage[this.getIndex(bound)][j] >= this.stageMap.bombUp
      ) {
        return false
      } else {
        return (
          currentStage[nextI][nextJ] > this.stageMap.player ||
          currentStage[this.getIndex(bound)][j] > this.stageMap.player
        )
      }
    }
  }

  hitPlayer(
    i: number,
    j: number,
    nextI: number,
    nextJ: number,
    bound: number,
    moveTo: string,
    currentStage: number[][]
  ): boolean {
    return currentStage[nextI][nextJ] === this.stageMap.player
  }

  canMove(
    i: number,
    j: number,
    nextI: number,
    nextJ: number,
    bound: number,
    moveTo: string,
    currentStage: number[][]
  ): boolean {
    if (moveTo === 'horizontal') {
      // itemのとき
      if (currentStage[i][this.getIndex(bound)] >= this.stageMap.bombUp) {
        return true
      }
      return (
        (currentStage[nextI][nextJ] % 10 === 0 && currentStage[i][this.getIndex(bound)] % 10 === 0) ||
        currentStage[nextI][nextJ] >= this.stageMap.bombUp
      )
    } else {
      if (currentStage[this.getIndex(bound)][j] >= this.stageMap.bombUp) {
        return true
      }
      return (
        (currentStage[nextI][nextJ] % 10 === 0 && currentStage[this.getIndex(bound)][j] % 10 === 0) ||
        currentStage[nextI][nextJ] >= this.stageMap.bombUp
      )
    }
  }
}

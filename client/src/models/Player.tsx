import playerFrontImg from '../assets/player-front.png'
import playerFrontWalk1Img from '../assets/player-front-walk1.png'
import playerFrontWalk2Img from '../assets/player-front-walk2.png'
import playerBackImg from '../assets/player-back.png'
import playerBackWalk1Img from '../assets/player-back-walk1.png'
import playerBackWalk2Img from '../assets/player-back-walk2.png'
import playerLeftImg from '../assets/player-left.png'
import playerLeftWalkImg from '../assets/player-left-walk.png'
import playerRightImg from '../assets/player-right.png'
import playerRightWalkImg from '../assets/player-right-walk.png'
import bombImg from '../assets/bomb.png'

export class Player {
  name: string
  x: number
  y: number
  width: number
  height: number
  direction: string
  pastDirection: string
  playerImg: string
  step: number = 1
  items: Object[] = []
  bombs: number[][] = []
  numOfBombs: number = 2
  bombPower: number = 1
  isAlive: boolean = true
  static SPEED_UP_ITEM: number = 0.5
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

  canvasSize: number = 510
  numOfBox: number = 17
  boxSize: number = this.canvasSize / this.numOfBox
  constructor(name: string) {
    this.name = name
    this.x = this.boxSize
    this.y = this.boxSize
    this.width = 32
    this.height = 32
    this.direction = ''
    this.pastDirection = 'down'
    this.playerImg = playerFrontImg
  }

  getName(): string {
    return this.name
  }

  draw(canvas: CanvasRenderingContext2D | null | undefined): void {
    this.clear(canvas)
    const img = document.createElement('img')
    img.src = this.changePlayerImg()
    canvas?.drawImage(img, this.x, this.y, this.width, this.height)
  }

  drawBombs(canvas: CanvasRenderingContext2D | null | undefined): void {
    for (let i = 0; i < this.bombs.length; i++) {
      const bomb: number[] = this.bombs[i]
      const img = document.createElement('img')
      img.src = bombImg
      canvas?.drawImage(img, bomb[1] * this.boxSize, bomb[0] * this.boxSize, this.width, this.height)
    }
  }

  clear(canvas: CanvasRenderingContext2D | null | undefined): void {
    canvas?.clearRect(0, 0, this.canvasSize, this.canvasSize)
  }

  stopPlayer(e: any): void {
    const key: string = e.key
    if (
      (this.direction === 'right' && key === 'ArrowRight') ||
      (this.direction === 'left' && key === 'ArrowLeft') ||
      (this.direction === 'up' && key === 'ArrowUp') ||
      (this.direction === 'down' && key === 'ArrowDown')
    ) {
      this.pastDirection = this.direction
      this.direction = ''
    }
  }

  changeDirection(e: any): void {
    if (e.key === 'ArrowRight') {
      this.direction = 'right'
    } else if (e.key === 'ArrowUp') {
      this.direction = 'up'
    } else if (e.key === 'ArrowLeft') {
      this.direction = 'left'
    } else if (e.key === 'ArrowDown') {
      this.direction = 'down'
    }
  }

  move(canvas: CanvasRenderingContext2D | null | undefined, currentStage: number[][]): void {
    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2
    const i: number = this.getIndex(centerY)
    const j: number = this.getIndex(centerX)
    // 爆発のなかで止まっているとき、死亡
    if (currentStage[i][j] > this.stageMap.player && currentStage[i][j] < this.stageMap.bombUp) {
      this.isAlive = false
      return
    }

    if (this.direction === 'up') {
      this.checkPlayerMove(i, j, this.getIndex(centerY + this.step * -1), j, -1, 'vertical', currentStage)
    } else if (this.direction === 'down') {
      this.checkPlayerMove(i, j, this.getIndex(centerY + this.step * 1), j, 1, 'vertical', currentStage)
    } else if (this.direction === 'left') {
      this.checkPlayerMove(i, j, i, this.getIndex(centerX + this.step * -1), -1, 'horizontal', currentStage)
    } else if (this.direction === 'right') {
      this.checkPlayerMove(i, j, i, this.getIndex(centerX + this.step * 1), 1, 'horizontal', currentStage)
    }
    this.draw(canvas)
  }

  getIndex(position: number): number {
    return Math.floor(position / this.boxSize)
  }

  checkPlayerMove(
    i: number,
    j: number,
    nextI: number,
    nextJ: number,
    direction: number,
    moveTo: string,
    currentStage: number[][]
  ): void {
    if (this.isOnTheBomb(i, j, direction, moveTo, currentStage)) {
      this.moveOneStep(i, j, moveTo, direction)
      return
    }
    const bound = this.getBound(moveTo, direction)
    if (this.hitExplosion(i, j, nextI, nextJ, bound, moveTo, currentStage)) {
      this.isAlive = false
    } else if (!this.canMove(i, j, nextI, nextJ, bound, moveTo, currentStage) || this.isOutOfStage(bound)) return
    else if (nextI !== i || nextJ !== j) {
      // currentStageのplayerの位置を更新
      if (currentStage[nextI][nextJ] >= this.stageMap.bombUp) {
        this.getItem(currentStage[nextI][nextJ])
      }
      currentStage[i][j] = this.stageMap.grass
      currentStage[nextI][nextJ] = this.stageMap.player
    }
    this.moveOneStep(i, j, moveTo, direction)
  }

  putBomb(e: any, currentStage: number[][]): void {
    if (e.key === ' ') {
      const i: number = this.getIndex(this.y + this.height / 2)
      const j: number = this.getIndex(this.x + this.width / 2)
      if (this.bombs.length < this.numOfBombs) {
        this.bombs.push([i, j])
        setTimeout(() => {
          this.bombs.splice(0, 1)
          currentStage[i][j] = this.stageMap.grass
          this.explodeBomb(i, j, currentStage)
        }, 3000)
        currentStage[i][j] = this.stageMap.bomb
      }
    }
  }

  explodeBomb(i: number, j: number, currentStage: number[][]): void {
    currentStage[i][j] = this.stageMap.fireO
    // 4方向の爆発を判定
    this.explodeDirection(i, j, 1, 0, 1, currentStage, this.stageMap.fireV)
    this.explodeDirection(i, j, 1, 0, -1, currentStage, this.stageMap.fireV)
    this.explodeDirection(i, j, 0, 1, 1, currentStage, this.stageMap.fireH)
    this.explodeDirection(i, j, 0, 1, -1, currentStage, this.stageMap.fireH)
    setTimeout(() => {
      this.removeFire(currentStage)
    }, 1000)
  }

  explodeDirection(
    i: number,
    j: number,
    izero: number,
    jzero: number,
    direction: number,
    currentStage: number[][],
    imgNum: number
  ): void {
    for (let k: number = 1; k < this.bombPower + 1; k++) {
      const pos = currentStage[i + k * direction * izero][j + k * direction * jzero]
      if (pos === this.stageMap.wall) {
        break
      } else if (pos === this.stageMap.stone) {
        this.breakStone(i + k * direction * izero, j + k * direction * jzero, imgNum, currentStage)
        break
      } else if (pos === this.stageMap.grass || pos === this.stageMap.player || pos >= this.stageMap.bombUp) {
        currentStage[i + k * direction * izero][j + k * direction * jzero] = imgNum
      }
    }
  }

  removeFire(currentStage: number[][]): void {
    for (let i = 0; i < currentStage.length; i++) {
      for (let j = 0; j < currentStage[i].length; j++) {
        const f = currentStage[i][j]
        // fire 11 ~
        if (f > this.stageMap.player && f < 21) {
          currentStage[i][j] = this.stageMap.grass
        }
      }
    }
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

  isOnTheBomb(i: number, j: number, direction: number, moveTo: string, currentStage: number[][]): boolean {
    if (moveTo === 'horizontal') {
      return currentStage[i][j] === this.stageMap.bomb && currentStage[i][j + direction] === 0
    } else {
      return currentStage[i][j] === this.stageMap.bomb && currentStage[i + direction][j] === 0
    }
  }

  isOutOfStage(bound: number): boolean {
    return this.getIndex(bound) < 0 || this.getIndex(bound) > this.numOfBox - 1
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
      if (currentStage[i][this.getIndex(bound)] >= this.stageMap.bombUp) {
        return true
      }
      return currentStage[nextI][nextJ] % 10 === 0 && currentStage[i][this.getIndex(bound)] % 10 === 0
    } else {
      if (currentStage[this.getIndex(bound)][j] >= this.stageMap.bombUp) {
        return true
      }
      return currentStage[nextI][nextJ] % 10 === 0 && currentStage[this.getIndex(bound)][j] % 10 === 0
    }
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

  changePlayerImg(): string {
    let src: string = playerFrontImg
    if (this.direction === '') {
      if (this.pastDirection === 'up') src = playerBackImg
      if (this.pastDirection === 'down') src = playerFrontImg
      else if (this.pastDirection === 'left') src = playerLeftImg
      else if (this.pastDirection === 'right') src = playerRightImg
    } else {
      if (this.direction === 'down') {
        src = this.playerImg === playerFrontWalk1Img ? playerFrontWalk2Img : playerFrontWalk1Img
      } else if (this.direction === 'up') {
        src = this.playerImg === playerBackWalk1Img ? playerBackWalk2Img : playerBackWalk1Img
      } else if (this.direction === 'left') {
        src = this.playerImg === playerLeftImg ? playerLeftWalkImg : playerLeftImg
      } else if (this.direction === 'right') {
        src = this.playerImg === playerRightImg ? playerRightWalkImg : playerRightImg
      }
    }
    this.playerImg = src
    return src
  }

  getItem(itemType: number): void {
    if (itemType === this.stageMap.bombUp) {
      this.numOfBombs++
      this.items.push(this.stageMap.bombUp)
    } else if (itemType === this.stageMap.fireUp) {
      this.bombPower++
      this.items.push(this.stageMap.fireUp)
    } else if (itemType === this.stageMap.speedUp) {
      this.step += Player.SPEED_UP_ITEM
      this.items.push(this.stageMap.speedUp)
    }
  }

  breakStone(i: number, j: number, fireNum: number, currentStage: number[][]): void {
    let random = Math.random()
    if (random < 0.6) {
      currentStage[i][j] = fireNum
    } else {
      random = Math.random()
      if (random > 0.5) {
        currentStage[i][j] = this.stageMap.bombUp
      } else if (random > 0.1) {
        currentStage[i][j] = this.stageMap.fireUp
      } else {
        currentStage[i][j] = this.stageMap.speedUp
      }
    }
  }
}

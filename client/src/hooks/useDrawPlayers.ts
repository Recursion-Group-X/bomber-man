import playerFrontImg from '../assets/player-front.png'

interface Player {
  playerId: number
  name: string
  x: number
  y: number
  size: number
  direction: string
  speed: number
  numOfBombs: number
  bombPower: number
  isAlive: boolean
}

const useDrawPlayers = (players: Player[], context: CanvasRenderingContext2D, canvasSize: number): void => {
  context.clearRect(0, 0, canvasSize, canvasSize)
  const img = document.createElement('img')
  img.src = playerFrontImg
  for (let i: number = 0; i < players.length; i++) {
    const player = players[i]
    context.drawImage(img, player.x, player.y, player.size, player.size)
  }
}

export default useDrawPlayers

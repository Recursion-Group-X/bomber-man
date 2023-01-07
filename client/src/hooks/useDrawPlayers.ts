import playerFrontImg from '../assets/player-front.png'
import { OnlinePlayer } from '../bombermanConfig'

const useDrawPlayers = (players: OnlinePlayer[], context: CanvasRenderingContext2D, canvasSize: number): void => {
  context.clearRect(0, 0, canvasSize, canvasSize)
  const img = document.createElement('img')
  img.src = playerFrontImg
  for (let i: number = 0; i < players.length; i++) {
    const player = players[i]
    if (player.isAlive) context.drawImage(img, player.x, player.y, player.size, player.size)
  }
}

export default useDrawPlayers

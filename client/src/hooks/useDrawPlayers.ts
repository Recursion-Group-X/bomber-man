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
import { OnlinePlayer } from '../bombermanConfig'
import { useAtom } from 'jotai'
import { socketAtom } from '../atom/Atom'

const useDrawPlayers = (): [
  (players: OnlinePlayer[], context: CanvasRenderingContext2D, canvasSize: number) => Promise<void>
] => {
  const [socket] = useAtom(socketAtom)

  const changePlayerImg = async (player: OnlinePlayer): Promise<string> => {
    let src: string = playerFrontImg
    if (player.direction === 'stay') {
      if (player.pastDirection === 'up') src = playerBackImg
      if (player.pastDirection === 'down') src = playerFrontImg
      else if (player.pastDirection === 'left') src = playerLeftImg
      else if (player.pastDirection === 'right') src = playerRightImg
    } else {
      const random = Math.random()
      if (player.direction === 'down') {
        src = player.imageType === 1 ? playerFrontWalk2Img : playerFrontWalk1Img
      } else if (player.direction === 'up') {
        src = player.imageType === 1 ? playerBackWalk2Img : playerBackWalk1Img
      } else if (player.direction === 'left') {
        src = player.imageType === 1 ? playerLeftWalkImg : playerLeftImg
      } else if (player.direction === 'right') {
        src = player.imageType === 1 ? playerRightWalkImg : playerRightImg
      }
    }

    return await new Promise((resolve) => {
      resolve(src)
    })
  }

  const changeTextColor = (player: OnlinePlayer, context: CanvasRenderingContext2D): void => {
    if (player.socketId === socket.id) context.fillStyle = 'red'
    else context.fillStyle = 'white'
  }

  const drawPlayersOnCanvas = async (
    players: OnlinePlayer[],
    context: CanvasRenderingContext2D,
    canvasSize: number
  ): Promise<void> => {
    context.clearRect(0, 0, canvasSize, canvasSize)
    context.font = '10px serif'
    context.textAlign = 'center'
    context.fillStyle = 'white'
    const img = document.createElement('img')
    for (let i: number = 0; i < players.length; i++) {
      const player = players[i]
      await changePlayerImg(player).then((src) => {
        img.src = src
      })
      changeTextColor(player, context)
      if (player.isAlive) {
        context.drawImage(img, player.x, player.y, player.size, player.size)
        context.fillText(player.name, player.x + player.size / 2, player.y)
      }
    }
  }

  return [drawPlayersOnCanvas]
}

export default useDrawPlayers

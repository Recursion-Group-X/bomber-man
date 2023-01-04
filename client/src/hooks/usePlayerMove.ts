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

const usePlayerMove = (): [Function, Function] => {
  const stopPlayer = (e: any, player: Player): void => {
    const key: string = e.key
    if (
      (player.direction === 'right' && key === 'ArrowRight') ||
      (player.direction === 'left' && key === 'ArrowLeft') ||
      (player.direction === 'up' && key === 'ArrowUp') ||
      (player.direction === 'down' && key === 'ArrowDown')
    ) {
      player.direction = 'stay'
    }
  }

  const changeDirection = (e: any, player: Player): void => {
    if (e.key === 'ArrowRight') {
      player.direction = 'right'
    } else if (e.key === 'ArrowUp') {
      player.direction = 'up'
    } else if (e.key === 'ArrowLeft') {
      player.direction = 'left'
    } else if (e.key === 'ArrowDown') {
      player.direction = 'down'
    }
  }

  return [stopPlayer, changeDirection]
}

export default usePlayerMove

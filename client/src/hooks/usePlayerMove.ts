import { useAtom } from 'jotai'
import { playersLastDirection } from '../atom/Atom'

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
  const [lastDirection, setLastDirection] = useAtom(playersLastDirection)
  const stopPlayer = (e: any, player: Player): void => {
    const key: string = e.key
    if (
      (lastDirection === 'right' && key === 'ArrowRight') ||
      (lastDirection === 'left' && key === 'ArrowLeft') ||
      (lastDirection === 'up' && key === 'ArrowUp') ||
      (lastDirection === 'down' && key === 'ArrowDown')
    ) {
      setLastDirection('stay')
    }
  }

  const changeDirection = (e: any, player: Player): void => {
    let direction: string = lastDirection
    if (e.key === 'ArrowRight') {
      direction = 'right'
    } else if (e.key === 'ArrowUp') {
      direction = 'up'
    } else if (e.key === 'ArrowLeft') {
      direction = 'left'
    } else if (e.key === 'ArrowDown') {
      direction = 'down'
    }
    setLastDirection(direction)
  }

  return [stopPlayer, changeDirection]
}

export default usePlayerMove

import { useAtom } from 'jotai'
import { playersLastDirection } from '../atom/Atom'
import { OnlinePlayer } from '../bombermanConfig'

const usePlayerMove = (): [Function, Function] => {
  const [lastDirection, setLastDirection] = useAtom(playersLastDirection)
  const stopPlayer = (e: any, player: OnlinePlayer): void => {
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

  const changeDirection = (e: any, player: OnlinePlayer): void => {
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

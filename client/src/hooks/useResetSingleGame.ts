import { useSetAtom } from 'jotai'
import { playerAtom, currentStageAtom, enemiesAtom } from '../atom/Atom'
import { config1 } from '../bombermanConfig'
import { Enemies } from '../models/Enemies'
import { Player } from '../models/Player'
import { Stage } from '../models/Stage'

const useResetSingleGame = (): [() => void] => {
  const setPlayer = useSetAtom(playerAtom)
  const setCurrentStage = useSetAtom(currentStageAtom)
  const setEnemies = useSetAtom(enemiesAtom)

  const resetAll = (): void => {
    // resetPlayer
    const username = localStorage.getItem('username')
    const newPlayer: Player = new Player(username != null ? username : 'GUESTUSER')
    setPlayer(newPlayer)

    // resetStage
    const newStage: Stage = new Stage(config1)
    newStage.setBreakableBlock()
    setCurrentStage(newStage.getBoard())

    // resetEnemies
    const enemies: Enemies[] = []
    enemies.push(new Enemies(config1, newStage.getBoard(), true, newPlayer.x, newPlayer.y))
    enemies.push(new Enemies(config1, newStage.getBoard(), true, newPlayer.x, newPlayer.y))
    enemies.push(new Enemies(config1, newStage.getBoard(), true, newPlayer.x, newPlayer.y))
    setEnemies(enemies)
  }

  return [resetAll]
}

export default useResetSingleGame

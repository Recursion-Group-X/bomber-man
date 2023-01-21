import { useAtom } from 'jotai'
import { enemiesAtom, playerAtom, currentStageAtom } from "../atom/Atom"
import { Enemies } from '../models/Enemies'
import { config1 } from '../bombermanConfig'

const useAddEnemies = (): [(num:number) => void] => {
    const [enemies, setEnemies] = useAtom(enemiesAtom)
    const [player] = useAtom(playerAtom)
    const [currentStage] = useAtom(currentStageAtom)

    const putNewEnemies = (num: number): void => {
        const newEnemies: Enemies[] = []
        for(let i: number = 0; i < num; i++){
            enemies.push(new Enemies(config1, currentStage, false, player.x, player.y))
        }
        setEnemies(enemies.concat(newEnemies))
        // setEnemies([...enemies, newEnemies])
    }

    
    // enemies.init.push(
    //     new Enemies(config1, currentStage.getBoard(),false ,player.x, player.y),
    //     new Enemies(config1, currentStage.getBoard(),false ,player.x, player.y)
    // )
    return [putNewEnemies]
}

export default useAddEnemies
import { atom, PrimitiveAtom } from 'jotai'
import { config1 } from '../bombermanConfig'
import { Player } from '../models/Player'
import { Stage } from '../models/Stage'

export const canvasRefAtom: any = atom(null)
const currentStage = new Stage(config1)
currentStage.setBreakableBlock()
export const currentStageAtom: PrimitiveAtom<number[][]> = atom(currentStage.getBoard())

export const playerAtom = atom<Player>(new Player('player1'))

// online game
export const socketAtom = atom<any>(null)
export const roomNameAtom: PrimitiveAtom<string> = atom('')
export const playersLastDirection: PrimitiveAtom<string> = atom('stay')

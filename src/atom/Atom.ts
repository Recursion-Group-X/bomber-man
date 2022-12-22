import { atom, PrimitiveAtom } from "jotai"
import { Player } from "../models/Player"


export const canvasRefAtom: any = atom(null)
export const currentStageAtom: PrimitiveAtom<number[][]> = atom(
    [
        [0,0,1,0,0,1,1,0,1,0,0,0,0,0,0],
        [0,2,1,2,0,2,0,2,0,2,0,2,0,2,0],
        [0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
        [1,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
        [0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
        [1,2,0,2,0,2,0,2,0,2,1,2,1,2,0],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,2,0,2,0,2,0,2,0,2,0,2,1,2,0],
        [0,1,1,0,1,0,1,0,0,0,0,0,1,0,0],
        [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
        [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,2,0,2,0,2,1,2,0,2,0,2,0,2,0],
        [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
        [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ]
)

export const playerAtom = atom<Player>(new Player('player1'))
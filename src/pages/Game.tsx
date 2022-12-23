import { useAtom } from 'jotai'
import useInterval from 'use-interval';
import React, { useEffect, useRef, useState } from 'react'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'
import { currentStageAtom, playerAtom } from '../atom/Atom'

const Game: React.FC = () => {
  const [currentStage, setCurrentStage] = useAtom(currentStageAtom)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  const [player] = useAtom(playerAtom)
  const [gameTime, setGameTime] = useState<number>(0)
 
  useEffect(() => {
    if(gameCanvasRef != null){
      const a = gameCanvasRef.current?.getContext('2d')
      setCavnasContext(a)
      player.draw(canvasContext)
    }
    addKeyEvents()
    return () => removeKeyEvents()
    
    
  },[canvasContext])

  useInterval(() => {
    setGameTime(gameTime + 0.05)
    player?.move(canvasContext, currentStage)
    player?.drawBombs(canvasContext)
  }, 50)

  const addKeyEvents = (): void => { 
    addEventListener('keydown', playerAction)
    addEventListener('keyup', stopPlayer)
  }

  const removeKeyEvents = (): void => {
    removeEventListener('keydown', playerAction)
    removeEventListener('keyup', stopPlayer)
  }


  // Playerの移動方向を変える
  const playerAction = (e: any): void => {
    player?.changeDirection(e)
    player?.putBomb(e, currentStage)
  }

  // プレイヤーの移動を止める
  const stopPlayer = (e: any): void => {
    player?.stopPlayer(e)
  }

  return (
    <div className='h-screen bg-black text-xl'>
      <div className='h-20 bg-slate-600 flex items-center'>
        <div className='w-1/3'>
          <p className='ml-10 text-xl text-white'>00:00</p>
        </div>
        <div className='w-1/3 mx-auto flex justify-around'>
          <div>Item1: </div>
          <div>Item2:</div>
          <div>Item3:</div>
        </div>
      </div>

      <div className=' mx-auto bg-white mt-12 flex' style={{height: '510px', width: '510px'}}>
        <table className='h-full w-full'>
          {currentStage.map(row => 
            <tr className={`h-1/${currentStage.length} w-full`} key={row[0]}>
              {row.map(box => 
                <>
                {box === 1 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${stoneImg})`}}></td>:
                 box === 2 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${wallImg})`}}></td>:
                              <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${grassImg})`}}></td>
                }
                </>
              )}
            </tr>
          )}
        </table>
        <canvas width="500px" height="500px" className='z-10 absolute' ref={gameCanvasRef}></canvas>
      </div>
    </div>
  )
}

export default Game
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'
import { currentStageAtom, playerAtom } from '../atom/Atom'

const Game: React.FC = () => {
  const [currentStage] = useAtom(currentStageAtom)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  const [player] = useAtom(playerAtom)
 
  useEffect(() => {
    if(gameCanvasRef != null){
      const a = gameCanvasRef.current?.getContext('2d')
      setCavnasContext(a)
      player.draw(canvasContext)
    }
    
    removeEventListener('keydown', changePlayerDirection)
    removeEventListener('keyup', stopPlayer)
    addEventListener('keydown', changePlayerDirection)
    addEventListener('keyup', stopPlayer)

    // 0.05秒ごとに状態を更新する // このインターバルでエネミーも移動させる
    const intervalId = setInterval(() => {
      // インターバルで方向に基づいて移動する
      player?.move(canvasContext, currentStage)
    }, 50);
    return () => {
      clearInterval(intervalId);
    };
  },[canvasContext])


  // Playerの移動方向を変える
  const changePlayerDirection = (e: any): void => {
    player?.changeDirection(e)
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

      <div className=' mx-auto bg-white mt-12 flex' style={{height: '500px', width: '500px'}}>
        <table className='h-full w-full'>
          {currentStage.map(row => 
            <tr className={`h-1/${currentStage.length} w-full`} key={row[0]}>
              {row.map(box => 
                <>
                {box === 0 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${grassImg})`}}></td>:
                 box === 1 ? <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${stoneImg})`}}></td>:
                             <td className={`w-1/${row.length}`} key={box} style={{backgroundImage:`url(${wallImg})`}}></td>
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
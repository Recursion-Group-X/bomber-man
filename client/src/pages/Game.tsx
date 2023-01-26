import { useAtom } from 'jotai'
import useInterval from 'use-interval'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'
import horizontalFireImg from '../assets/fire-h.png'
import verticalFireImg from '../assets/fire-v.png'
import fireOriginImg from '../assets/fire-o.png'
import bombUpImg from '../assets/bomb-up.png'
import fireUpImg from '../assets/fire-up.png'
import speedUpImg from '../assets/speed-up.png'
import { currentStageAtom, playerAtom, enemiesAtom, playerNameAtom } from '../atom/Atom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'
import { config1 } from '../bombermanConfig'
// import { useAddEnemies } from '../hooks/useAddEnemies'
import useAddEnemies from '../hooks/useAddEnemies'
import { v4 as uuidv4 } from 'uuid'

let interval: number | null = 10
const Game: React.FC = () => {
  const [currentStage] = useAtom(currentStageAtom)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  // Todo 状態を統一したい
  const [player] = useAtom(playerAtom)
  const [playerName] = useAtom(playerNameAtom)
  player.name = playerName

  const [gameTime, setGameTime] = useState<number>(0)
  const navigate = useNavigate()
  let [enemies] = useAtom(enemiesAtom)
  const gameRecordGateway = new GameRecordGateWay()
  const [putNewEnemies] = useAddEnemies()
  const currId = uuidv4()

  useEffect(() => {
    if (gameCanvasRef != null) {
      const a = gameCanvasRef.current?.getContext('2d')
      setCavnasContext(a)
      player.draw(canvasContext)
    }
    addKeyEvents()
    return () => removeKeyEvents()
  }, [canvasContext])

  useInterval(() => {
    setGameTime(gameTime + 0.01)
    player?.move(canvasContext, currentStage)
    player?.drawBombs(canvasContext)
    enemies = enemies.filter((enemy) => enemy.isAlive)
    for (let i: number = 0; i < enemies.length; i++) {
      enemies[i].moveEnemy(canvasContext, currentStage, player)
      enemies[i].drawEnemy(canvasContext)
    }
    if (!player.isAlive) {
      interval = null
      gameRecordGateway.postGameRecord(getCurrntRecord()).catch(() => alert('ERORR'))
      showResult().catch(() => alert('kkkk'))
    }
  }, interval)

  useInterval(() => {
    putNewEnemies(2)
    // addEnemy();
  }, 8000)

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

  const showResult = async (): Promise<void> => {
    setTimeout(async () => {
      navigate('/result', {
        state: {
          id: currId,
          name: player.name,
          score: gameTime,
        },
      })
    }, 1000)
  }

  const getCurrntRecord = (): GameRecord => {
    return {
      id: currId,
      name: player.name,
      score: gameTime,
      date: new Date(),
    }
  }

  return (
    <div className="h-screen bg-black text-xl">
      <div className="h-20 bg-slate-600 flex items-center">
        <div className="w-1/3">
          <p className="ml-10 text-xl text-white">00:00</p>
        </div>
        <div className="w-1/3 mx-auto flex justify-around">
          <div>Item1: </div>
          <div>Item2:</div>
          <div>Item3:</div>
        </div>
      </div>

      <div className=" mx-auto bg-white mt-12 flex" style={{ height: '510px', width: '510px' }}>
        <table className="h-full w-full">
          {currentStage.map((row, i) => (
            <tr className={`h-1/${currentStage.length} w-full`} key={i * config1.x}>
              {row.map((box, j) => (
                <>
                  {
                    // grass:0, player:10,  bomb:3
                    box === 0 || box === 10 || box === 3 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${grassImg})` }}
                      ></td>
                    ) : box === 1 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${stoneImg})` }}
                      ></td>
                    ) : box === 2 ? (
                      <td className={`w-1/${row.length}`} key={box} style={{ backgroundImage: `url(${wallImg})` }}></td>
                    ) : box === 11 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${horizontalFireImg})` }}
                      ></td>
                    ) : box === 12 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${verticalFireImg})` }}
                      ></td>
                    ) : box === 13 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${fireOriginImg})` }}
                      ></td>
                    ) : box === 21 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${bombUpImg})` }}
                      ></td>
                    ) : box === 22 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${fireUpImg})` }}
                      ></td>
                    ) : box === 23 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${speedUpImg})` }}
                      ></td>
                    ) : null
                  }
                </>
              ))}
            </tr>
          ))}
        </table>
        <canvas width="500px" height="500px" className="z-10 absolute" ref={gameCanvasRef}></canvas>
      </div>
    </div>
  )
}

export default Game

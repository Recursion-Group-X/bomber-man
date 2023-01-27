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
import { Player } from '../models/Player'
import useAddEnemies from '../hooks/useAddEnemies'
import { v4 as uuidv4 } from 'uuid'
import useResetSingleGame from '../hooks/useResetSingleGame'

let interval: number | null = 10
const Game: React.FC = () => {
  const [currentStage] = useAtom(currentStageAtom)
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  // Todo 状態を統一したい
  const [player] = useAtom(playerAtom)
  const [playerName] = useAtom(playerNameAtom)
  player.name = playerName
  const [gameTime, setGameTime] = useState<number>(-3)
  const navigate = useNavigate()
  let [enemies] = useAtom(enemiesAtom)
  const gameRecordGateway = new GameRecordGateWay()
  const [putNewEnemies] = useAddEnemies()
  const currId = uuidv4()
  const [count, setCount] = useState<any>(3)
  const [resetAll] = useResetSingleGame()

  useEffect(() => {
    interval = 10
    if (gameCanvasRef != null) {
      const a = gameCanvasRef.current?.getContext('2d')
      setCavnasContext(a)
      player.draw(canvasContext)
    }
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

  useInterval(
    () => {
      setCount(count - 1)
      removeKeyEvents()
      if (count === 1) {
        setCount('GAME START')
        setTimeout(() => {
          document.querySelectorAll('.overlay')[0].classList.remove('overlay')
          setCount('')
          addKeyEvents()
        }, 1000)
      }
    },
    count > 0 ? 1000 : null
  )

  useInterval(() => {
    if (gameTime >= 100) {
      putNewEnemies(4)
    } else if (gameTime >= 60) {
      putNewEnemies(3)
    } else {
      putNewEnemies(2)
    }
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
      resetAll()
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
    <div className="h-screen bg-black text-xl overlay">
      <div className="h-20 bg-slate-600 flex items-center">
        <div className="w-1/3">
          <p className="ml-10 text-xl text-white">PlayerName:{player.name}</p>
        </div>
        <div className="w-1/3 mx-auto flex justify-around">
          <div className="flex items-center">
            <img src={bombUpImg} alt="bombUp" height="40px" width="40px" />
            <p className="text-2xl text-white ml-2">×{player.numOfBombs - 2}</p>
          </div>
          <div className="flex items-center">
            <img src={fireUpImg} alt="bombUp" height="40px" width="40px" />
            <p className="text-2xl text-white ml-2">×{player.bombPower - 1}</p>
          </div>
          <div className="flex items-center">
            <img src={speedUpImg} alt="bombUp" height="40px" width="40px" />
            <p className="text-2xl text-white ml-2">×{(player.step - 1) / Player.SPEED_UP_ITEM}</p>
          </div>
          {/* <div className="w-1/3 items-center">
            <p className="ml-10 text-xl text-white mt-2">{player.name}</p>
          </div> */}
        </div>
        <div className="w-1/6">
          {gameTime > 0 ? (
            <p className="ml-10 text-xl text-white">
              {'0' +
                Math.floor(gameTime / 60)
                  .toString()
                  .slice(-2)}
              :{('00' + (Math.floor(gameTime) % 60).toString()).slice(-2)}
            </p>
          ) : (
            <p className="ml-10 text-xl text-white">00:00</p>
          )}
        </div>
      </div>
      <div className="text-white">
        <div className="text">{count}</div>
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

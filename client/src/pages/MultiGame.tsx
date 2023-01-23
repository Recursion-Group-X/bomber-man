import { useAtom } from 'jotai'
import React, { useState, useEffect, useRef } from 'react'
import useInterval from 'use-interval'
import { useLocation, useNavigate } from 'react-router-dom'
import { playersLastDirection, roomNameAtom, socketAtom } from '../atom/Atom'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'
import bombImg from '../assets/grass-bomb.png'
import horizontalFireImg from '../assets/fire-h.png'
import verticalFireImg from '../assets/fire-v.png'
import fireOriginImg from '../assets/fire-o.png'
import bombUpImg from '../assets/bomb-up.png'
import fireUpImg from '../assets/fire-up.png'
import speedUpImg from '../assets/speed-up.png'
import useDrawPlayers from '../hooks/useDrawPlayers'
import usePlayerMove from '../hooks/usePlayerMove'
import { DeadPlayer, OnlinePlayer, config1 } from '../bombermanConfig'

const STAGESIZE: number = 510
const INTERVAL_SPAN = 30
let interval: number | null = INTERVAL_SPAN

let gameStartFlag = false
const MultiGame: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const location = useLocation()
  const navigate = useNavigate()
  const [players, setPlayers] = useState<OnlinePlayer[]>([])
  const [myPlayer, setMyPlayer] = useState<OnlinePlayer | null>(null)
  const [lastDirection, setLastDirection] = useAtom(playersLastDirection)
  const [stage, setStage] = useState<number[][]>([])
  const [roomName] = useAtom(roomNameAtom)
  const onlineCanvas = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  const [stopPlayer, changeDirection] = usePlayerMove()
  const [drawPlayersOnCanvas] = useDrawPlayers()

  const [count, setCount] = useState<any>(3)

  const drawPlayers = async (plys: OnlinePlayer[]): Promise<void> => {
    if (canvasContext != null) {
      await drawPlayersOnCanvas(plys, canvasContext, STAGESIZE)
    }
    return await new Promise((resolve) => resolve())
  }

  const addKeyEvents = (): void => {
    addEventListener('keydown', handleKeyDown)
    addEventListener('keyup', handleKeyUp)
  }

  const removeKeyEvents = (): void => {
    removeEventListener('keydown', handleKeyDown)
    removeEventListener('keyup', handleKeyUp)
  }

  const handleKeyUp = (e: any): void => {
    if (myPlayer != null) stopPlayer(e, myPlayer)
  }

  const handleKeyDown = (e: any): void => {
    if (myPlayer != null) {
      changeDirection(e, myPlayer)
      if (e.key === ' ') putBomb()
    }
  }

  const putBomb = (): void => {
    socket?.emit('player_bomb', {
      player: myPlayer,
      roomName,
    })
  }

  useInterval(async () => {
    if (players != null && players.length > 0) {
      await drawPlayers(players)
      if (myPlayer != null) {
        setMyPlayer({ ...myPlayer, direction: lastDirection })
        socket?.emit('player_interval', {
          player: { ...myPlayer, direction: lastDirection },
          roomName,
        })
      }
    }
  }, interval)

  useEffect(() => {
    interval = INTERVAL_SPAN
    setStage(location.state.stage)
    setPlayers(location.state.players)
    setMyPlayer(location.state.players.filter((player: OnlinePlayer) => player.playerId === location.state.id)[0])
    if (onlineCanvas != null) {
      const context = onlineCanvas.current
      setCavnasContext(context?.getContext('2d'))
    }
  }, [onlineCanvas, canvasContext])

  useInterval(
    () => {
      setCount(count - 1)
      if (count === 1) {
        setCount('GAME START')
        setTimeout(() => {
          document.querySelectorAll('.overlay')[0].classList.remove('overlay')
          setCount('')
          gameStartFlag = true
        }, 1000)
      }
    },
    count > 0 ? 1000 : null
  )

  useEffect(() => {
    socket?.on('send_game_status', (data: { players: OnlinePlayer[]; stage: number[][] }) => {
      setPlayers(data.players)
      setMyPlayer(data.players.filter((player) => player.socketId === socket.id)[0])
      setStage(data.stage)
    })
    socket?.on('send_game_result', (data: DeadPlayer[]) => {
      interval = null
      setLastDirection('stay')
      navigate('/online-result', { state: { data } })
    })
    if (gameStartFlag) {
      addKeyEvents()
      return () => {
        removeKeyEvents()
        socket.off('send_game_status')
        socket.off('send_game_result')
      }
    }
  }, [socket, players])

  return (
    <div className="h-screen bg-black text-xl overlay">
      <div className="h-20 bg-slate-600 flex items-center">
        <div className="w-1/3">
          <p className="ml-10 text-xl text-white">00:00</p>
          <p>{myPlayer?.name}</p>
        </div>
        <div className="w-1/3 mx-auto flex justify-around">
          <div>Item1: </div>
          <div>Item2:</div>
          <div>Item3:</div>
        </div>
      </div>

      <div className="text-white">
        <div className="text">{count}</div>
      </div>
      <div className=" mx-auto bg-white mt-12 flex" style={{ height: '510px', width: '510px' }}>
        <table className="h-full w-full">
          {stage.map((row, i) => (
            <tr className={`h-1/${stage.length} w-full`} key={i * config1.x}>
              {row.map((box, j) => (
                <>
                  {
                    // grass:0, player:10,  bomb:3
                    box === 0 ? (
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
                    ) : box === 3 ? (
                      <td className={`w-1/${row.length}`} key={box} style={{ backgroundImage: `url(${bombImg})` }}></td>
                    ) : box === 11 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${fireOriginImg})` }}
                      ></td>
                    ) : box === 12 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${horizontalFireImg})` }}
                      ></td>
                    ) : box === 13 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={i * config1.x + j}
                        style={{ backgroundImage: `url(${verticalFireImg})` }}
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
        <canvas width="500px" height="500px" className="z-10 absolute" ref={onlineCanvas}></canvas>
      </div>
    </div>
  )
}

export default MultiGame

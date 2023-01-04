import { useAtom } from 'jotai'
import React, { useState, useEffect, useRef } from 'react'
import useInterval from 'use-interval'
import { useLocation } from 'react-router-dom'
import { roomNameAtom, socketAtom } from '../atom/Atom'
import grassImg from '../assets/grass.png'
import stoneImg from '../assets/stone.png'
import wallImg from '../assets/wall.png'
import horizontalFireImg from '../assets/fire-h.png'
import verticalFireImg from '../assets/fire-v.png'
import fireOriginImg from '../assets/fire-o.png'
import bombUpImg from '../assets/bomb-up.png'
import fireUpImg from '../assets/fire-up.png'
import speedUpImg from '../assets/speed-up.png'
import useDrawPlayers from '../hooks/useDrawPlayers'
import usePlayerMove from '../hooks/usePlayerMove'

interface Player {
  playerId: number
  name: string
  x: number
  y: number
  size: number
  direction: string
  speed: number
  numOfBombs: number
  bombPower: number
  isAlive: boolean
}

const stageSize: number = 510
const MultiGame: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const location = useLocation()
  const [players, setPlayers] = useState<Player[]>([])
  const [myPlayer, setMyPlayer] = useState<Player | null>(null)
  const [stage, setStage] = useState<number[][]>([])
  const [roomName] = useAtom(roomNameAtom)
  const onlineCanvas = useRef<HTMLCanvasElement>(null)
  const [canvasContext, setCavnasContext] = useState<CanvasRenderingContext2D | null | undefined>(null)
  const [stopPlayer, changeDirection] = usePlayerMove()

  const drawPlayers = (plys: Player[]): void => {
    if (canvasContext != null) {
      useDrawPlayers(plys, canvasContext, stageSize)
    }
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
    }
  }

  useInterval(() => {
    if (players != null) {
      socket?.emit('player_interval', {
        player: players[location.state.id - 1],
        roomName: roomName,
      })
    }
  }, 10)

  useEffect(() => {
    socket?.on('send_game_status', (data: { players: Player[]; stage: number[][] }) => {
      setPlayers(data.players)
      setMyPlayer(data.players[location.state.id - 1])
      setStage(data.stage)
      drawPlayers(data.players)
    })
    setStage(location.state.stage)
    setPlayers(location.state.players)
    setMyPlayer(location.state.players[location.state.id - 1])
    if (onlineCanvas != null) {
      const context = onlineCanvas.current
      setCavnasContext(context?.getContext('2d'))
    }
    addKeyEvents()
    return () => {
      removeKeyEvents()
      socket.off('send_game_status')
    }
  }, [socket, players])

  return (
    <div className="h-screen bg-black text-xl">
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

      <div className=" mx-auto bg-white mt-12 flex" style={{ height: '510px', width: '510px' }}>
        <table className="h-full w-full">
          {stage.map((row) => (
            <tr className={`h-1/${stage.length} w-full`} key={row[0]}>
              {row.map((box) => (
                <>
                  {
                    // grass:0, player:10,  bomb:3
                    box === 0 || box === 10 || box === 3 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${grassImg})` }}
                      ></td>
                    ) : box === 1 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${stoneImg})` }}
                      ></td>
                    ) : box === 2 ? (
                      <td className={`w-1/${row.length}`} key={box} style={{ backgroundImage: `url(${wallImg})` }}></td>
                    ) : box === 11 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${horizontalFireImg})` }}
                      ></td>
                    ) : box === 12 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${verticalFireImg})` }}
                      ></td>
                    ) : box === 13 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${fireOriginImg})` }}
                      ></td>
                    ) : box === 21 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${bombUpImg})` }}
                      ></td>
                    ) : box === 22 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
                        style={{ backgroundImage: `url(${fireUpImg})` }}
                      ></td>
                    ) : box === 23 ? (
                      <td
                        className={`w-1/${row.length}`}
                        key={box}
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

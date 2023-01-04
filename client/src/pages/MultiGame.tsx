import { useAtom } from 'jotai'
import React, { useState, useEffect } from 'react'
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

const MultiGame: React.FC = () => {
  const [socket] = useAtom(socketAtom)
  const location = useLocation()
  const [players, setPlayers] = useState<Player[]>([])
  const [myPlayer, setMyPlayer] = useState<Player | null>(null)
  const [stage, setStage] = useState<number[][]>([])
  const [roomName] = useAtom(roomNameAtom)

  const drawPlayers = (): void => {
    console.log('draw')
  }

  useInterval(() => {
    socket?.emit('player_interval', {
      playerId: myPlayer?.playerId,
      roomName: roomName,
    })
    drawPlayers()
  }, 10)

  useEffect(() => {
    socket?.on('send_game_status', (data: { players: Player[]; stage: number[][] }) => {
      setPlayers(data.players)
      setStage(data.stage)
    })
    setStage(location.state.stage)
    setPlayers(location.state.players)
    setMyPlayer(location.state.players[location.state.id - 1])
    console.log(location.state.id)
  }, [socket])

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
        <canvas width="500px" height="500px" className="z-10 absolute"></canvas>
      </div>
    </div>
  )
}

export default MultiGame

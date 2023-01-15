import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { socketAtom, playerNameAtom } from '../atom/Atom'

const Home: React.FC = () => {
  const [playerName, setPlayerName] = useAtom(playerNameAtom)
  const navigate = useNavigate()
  const [socket] = useAtom(socketAtom)

  const startSoloGame = (): void => {
    navigate('/game')
  }
  const moveLobby = (playStyle: string): void => {
    navigate('/lobby', {
      state: {
        playStyle: 'multi',
      },
    })
    socket?.emit('enter_lobby')
  }

  return (
    <div className="h-screen flex flex-col">
      <div>
        <p className="text-center text-6xl pt-20">Bomb Game</p>
      </div>

      <div className="flex justify-around">
        <div className="flex flex-col items-center mt-20">
          <label htmlFor="player_name" className="block mb-2 text-sm font-medium">
            Your Name
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white"
            id="player_name"
            value={playerName}
            required
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <div className="my-10">
            <button
              className="px-2 py-1  bg-blue-400 text-lg text-white font-semibold rounded-full hover:bg-blue-500"
              onClick={startSoloGame}
            >
              SOLO PLAY
            </button>
          </div>
          <div className="m-3">
            <button
              className="px-2 py-1  bg-green-400 text-lg text-white font-semibold rounded-full hover:bg-green-500"
              onClick={() => moveLobby('multi')}
            >
              MULTI PLAY
            </button>
          </div>
        </div>

        <div className="border-4 p-4 mt-20">
          <p className="text-3xl">How TO PLAY</p>
          <div className="flex flex-col space-y-10">
            <div>
              <p>
                Blow up all your enemes.
                <br />
                Get items and power up!!!
              </p>
            </div>
            <div>
              <p>MOVEMENT: ⬆ ⬇︎ ➡︎ ⬅︎</p>
            </div>
            <div>
              <p>
                BOMB: <span className="border-2 p-2">SPACE</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

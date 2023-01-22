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
    <div className="h-screen flex flex-col bg-black">
      <div>
        <p className="text-center text-6xl pt-20 text-white" >B<span style={{'color':'orange'}}>o</span>mb Game</p>
      </div>

      <div className="flex justify-around">
        <div className="flex flex-col items-center mt-20">
          <label htmlFor="player_name" className="block mb-2 text-sm font-medium text-white">
            Your Name
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:text-white nes-input is-dark"
            id="player_name"
            value={playerName}
            required
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <div className="my-10">
            <button
              className="px-2 py-1  bg-blue-400 text-lg text-white font-semibold hover:bg-blue-500 nes-btn is-primary"
              onClick={startSoloGame}
            >
              SOLO PLAY
            </button>
          </div>
          <div className="m-3">
            <button
              className="px-2 py-1  bg-green-400 text-lg text-white font-semibold hover:bg-green-500  nes-btn is-success"
              onClick={() => moveLobby('multi')}
            >
              MULTI PLAY
            </button>
          </div>
        </div>

        <div className="p-4 mt-20 ">

        
        <div className="nes-container is-dark is-centered with-title">
          <p className="title text-white text-5xl ">How To Play</p>
          <div className="flex flex-col space-y-10">
            <div>
              <p className="text-white">
                Blow up all your enemies.
                <br />
                Get items and power up!!!
              </p>
            </div>
            <div>
              <p className="text-white">MOVEMENT: ↑
              <span className='transform rotate-90' style={{ writingMode: 'vertical-rl' }}>↑</span> 
              <span className='transform rotate-180' style={{ writingMode: 'vertical-rl' }}>↑</span>
              <span className='transform rotate-180' style={{ writingMode: 'vertical-rl' }}>↓</span> 
              </p>
            </div>
            <div>
              <p className="text-white">
                BOMB: <span className="border-2 p-2">SPACE</span>
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Home


import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Result: React.FC = () => {
  const navigate = useNavigate()
  const [players, setPlayers] = useState<string[]>(['player1', 'player2', 'player3', 'player4'])

  const navigateHome = (): void => {
    navigate('/')
  }

  const restartGame = (): void => {
    navigate('/game')
  }

  return (
    <div className='h-screen text-xl'>
      <div className='h-20 bg-slate-600 flex items-center justify-center'>
        <p className='text-center text-2xl text-white'>RESULT</p>
      </div>
      <div className='flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6'>
        <div className='w-1/3'>
          {players.map(player => 
            <div key={player}>
              <p className='text-center my-4 text-2xl'>{player}</p>
            </div>
          )}
        </div>
        <div className='w-2/3'>
          {players.map((player, i) => 
            <div key={player}>
              <p className='text-center my-4 text-2xl'>{i+1}. Time: {player}</p>
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-end w-2/3 mx-auto'>
        <button className='m-4 border border-2 p-2' onClick={restartGame}>Restart</button>
        <button className='m-4 border border-2 p-2' onClick={navigateHome}>Home</button>
      </div>
    </div>
  )
}

export default Result
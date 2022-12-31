import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Lobby: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  return (
    <div className='h-screen'>
      <div className="h-20 bg-slate-600 flex items-center justify-center text-white text-4xl">Lobby</div>
      
      <div className="flex justify-around mt-10">
        <div className="border-4 p-4">
          <p className="text-3xl">New Game</p>
        </div>
        
      </div>
    </div>
  )
}

export default Lobby
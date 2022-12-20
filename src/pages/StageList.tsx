import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const StageList: React.FC = () => {
  const navigate = useNavigate()
  const [stages, setStages] = useState<string[]>(['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6'])
  const navigateHome = (): void => {
    navigate('/')
  }


  return (
    <div className='h-screen text-xl'>
      <div className='h-20 bg-slate-600 flex items-center justify-center'>
        <p className='text-center text-2xl text-white'>STAGE SELECt</p>
      </div>
      <div className='w-2/3 mx-auto flex flex-wrap'>
        {stages.map( stage =>
          <div key={stage}>
            <div className='h-40 w-48 bg-black mx-10 mt-8' />
            <p className='text-center'>{ stage }</p>
          </div>
        )}
      </div>
      <div className='absolute right-36'>
          <button className='p-2 w-20 border border-4' onClick={navigateHome}>OK</button>
      </div>
    </div>
  )
}

export default StageList
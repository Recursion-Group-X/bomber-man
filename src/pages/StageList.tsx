import React, { useState } from 'react'

const StageList: React.FC = () => {
  const [stages, setStages] = useState<string[]>(['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6'])
  return (
    <div className='h-screen text-xl'>
      <div className='h-20 bg-slate-600 flex items-center justify-center'>
        <p className='text-center text-lg text-white'>STAGE SELECt</p>
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
          <button className='p-2 w-20 border border-4'>OK</button>
      </div>
    </div>
  )
}

export default StageList
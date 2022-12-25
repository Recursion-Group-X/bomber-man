import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway';
import { GameRecord } from '../dataaccess/recordType';

const Result: React.FC = () => {
  const navigate = useNavigate()
  const [recordList, setrecordList] = useState<GameRecord[]>()
  const gameRecordGateway = new GameRecordGateWay();
  
  useEffect(() => {
    (async() => {
      return setrecordList(await gameRecordGateway.getGameRecord())
    })().catch(() => alert("ERORR"));
  }, [])

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
          {recordList?.map((record: GameRecord) => 
            <div key={record.alivedTime}>
              <p className='text-center my-4 text-2xl'>{record.name}</p>
            </div>
          )}
        </div>
        <div className='w-2/3'>
          {recordList?.map((record: GameRecord) => 
            <div key={record.alivedTime}>
              <p className='text-center my-4 text-2xl'>Time: {record.alivedTime}</p>
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
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'

const Result: React.FC = () => {
  const navigate = useNavigate()
  const { name, score, alivedTime }: { name: string; score: number; alivedTime: number } = useLocation().state
  const [recordList, setrecordList] = useState<GameRecord[]>()
  const gameRecordGateway = new GameRecordGateWay()

  useEffect(() => {
    ;(async () => {
      return setrecordList(await gameRecordGateway.getLatestTopFiveGameRecord())
    })().catch(() => alert('ERORR'))
  }, [])

  const navigateHome = (): void => {
    navigate('/')
  }

  const restartGame = (): void => {
    navigate('/game')
  }

  return (
    <div className="h-screen text-xl">
      <div className="h-20 bg-slate-600 flex items-center justify-center">
        <p className="text-center text-2xl text-white">RESULT</p>
      </div>
      <div className="flex h-1/2 w-1/2 mx-auto mt-10 bg-slate-600 pt-6">
        <div className="w-1/3">
          {recordList?.map((record: GameRecord) => (
            <div key={record.id}>
              <p className="text-center my-4 text-2xl">{record.name}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          {recordList?.map((record: GameRecord) => (
            <div key={record.id}>
              <p className="text-center my-4 text-2xl">Score: {record.score}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          {recordList?.map((record: GameRecord) => (
            <div key={record.id}>
              <p className="text-center my-4 text-2xl">Time: {record.alivedTime}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p>{name} Result</p>
        <p>score: {score}</p>
        <p>alivedTime: {alivedTime}</p>
      </div>
      <div className="text-center">
        <a href={`https://twitter.com/intent/tweet?text=my score: ${score} https://bomb-game.netlify.app/`}>Tweet</a>
      </div>
      <div className="flex justify-end w-2/3 mx-auto">
        <button className="m-4 border border-2 p-2" onClick={restartGame}>
          Restart
        </button>
        <button className="m-4 border border-2 p-2" onClick={navigateHome}>
          Home
        </button>
      </div>
    </div>
  )
}

export default Result

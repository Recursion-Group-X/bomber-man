import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'

const Ranking: React.FC = () => {
  const [records, setRecords] = useState<GameRecord[]>()
  const navigate = useNavigate()
  const gameRecordGateway = new GameRecordGateWay()

  useEffect(() => {
    ;(async () => {
      return setRecords(await gameRecordGateway.getLatestGameTopFiftyRecord())
    })().catch(() => alert('ERORR'))
  }, [])

  const navigateHome = (): void => {
    navigate('/')
  }

  const convertTimeToScore = (time: number): string => {
    const min: string =
      Math.floor((time % 3600) / 60) <= 9
        ? `0${Math.floor((time % 3600) / 60)}`
        : Math.floor((time % 3600) / 60).toString()
    const sec = time % 60 <= 10 ? `0${(time % 60).toFixed()}` : (time % 60).toFixed()
    const msec = (time % 60).toFixed(2).split('.')[1]
    return `${min}:${sec}.${msec}`
  }

  return (
    <div className="bg-black">
      <div className="h-20 flex items-center justify-center">
        <p className="text-center text-4xl text-white mt-10">RANKING</p>
      </div>
      <button className="ml-40 nes-btn is-error p-2 text-white" onClick={navigateHome}>
        Back
      </button>
      <div className="flex h-1/2 w-1/2 mx-auto mt-5 pt-6 text-white">
        <div className="w-1/3">
          <p>Rank</p>
          {records?.map((record: GameRecord, index) => (
            <div key={record.id}>
              <p className="text-start my-4 text-2xl">{index + 1}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          <p>name</p>
          {records?.map((record: GameRecord, index) => (
            <div key={record.id}>
              <p className="text-start my-4 text-2xl">{record.name}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          <p>score</p>
          {records?.map((record: GameRecord) => (
            <div key={record.id}>
              <p className="text-start my-4 text-2xl">
                {convertTimeToScore(record.score).slice(0, 6)}
                <span className="text-lg">{convertTimeToScore(record.score).slice(-2)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ranking

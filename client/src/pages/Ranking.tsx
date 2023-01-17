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

  return (
    <div>
      <div className="h-20 bg-slate-600 flex items-center justify-center">
        <p className="text-center text-2xl text-white">RANKING</p>
      </div>
      <div className="flex h-1/2 w-1/2 mx-auto mt-10 pt-6">
        <div className="w-1/3">
          {records?.map((record: GameRecord, index) => (
            <div key={record.id}>
              <p className="text-start my-4 text-2xl">{index + 1}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          {records?.map((record: GameRecord, index) => (
            <div key={record.id}>
              <p className="text-start my-4 text-2xl">{record.name}</p>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          {records?.map((record: GameRecord) => (
            <div key={record.id}>
              <p className="text-center my-4 text-2xl">
                Score: {record.score.slice(0, 6)}
                <span className="text-lg">{record.score.slice(-2)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <button className="m-4 border border-2 p-2" onClick={navigateHome}>
        Back
      </button>
    </div>
  )
}

export default Ranking

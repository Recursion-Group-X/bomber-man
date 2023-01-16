import React, { useEffect, useState } from 'react'
import { GameRecordGateWay } from '../dataaccess/gameRecordGateway'
import { GameRecord } from '../dataaccess/recordType'

const Ranking: React.FC = () => {
  const [records, setRecords] = useState<GameRecord[]>()
  const gameRecordGateway = new GameRecordGateWay()

  useEffect(() => {
    ;(async () => {
      return setRecords(await gameRecordGateway.getLatestGameTopFiftyRecord())
    })().catch(() => alert('ERORR'))
  }, [])

  console.log(records)

  return (
    <div className="flex h-1/2 w-1/2 mx-auto mt-10 pt-6">
      <div className="w-1/3">
        {records?.map((record: GameRecord) => (
          <div key={record.id}>
            <p className="text-center my-4 text-2xl">{record.name}</p>
          </div>
        ))}
      </div>
      <div className="w-2/3">
        {records?.map((record: GameRecord) => (
          <div key={record.id}>
            <p className="text-center my-4 text-2xl">Score: {record.score}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ranking

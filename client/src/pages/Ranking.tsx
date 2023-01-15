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
    <div>
      <p>ranking</p>
    </div>
  )
}

export default Ranking

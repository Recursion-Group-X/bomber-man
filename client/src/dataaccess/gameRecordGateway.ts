import db from '../firebase'
import { addDoc, collection, getDocs, limit, query, orderBy, getCountFromServer } from 'firebase/firestore'
import { GameRecord, recordConverter } from './recordType'

export class GameRecordGateWay {
  async postGameRecord(record: GameRecord): Promise<void> {
    addDoc(collection(db, 'records').withConverter(recordConverter), {
      id: record.id,
      name: record.name,
      score: record.score,
      date: record.date,
    }).catch(() => alert('ERROR'))
  }

  async getLatestGameTopFiftyRecord(): Promise<GameRecord[]> {
    const topFiftyScore = await getDocs(
      query(collection(db, 'records').withConverter(recordConverter), orderBy('score', 'desc'), limit(50))
    )
    return topFiftyScore.docs.map((doc) => doc.data())
  }

  async getLatestTopFiveGameRecord(): Promise<GameRecord[]> {
    const topFiveScore = await getDocs(
      query(collection(db, 'records').withConverter(recordConverter), orderBy('score', 'desc'), limit(5))
    )
    return topFiveScore.docs.map((doc) => doc.data())
  }

  async getNumOfGameRecords(): Promise<number> {
    const totalCount = await getCountFromServer(query(collection(db, 'records')))
    return totalCount.data().count
  }
}

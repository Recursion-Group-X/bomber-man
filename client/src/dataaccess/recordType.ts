import { FirestoreDataConverter, QueryDocumentSnapshot, serverTimestamp, SnapshotOptions } from '@firebase/firestore'

export interface GameRecord {
  id: number
  name: string
  score: number
  date: Date
}

export const recordConverter: FirestoreDataConverter<GameRecord> = {
  toFirestore(record: GameRecord) {
    return {
      id: record.id,
      name: record.name,
      score: record.score,
      date: serverTimestamp(),
    }
  },

  fromFirestore(snapShot: QueryDocumentSnapshot, options: SnapshotOptions): GameRecord {
    const data = snapShot.data(options)
    return {
      id: data.id,
      name: data.name,
      score: data.score,
      date: data.date,
    }
  },
}

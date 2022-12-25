import { FirestoreDataConverter, QueryDocumentSnapshot, serverTimestamp, SnapshotOptions } from "@firebase/firestore";

export interface GameRecord {
    name: string;
    score: number;
    alivedTime: number;
    date: Date;
}

export const recordConverter: FirestoreDataConverter<GameRecord> = {
    toFirestore(record: GameRecord) {
        return {
            name: record.name,
            score: record.score,
            alivedTime: record.alivedTime,
            date: serverTimestamp()
        }
    },

    fromFirestore(snapShot: QueryDocumentSnapshot, options: SnapshotOptions): GameRecord {
        const data = snapShot.data(options);
        return {
            name: data.name,
            score: data.score,
            alivedTime: data.alivedTime,
            date: data.date
        }
    }
}
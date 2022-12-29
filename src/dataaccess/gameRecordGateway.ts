import db from "../firebase";
import { addDoc, collection, getDocs, limit, query, orderBy, getCountFromServer } from "firebase/firestore";
import { GameRecord, recordConverter } from "./recordType";

export class GameRecordGateWay {
    async postGameRecord(record: GameRecord): Promise<void>{
        addDoc(collection(db, "records").withConverter(recordConverter), {
            id: record.id,
            name: record.name,
            score: Math.floor(record.score),
            alivedTime: Math.floor(record.alivedTime),
            date: record.date
        }).catch(()=>alert("ERROR"))
    }

    async getGameAllRecord(): Promise<GameRecord[]> {
        const snapShot = await getDocs(collection(db, "records").withConverter(recordConverter));
        return snapShot.docs.map((doc) => doc.data());
    }

    async getLatestTopFiveGameRecord(): Promise<GameRecord[]> {
        const topFiveScore = await getDocs(query(collection(db, "records").withConverter(recordConverter), orderBy("score", "desc"), limit(5)));
        return topFiveScore.docs.map((doc) => doc.data());
    }

    async getNumOfGameRecords(): Promise<number>{
        const totalCount = await getCountFromServer(query(collection(db, "records")));
        return totalCount.data().count;
    }
}
import db from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { GameRecord, recordConverter } from "./recordType";

export class GameRecordGateWay {
    postGameRecord(record: GameRecord): void{
        addDoc(collection(db, "records").withConverter(recordConverter), {
            name: record.name,
            score: record.score,
            alivedTime: record.alivedTime,
            date: record.date
        }).catch(()=>alert("ERROR"))
    }

    async getGameRecord(): Promise<GameRecord[]> {
        const snapShot = await getDocs(collection(db, "records").withConverter(recordConverter))
        return snapShot.docs.map((doc) => doc.data());
    }
}
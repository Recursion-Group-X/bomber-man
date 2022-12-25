import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
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
}
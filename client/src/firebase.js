import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: 'bomberman-server-2023.firebaseapp.com',
  projectId: 'bomberman-server-2023',
  storageBucket: 'bomberman-server-2023.appspot.com',
  messagingSenderId: '557500423459',
  appId: '1:557500423459:web:4a08712b4339733b120096',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db

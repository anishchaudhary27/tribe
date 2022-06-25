import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import key from './firebase-key'

const app = initializeApp(key)
const auth = getAuth(app)
const storage = getStorage(app)

export {app, auth, storage}
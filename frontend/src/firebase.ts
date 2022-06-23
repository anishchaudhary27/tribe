import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import key from './firebase-key'

const app = initializeApp(key)
const auth = getAuth(app)

export {app, auth}
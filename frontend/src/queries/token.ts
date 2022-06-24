import {auth} from "../firebase"
import {getIdTokenResult} from "firebase/auth"

const tokenQueryId = "token"

function getToken() {
    if(auth.currentUser) {
        return getIdTokenResult(auth.currentUser, true)
    }
    else {
        return null
    }
}

export {tokenQueryId,getToken}
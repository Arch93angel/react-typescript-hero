import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from "./Firebase"
import { toastError } from "../utils/toast";
import catchError from "../utils/catchError";
import { authDataType, setLoadingType, userType } from "../types/Types";
import { NavigateFunction } from "react-router-dom";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { defaultUser } from "../Redux/userSlice";

//Collection names
const usersCollection = "users";
const tasksCollection = "tasks";
const taskListsCollection = "taskList";
const chatsCollection = "chats";
const messagesCollection = "messages";
//Register or sign up user
export const Backend_signUp = (
    data:authDataType, 
    setLoading: setLoadingType,
    reset:()=>void,
    goTo: NavigateFunction
)=>{
    const {email, password, confirmPassword} = data;
    setLoading(true);
    if (email && password) {
        if (password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                .then(({user}) => {
                    //TODO:create user image
                    const userInfo = addUserToCollection(user.uid, user.email || "", user.email?.split("@")[0] || "","imgLink")
                    //TODO:set user in store and local storage
                    setLoading(false);
                    reset();
                    goTo("/dashboard")
                })
                .catch(error => {
                    catchError(error);
                    setLoading(false);
                });
        } else toastError("Password do not match..");
    }else toastError("Fields should not be left empty..");
    
};
//Login or sign in user

export const Backend_signIn = (
    data:authDataType, 
    setLoading: setLoadingType,
    reset:()=>void,
    goTo: NavigateFunction
)=>{
    const {email, password} = data;
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
    .then(({user}) => {
    //TODO: update user isOnline to true 
    //get user info
    const userInfo = getUserInfo(user.uid)
    //TODO:set user in store and local storage
    setLoading(false);
    reset();
    goTo("/dashboard")
  }).catch(error=>{
    catchError(error);
    setLoading(true);
  });
};

const addUserToCollection = async (id:string, email:string, username:string, img:string)=>{
    await setDoc(doc(db, usersCollection, id),{
        isOnline:true,
        img,
        username,
        email,
        creationTime:serverTimestamp(),
        lastSeen:serverTimestamp(),
        bio:`Hi! my name is ${username}, welcome to a beautiful interface`
    })
    return getUserInfo(id)
}

const getUserInfo = async (id:string): Promise<userType> => {
    const userRef = doc(db, usersCollection, id);
    const user = await getDoc(userRef);
    if (user.exists()) {
        const {img, isOnline, username, email, bio, creationTime, lastSeen} = user.data()
        return {
            id:user.id,
            img,
            isOnline,
            username,
            email,
            bio,
            creationTime,
            lastSeen,
        }
    }else {
        toastError("getUserInfo: User not found");
        return defaultUser;
    }
}
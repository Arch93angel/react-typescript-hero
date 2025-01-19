import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "./Firebase"
import { toastError } from "../utils/toast";
import catchError from "../utils/catchError";


export const Backend_signUp = (
    data:{
        email:string,
        password:string,
        confirmPassword:string,
    }
)=>{
    const {email, password, confirmPassword} = data
    if (email && password) {
        if (password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                .then(({user}) => {
                    console.log({user})
                })
                .catch(error => catchError(error));

        } else toastError("Password do not match..")
    }else toastError("Fields should not be left empty..")
};
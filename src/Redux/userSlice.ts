import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userType } from '../types/Types';

export const defaultUser:userType = {
  id: "",
  img: "",
  username: "",
  isOnline:false,
  email: "",
  bio: '',
  creationTime: "",
  lastSeen: "",
}

const initialState = {

}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    setUser:(state,action)=> {
//set logged in user
    },
    setUsers:(state,action)=> {
//set all users
    },
  }
})

export const {setUser,setUsers} = userSlice.actions

export default userSlice.reducer
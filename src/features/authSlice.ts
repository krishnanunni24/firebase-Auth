import {createSlice} from "@reduxjs/toolkit"
import { User } from "../models/user"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface AuthState{
    user:null | User
}
const initialState:AuthState={
    user:null
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
     login:(state,action:PayloadAction<User>)=>{
        state.user = action.payload;
     },
     logout:(state)=>{
        state.user = null;
     }
    }
})

export const {login,logout} = authSlice.actions;
export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {token: null, sessionExpired: false},
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload
      state.token = accessToken
      state.sessionExpired = false
    },
    logout: (state) => {
      state.token = null
    },
    setSessionExpired: (state)=> {
      state.sessionExpired = true
    }
  }
})

export const { setCredentials, logout, setSessionExpired} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectSessionExpired = (state) => state.auth.sessionExpired
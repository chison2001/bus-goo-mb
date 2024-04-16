import {createSlice} from '@reduxjs/toolkit';

interface AuthState {
  token: string;
  id: number;
  name: string;
  email: string;
}

const initialState: AuthState = {
  token: '',
  id:0,
  name: '',
  email: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },

    removeAuth: (state, action) => {
      state.authData = initialState;
    },
  },
});

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.authData;

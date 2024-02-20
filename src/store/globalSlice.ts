import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface IInitialState {
  showDialog: boolean,
  isSign: boolean,
  reloadPage: number,
  messageShow: boolean,
  message: string,
  enableThreeMinuteVersion: boolean   // Simulate 3 minutes a day and 21 minutes for the whole round
}


const initialState: IInitialState = {
  showDialog: false,
  isSign: false,
  reloadPage: 0,
  messageShow: false,
  message: '',
  enableThreeMinuteVersion: (import.meta.env.VITE_ENV != 'production')  // true:3m  false:1day
  // enableThreeMinuteVersion: false
}

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    setIsSign: (state, { payload }) => {
      state.isSign = payload;
    },
    setShowDialog: (state, { payload }) => {
      state.showDialog = payload;
    },
    setReloadPage: (state) => {
      state.reloadPage = Math.random();
    },
    showMessage: (state, { payload }) => {
      state.message = payload;
      state.messageShow = true;
    },
    closeMessage: (state) => {
      state.messageShow = false;
    }
  }
})

export const { setIsSign, setShowDialog, setReloadPage, showMessage, closeMessage } = stateSlice.actions;
export default stateSlice.reducer;

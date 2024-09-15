import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'This is the initial notification message',
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => '',
  },
});

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

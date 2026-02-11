import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counterslice";
import menuSlice from "./slices/menuSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    menu: menuSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

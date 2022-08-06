import { configureStore } from "@reduxjs/toolkit";
import heroReducer from "./Hero";

const reducers = {
   heros: heroReducer,
};

const store = configureStore({
   reducer: reducers,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

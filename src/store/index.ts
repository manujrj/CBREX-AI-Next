// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { matchingApi } from "../lib/client/matchingApi";
import resultReducer from "../lib/client/resultSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    result: resultReducer,
    [matchingApi.reducerPath]: matchingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(matchingApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

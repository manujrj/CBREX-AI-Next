import { configureStore } from "@reduxjs/toolkit";
import { matchingApi } from "./matchingApi";
import resultReducer from "./resultSlice";

export const store = configureStore({
  reducer: {
    [matchingApi.reducerPath]: matchingApi.reducer,
    result: resultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(matchingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

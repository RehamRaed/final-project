import { configureStore } from "@reduxjs/toolkit";
import roadmapReducer from "./roadmapSlice";

export const store = configureStore({
  reducer: {
    roadmap: roadmapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

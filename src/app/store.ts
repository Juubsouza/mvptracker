import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mvpTrackingReducer from "../features/MVPTracking/mvpTrackingSlice";

export const store = configureStore({
  reducer: {
    mvpTracking: mvpTrackingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

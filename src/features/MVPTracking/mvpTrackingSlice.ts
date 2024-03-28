import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MVPMonster } from "../../types";

interface MVPTrackingState {
  isLoading: boolean;
  status: "idle" | "loading" | "failed";
  addedMVPs: MVPMonster[];
}

const initialState: MVPTrackingState = {
  isLoading: false,
  status: "idle",
  addedMVPs: [],
};

export const mvpTrackingSlice = createSlice({
  name: "mvpTracking",
  initialState,
  reducers: {
    setLoadingTrue: (state) => {
      state.isLoading = true;
    },
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
    addMVP: (state, action: PayloadAction<MVPMonster>) => {
      const mvp = state.addedMVPs.findIndex(
        (mvp) => mvp.monster_id === action.payload.monster_id
      );

      if (mvp !== -1) {
        state.addedMVPs[mvp] = action.payload;
      } else {
        state.addedMVPs.push(action.payload);
      }
    },
    removeMVP: (state, action: PayloadAction<MVPMonster>) => {
      state.addedMVPs = state.addedMVPs.filter(
        (mvp) => mvp.monster_id !== action.payload.monster_id
      );
    },
  },
});

export const { setLoadingTrue, setLoadingFalse, addMVP, removeMVP } =
  mvpTrackingSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.mvpTracking.isLoading;

export const selectAddedMVPs = (state: RootState) =>
  state.mvpTracking.addedMVPs;

export default mvpTrackingSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MVPMonster } from "../../types";
import { ragnarokAPITimeToHourNumber } from "../../utils/formatter";

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

function getRemainingRespawnTime(mvp: MVPMonster) {
  if (!mvp.lastKill) {
    return -1;
  }

  const lastKillDate = new Date(mvp.lastKill);
  const respawnTimeInHour = ragnarokAPITimeToHourNumber(mvp.maps[0].frequency);

  const nextRespawnDate = new Date(
    lastKillDate.getTime() + respawnTimeInHour * 60 * 60 * 1000
  );
  const now = new Date();

  const remainingTime = nextRespawnDate.getTime() - now.getTime();

  if (remainingTime < 0) {
    return -1;
  }

  return remainingTime;
}

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
      const mvpIndex = state.addedMVPs.findIndex(
        (mvp) => mvp.monster_id === action.payload.monster_id
      );

      if (mvpIndex !== -1) {
        state.addedMVPs[mvpIndex] = action.payload;
      } else {
        state.addedMVPs.push(action.payload);
      }

      state.addedMVPs.sort((a, b) => {
        const aRemainingTime = getRemainingRespawnTime(a);
        const bRemainingTime = getRemainingRespawnTime(b);

        if (aRemainingTime === -1) return 1;
        if (bRemainingTime === -1) return -1;

        return aRemainingTime - bRemainingTime;
      });
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

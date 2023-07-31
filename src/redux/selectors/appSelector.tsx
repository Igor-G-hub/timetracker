import { State } from "../reducers/appReducer";

interface AppState {
  app: State;
}

export const authSelector = (state: AppState) => state.app.isAuth;
export const unfinishedTrackersSelector = (state: AppState) =>
  state.app.unfinishedTrackers;

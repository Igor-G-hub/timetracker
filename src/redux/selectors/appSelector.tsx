interface State {
  app: {
    isAuth: boolean;
    unfinishedTrackers: Array<{}>;
  };
}
export const authSelector = (state: State) => state.app.isAuth;
export const unfinishedTrackersSelector = (state: State) =>
  state.app.unfinishedTrackers;

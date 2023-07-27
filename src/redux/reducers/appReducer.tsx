import {
  SET_IS_AUTH,
  SET_UNFINISHED_TRACKERS,
} from "../actionTypes/appActionType";

interface Trackers {
  id: string;
  createTime: number;
  description: string;
  timetracked: number;
  isCurrentlyTracking?: boolean;
  userId?: string;
}

interface State {
  unfinishedTrackers: Trackers[];
  isAuth: boolean | null;
}

const initialState = {
  isAuth: null,
  unfinishedTrackers: [],
};

const appReducer = (
  state: State = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case SET_IS_AUTH:
      return {
        ...state,
        isAuth: action.payload.isAuth,
      };
    case SET_UNFINISHED_TRACKERS:
      return {
        ...state,
        unfinishedTrackers: action.payload.unfinishedTrackers,
      };
    default:
      return state;
  }
};

export default appReducer;

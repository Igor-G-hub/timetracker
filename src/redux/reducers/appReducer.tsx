import { SET_IS_AUTH } from "../actionTypes/appActionType";

  const initialState = {
    isAuth: false,
  };
  
  const appReducer = (state = initialState, action: {type: string, payload: {isAuth: boolean}}) => {
    switch (action.type) {
      case SET_IS_AUTH:
        return {
          ...state,
          isAuth: action.payload.isAuth
        };      
      default:
        return state;
    }
  };
  
  export default appReducer;
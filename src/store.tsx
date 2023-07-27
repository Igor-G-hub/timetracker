import { createStore, combineReducers, compose  } from 'redux';
import appReducer from './redux/reducers/appReducer';

const rootReducer = combineReducers({
  app: appReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers()
);

export default store;
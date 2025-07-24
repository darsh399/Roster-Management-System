import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { slotsReducer } from "./reducers";

const rootReducer = combineReducers({
  slots: slotsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
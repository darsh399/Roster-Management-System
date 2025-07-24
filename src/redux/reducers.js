import { LOAD_PROVIDERS } from "./action";

const initialState = {
  providers: []
};

export const slotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PROVIDERS:
      return { ...state, providers: action.payload };
    default:
      return state;
  }
};

import { Reducer } from 'redux';

export const SET_AUTH = 'SET_AUTH';
export const REMOVE_AUTH = 'REMOVE_AUTH';

const initialState: RootAuthState = {
  auth: false,
};

export type RootAuthState = {
  auth: boolean;
};

export const authReducer: Reducer<RootAuthState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        auth: action.auth,
      };
    case REMOVE_AUTH:
      return {
        ...state,
        auth: action.auth,
      };
    default:
      return state;
  }
};

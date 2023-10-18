import { Reducer } from 'redux';

export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

const initialState: RootTokenState = {
  token: '',
};

export type RootTokenState = {
  token: string;
};

export const tokenReducer: Reducer<RootTokenState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case REMOVE_TOKEN:
      return {
        ...state,
        token: false,
      };
    default:
      return state;
  }
};

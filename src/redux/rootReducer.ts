import { combineReducers, Reducer } from 'redux';
import { authReducer, RootAuthState } from './authReducer';
import { RootTokenState, tokenReducer } from './tokenReducer';

export type RootState = {
  tokenReducer: RootTokenState;
  authReducer: RootAuthState;
};

export const rootReducer: Reducer<RootState> = combineReducers({
  tokenReducer,
  authReducer,
});

import { REMOVE_TOKEN, SET_TOKEN } from './tokenReducer';

export function setToken(token: string | null) {
  localStorage.setItem('token', `${token}`)
  return {
    type: SET_TOKEN,
    token,
  };
}

export function removeToken(token: boolean) {
  localStorage.removeItem('token')
  return {
    type: REMOVE_TOKEN,
    token,
  };
}
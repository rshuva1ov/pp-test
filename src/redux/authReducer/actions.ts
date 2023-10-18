import { REMOVE_AUTH, SET_AUTH } from './authReducer';

export function setAuth(auth: boolean) {
  localStorage.setItem('auth', `${auth}`)
  return {
    type: SET_AUTH,
    auth,
  };
}

export function removeAuth(auth: boolean) {
  localStorage.removeItem('auth')
  return {
    type: REMOVE_AUTH,
    auth,
  };
}
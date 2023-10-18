import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/tokenReducer';


export function useToken(token: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(token));
  }, []);

  return [token];
}

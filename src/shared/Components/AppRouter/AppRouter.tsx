import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { RootState } from '../../../redux';
import { privateRoutes, publicRoutes } from '../../routes/Routes';
import { Auth } from '../Auth';
import { Main } from '../Main';

export function AppRouter() {
  const token = useSelector<RootState, string>(
    (state) => state.tokenReducer.token
  );
  const auth = localStorage.getItem('auth');

  return (
    auth
      ?
      <Routes>
        {privateRoutes
          ? privateRoutes.map(route =>
            <Route
              element={<route.element />}
              path={route.path}
              key={route.path}
            />
          )
          : <Route path='/' element={<Main />} />
        }
        <Route path='/' element={<Main />} />
        <Route path="/*" element={<Main />} />
      </Routes>
      :
      <Routes>
        {publicRoutes
          ? publicRoutes.map(route =>
            <Route
              element={<route.element />}
              path={route.path}
              key={route.path}
            />
          )
          : <Route path="/" element={<Auth />} />}
        <Route path="/" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </Routes>
  );
}
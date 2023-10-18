import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from '../../../redux';
import { privateRoutes, publicRoutes } from '../../routes/Routes';
import { Auth } from '../Auth';
import { Main } from '../Main';

export function AppRouter() {
  const token = useSelector<RootState, string>(
    (state) => state.tokenReducer.token
  );

  // console.log(token);

  const auth = localStorage.getItem('auth');

  // console.log(auth);

  return (
    auth
      ?
      <Routes>
        {privateRoutes.map(route =>
          <Route
            element={<route.element />}
            path={route.path}
            key={route.path}
          />
        )}
        <Route path='/' element={<Main />} />
        <Route path="/*" element={<Main />} />
      </Routes>
      :
      <Routes>
        {publicRoutes.map(route =>
          <Route
            element={<route.element />}
            path={route.path}
            key={route.path}
          />
        )}
        <Route index element={<Navigate to="/auth" />} />
        <Route path="/" element={<Auth />} />
        <Route path="*" element={<Auth />} />
      </Routes>
  );
}
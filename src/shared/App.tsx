import React from 'react';
import { AppComponent } from './Components/AppComponent';
import './main.global.css';
import { hot } from 'react-hot-loader/root';
import { applyMiddleware, createStore, Middleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { rootReducer } from '../redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const App = hot(() => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
));

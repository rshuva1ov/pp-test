import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../redux/authReducer';
import { setToken } from '../../../redux/tokenReducer';
import { axiosAuth } from '../../API/userAPI';
import styles from './auth.css';

export function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await axiosAuth(username, password);
    if (!response || !response.data['token']) return;
    dispatch(setAuth(true));
    localStorage.setItem('auth', 'true');
    dispatch(setToken(response.data['token']));
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Авторизуйтесь</h1>
        <input type="text" placeholder='Введите имя пользователя' className={styles.input}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input type="password" placeholder='Введите пароль' className={styles.input}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" className={styles.button}>Войти</button>
      </form>
    </div>
  );
}

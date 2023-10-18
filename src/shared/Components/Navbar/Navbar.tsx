import React from 'react';
import styles from './navbar.css';
import { useDispatch } from 'react-redux';
import { removeAuth } from '../../../redux/authReducer';
import { removeToken } from '../../../redux/tokenReducer';

export function Navbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeAuth(false));
    dispatch(removeToken(false));
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.navbar__content}>
        <button className={styles.button} onClick={handleLogout}>Выйти</button>
        </div>
      </div>
    </div>
  );
}

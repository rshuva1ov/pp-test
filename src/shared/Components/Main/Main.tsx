import React from 'react';
import { Navbar } from '../Navbar';
import styles from './main.css';
import { WorkOrders } from '../WorkOrders';

export interface WorkOrder {
  id: number,
  number: string,
  start_date: null,
  material: {
    id: number,
    code: string,
    name: string,
  },
  product: {
    id: number,
    code: string,
    name: string,
  },
  is_finished: boolean;
}

export interface WorkOrderArrayInterface {
  data: WorkOrder[];
}

export interface NomenclatureArrayInterface {
  data: NomenclatureInterface[];
}

export interface NomenclatureInterface {
  id: number;
  code: string;
  name: string;
}

export interface newWorkOrderInterface {
  number: string,
  start_date: string | null,
  material: string,
  product: string,
  is_finished: boolean
}

export interface changeWorkOrderInterface {
  id: number,
  number: string,
  start_date: string | null,
  material: {
    name: string
  },
  product: {
    name: string
  },
  is_finished: boolean
}

export interface tokenInterface {
  token: string | null;
}

export function Main() {
  const token = localStorage.getItem('token');

  return (
    <div className={styles.main}>
      <Navbar />
      <div className={styles.container}>
        <WorkOrders token={token} />
      </div>
    </div >
  );
}

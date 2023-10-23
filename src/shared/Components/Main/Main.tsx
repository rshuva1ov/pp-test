import React from 'react';
import { Navbar } from '../Navbar';
import { WorkOrders } from '../WorkOrders';
import styles from './main.css';

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
    id: number | string,
    code: string,
    name: string,
  },
  product: {
    id: number | string,
    code: string,
    name: string,
  },
  is_finished: boolean;
}

export interface tokenInterface {
  token: string | null;
}

export interface WorkOrdersFormInterface {
  onClose?: () => void;
}

export interface producedProductsInterface {
  id: number,
  serial: string,
  weight: string,
  date: string,
}

export interface newProductInterface {
  weight: string;
}

export type FormData = {
  number: string;
  start_date: string | null;
  material: string;
  product: string;
  is_finished: boolean;
};

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

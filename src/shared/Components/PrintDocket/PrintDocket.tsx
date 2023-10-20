import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from './printdocket.css'
import { WorkOrdersFormInterface, producedProductsInterface } from "../Main";
import ReactDOM from "react-dom";

export const PrintDocket = (product: any) => {

  const [isPrintModalOpened, setIsPrintModalOpened] = useState(false);

  return (
    <div className={styles.printContainer}>
      <button className={styles.button} onClick={() => setIsPrintModalOpened(true)}>
        Открыть предпросмотр печати
      </button>
      {
        isPrintModalOpened && (<PrintButton product={product} onClose={() => setIsPrintModalOpened(false)} />)
      }
    </div>
  )
}

export const PrintButton = (product: any, props: WorkOrdersFormInterface) => {
  const node = document.querySelector('#modal-print_root');
  if (!node) return null;

  const printRef = useRef<any>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.target instanceof Node && !printRef.current?.contains(event.target)) {
        props.onClose?.();
      }
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [])

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return ReactDOM.createPortal((
    <div ref={printRef} className={[styles.print, styles.modal].join(' ')}>
      <ComponentToPrint ref={componentRef} product={product} />
      <button className={[styles.printButton, styles.button].join(' ')} onClick={handlePrint}>Распечатать</button>
    </div>
  ), node)
};

export const ComponentToPrint = React.forwardRef<HTMLDivElement, any>(({ product }, ref) => {
  return (
    <div ref={ref}>
      {product
        ? <div className={styles.label}>
          <div className={styles.label__container}>
            <div className={styles.label__content}>
              <div className={styles.label__title}>ID:</div>
              <div className={styles.label__field}>{product.product.product.id}</div>
              <div className={styles.label__title}>Номер:</div>
              <div className={styles.label__field}>{product.product.product.serial}</div>
              <div className={styles.label__title}>Вес:</div>
              <div className={styles.label__field}>{product.product.product.weight}</div>
              <div className={styles.label__title}>Дата:</div>
              <div className={styles.label__field}>{product.product.product.date
                .split("T")[0]
                .split("-")
                .reverse()
                .join(".")}
              </div>
            </div>

            <div className={styles.label__svg}>
              <svg fill="#000000" width="200px" height="200px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M0 2.53h2.49v10.95H0zm11 0h2.49v10.95H11zm-6.02 0h1.24v10.95H4.98zm2.49 0h1.24v10.95H7.47zm7.29 0H16v10.95h-1.24z" /></svg>
            </div>
          </div>
        </div>
        : <div>Нет ответа</div>
      }
    </div>
  );
});
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { axiosNewProducedProducts } from '../../API/newProducedProductsAPI ';
import { axiosPostWorkOrder } from '../../API/newWorkOrderAPI';
import { axiosGetNomenclature } from '../../API/nomenclatureAPI';
import { axiosProducedProducts } from '../../API/producedProductsAPI';
import { axiosGetWorkOrders } from '../../API/workOrdersAPI';
import { axiosPutWorkOrderWithId } from '../../API/workOrdersIdAPI';
import { FormData, NomenclatureInterface, WorkOrder, WorkOrdersFormInterface, changeWorkOrderInterface, newProductInterface, newWorkOrderInterface, producedProductsInterface, tokenInterface } from '../Main';
import { Pagination } from '../Pagination';
import { PrintDocket } from '../PrintDocket';
import styles from './workorders.css';

export function WorkOrders(token: tokenInterface) {
  const TOKEN = token['token'];
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;
  const [query, setQuery] = useState('');

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getPageCount = (totalOrders: number, limit: number) => {
    return Math.ceil(totalOrders / limit);
  };

  const [sortColumn, setSortColumn] = useState<string>(''); // столбец сортировки
  const [sortOrder, setSortOrder] = useState<string>(''); // порядок сортировки

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedWorkOrders = workOrders.slice().sort((a, b) => {
    if (sortColumn === 'id') {
      return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (sortColumn === 'Номер наряда') {
      return sortOrder === 'asc' ? a.number.localeCompare(b.number) : b.number.localeCompare(a.number);
    } else if (sortColumn === 'Дата начала производства') {
      //@ts-ignore
      return sortOrder === 'asc' ? new Date(a.start_date) - new Date(b.start_date) : new Date(b.start_date) - new Date(a.start_date);
    } else if (sortColumn === 'id материала') {
      return sortOrder === 'asc' ? a.material.id - b.material.id : b.material.id - a.material.id;
    } else if (sortColumn === 'Код материала') {
      return sortOrder === 'asc' ? a.material.code.localeCompare(b.material.code) : b.material.code.localeCompare(a.material.code);
    } else if (sortColumn === 'Название материала') {
      return sortOrder === 'asc' ? a.material.name.localeCompare(b.material.name) : b.material.name.localeCompare(a.material.name);
    } else if (sortColumn === 'id продукции') {
      return sortOrder === 'asc' ? a.product.id - b.product.id : b.product.id - a.product.id;
    } else if (sortColumn === 'Код продукции') {
      return sortOrder === 'asc' ? a.product.code.localeCompare(b.product.code) : b.product.code.localeCompare(a.product.code);
    } else if (sortColumn === 'Название продукции') {
      return sortOrder === 'asc' ? a.product.name.localeCompare(b.product.name) : b.product.name.localeCompare(a.product.name);
    } else if (sortColumn === 'Статус завершенности') {
      //@ts-ignore
      return sortOrder === 'asc' ? a.is_finished - b.is_finished : b.is_finished - a.is_finished;
    }
    else {
      return 0;
    }
  });

  const sortedAndSearchedPosts: WorkOrder[] = useMemo(() => {
    return sortedWorkOrders.filter((post: WorkOrder) => post.number.toLowerCase().includes(query.toLowerCase()));
  }, [query, sortedWorkOrders]);

  const fetchWorkorders = async () => {
    const response = await axiosGetWorkOrders(TOKEN, currentPage);
    if (response) {
      setWorkOrders(response.data.results);
      const totalOrders = response.data.count;
      setTotalPages(getPageCount(totalOrders, limit))
    }
  };

  useEffect(() => {
    fetchWorkorders()
  }, [currentPage]);

  let pagesArray: number[] = [];

  const [isModalOpened, setIsModalOpened] = useState(false);

  const WorkOrdersForm = (props: WorkOrdersFormInterface) => {
    const node = document.querySelector('#modal-form_root');
    if (!node) return null;

    const TOKEN = token['token'];

    const [nomenclature, setNomenclature] = useState<NomenclatureInterface[]>([]);
    const [materials, setMaterials] = useState<NomenclatureInterface[]>([]);
    const [products, setProducts] = useState<NomenclatureInterface[]>([]);

    const fetchNomenclature = async () => {
      const response = await axiosGetNomenclature(TOKEN);;
      if (response) {
        setNomenclature(response.data.results);
      }
    };

    const [newWorkOrder, setNewWorkOrder] = useState<newWorkOrderInterface>({
      number: '',
      start_date: '',
      material: '',
      product: '',
      is_finished: false
    });

    useEffect(() => {
      fetchNomenclature()
    }, []);

    useEffect(() => {
      setMaterials(nomenclature);
      setProducts(nomenclature);
    }, [nomenclature]);

    const filterNomenclature = (codeOrName: string) => {
      const filteredMaterials = nomenclature.filter(n => n.code.includes(codeOrName) || n.name.includes(codeOrName));
      setMaterials(filteredMaterials);
      setProducts(filteredMaterials);
    };

    const createWorkOrder = async () => {
      for (const field in newWorkOrder) {
        if (newWorkOrder[field as keyof FormData] === '') {
          alert('Пожалуйста, заполните все поля формы.');
          return;
        }
      }
      const response = await axiosPostWorkOrder(newWorkOrder, TOKEN);
      if (response?.statusText == 'Created') {
        fetchWorkorders();
        setNewWorkOrder({
          number: '',
          start_date: '',
          material: '',
          product: '',
          is_finished: false
        })
        props.onClose?.()
      }
    };

    const ref = useRef<HTMLFormElement>(null);

    useEffect(() => {
      function handleClick(event: MouseEvent) {
        if (event.target instanceof Node && !ref.current?.contains(event.target)) {
          props.onClose?.();
        }
      }
      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('click', handleClick);
      }
    }, [])

    return ReactDOM.createPortal((
      <div>
        <form className={[styles.form, styles.modal].join(' ')} ref={ref}>
          <h2>Форма создания наряда</h2>
          <input className={styles.input}
            placeholder="Введите код или название номенклатуры"
            onChange={(e) => filterNomenclature(e.target.value)}
          />
          <input className={styles.input}
            type="text"
            placeholder="Номер наряда"
            value={newWorkOrder.number}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, number: e.target.value })}
          />
          <select className={styles.input}
            value={newWorkOrder.material}
            onChange={(e) =>
              setNewWorkOrder({ ...newWorkOrder, material: e.target.value })
            }
          >
            <option value="">Выберите материал</option>
            {materials
              ? materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))
              : <option></option>}
          </select>

          <select className={styles.input}
            value={newWorkOrder.product}
            onChange={(e) =>
              setNewWorkOrder({ ...newWorkOrder, product: e.target.value })
            }
          >
            <option value="">Выберите продукцию</option>
            {products
              ? products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))
              : <option></option>}
          </select>
          <input className={styles.input}
            type="date"
            placeholder="Планируемая дата производства"
            value={newWorkOrder.start_date == null ? '' : newWorkOrder.start_date}
            onChange={(e) => setNewWorkOrder({ ...newWorkOrder, start_date: e.target.value })}
          />
          <button type="button" onClick={createWorkOrder} className={styles.button}>Создать наряд</button>
        </form>
      </div>
    ), node)
  }

  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const [change, setChange] = useState(false);
  const [workOrderIdInfo, setWorkOrderIdInfo] = useState<changeWorkOrderInterface>({
    id: 1,
    number: '',
    start_date: '',
    material: {
      id: 1,
      code: '',
      name: '',
    },
    product: {
      id: 1,
      code: '',
      name: '',
    },
    is_finished: false
  });

  const WorkOrdersEditForm = (props: WorkOrdersFormInterface) => {
    const [nomenclature, setNomenclature] = useState<NomenclatureInterface[]>([]);
    const [materials, setMaterials] = useState<NomenclatureInterface[]>([]);
    const [products, setProducts] = useState<NomenclatureInterface[]>([]);

    const node = document.querySelector('#modal-edit-form_root');
    if (!node) return null;

    const editRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClick(event: MouseEvent) {
        if (event.target instanceof Node && !editRef.current?.contains(event.target) && !productRef.current?.contains(event.target)) {
          props.onClose?.();
        }
      }
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      }
    }, [])

    const fetchNomenclature = async () => {
      const response = await axiosGetNomenclature(TOKEN);;
      if (response) {
        setNomenclature(response.data.results);
      }
    };

    useEffect(() => {
      fetchNomenclature();
    }, []);

    useEffect(() => {
      setMaterials(nomenclature);
      setProducts(nomenclature);
    }, [nomenclature]);

    const [changedWorkOrderInfo, setChangedWorkOrderInfo] = useState<changeWorkOrderInterface>(workOrderIdInfo);

    const changedWorkOrderInfoAsync = async (changedWorkOrderInfo: changeWorkOrderInterface) => {
      for (const field in changedWorkOrderInfo) {
        if (changedWorkOrderInfo[field as keyof changeWorkOrderInterface] === '') {
          alert('Пожалуйста, заполните все поля формы.');
          return;
        }
      }
      if (change) {
        const confirmation = confirm('Вы уверены, что хотите внести изменения?');
        if (confirmation) {
          const response = await axiosPutWorkOrderWithId(changedWorkOrderInfo, TOKEN, changedWorkOrderInfo.id);
          if (response) {
            fetchWorkorders();
            props.onClose?.();
          }
        } else return;
      } else {
        props.onClose?.();
      }
    };

    useEffect(() => {
      setChange(true)
    }, [changedWorkOrderInfo])


    const [isProductModalOpened, setIsProductModalOpened] = useState(false);
    const productRef = useRef<HTMLDivElement>(null);

    const WorkOrdersProductForm = (props: WorkOrdersFormInterface) => {
      const node = document.querySelector('#modal-product-form_root');
      if (!node) return null;

      useEffect(() => {
        function handleClick(event: MouseEvent) {
          if (event.target instanceof Node && !productRef.current?.contains(event.target)) {
            props.onClose?.();
          }
        }
        document.addEventListener('click', handleClick);
        return () => {
          document.removeEventListener('click', handleClick);
        }
      }, [])

      const [producedProducts, setProducedProducts] = useState<producedProductsInterface[]>([]);
      const [newProduct, setNewProduct] = useState<newProductInterface>({
        weight: '',
      });

      const saveProducedProduct = async () => {
        for (const field in newProduct) {
          if (newProduct[field as keyof newProductInterface] === '') {
            alert('Пожалуйста, заполните все поля формы.');
            return;
          }
        }
        const confirmation = confirm('Добавить произведенную продукцию?');
        if (confirmation) {
          const response = await axiosNewProducedProducts(workOrderIdInfo.id, TOKEN, newProduct);
          if (response) {
            fetchProducedProducts();
            setNewProduct({
              weight: '',
            });
          }
        } else return;
      }


      useEffect(() => {
        fetchProducedProducts();
      }, [])

      const fetchProducedProducts = async () => {
        const response = await axiosProducedProducts(workOrderIdInfo.id, TOKEN);
        if (response) {
          setProducedProducts(response.data);
        }
      };

      return ReactDOM.createPortal((
        <div className={styles.modal} ref={productRef}>
          <div className={styles.productsFormContainer}>
            <h2>Форма производства продукции</h2>
            <form className={[styles.form, styles.productsForm].join(' ')} onSubmit={(e) => {
              e.preventDefault();
              saveProducedProduct();
            }}>
              <input
                className={styles.input}
                type="text"
                placeholder="Масса произведенной продукции"
                value={newProduct.weight}
                onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
              />
              <button className={styles.button} type="submit">
                Сохранить произведенную продукцию
              </button>
            </form>


            <h2>Список произведенной продукции</h2>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>Номер продукта</th>
                  <th>Масса</th>
                  <th>Дата</th>
                  <th></th>
                </tr>
              </thead>
              {producedProducts
                ? <tbody className={styles.tbody}>
                  {producedProducts
                    ? producedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.serial}</td>
                        <td>{product.weight}</td>
                        <td>{product
                          ? product.date.split("T")[0]
                            .split("-")
                            .reverse()
                            .join(".")
                          : ''}</td>
                        <td>
                          <PrintDocket product={product} />
                        </td>
                      </tr>
                    ))
                    : <tr></tr>}
                </tbody>
                : <tbody>Ожидание...</tbody>
              }
            </table>
          </div>
        </div>
      ), node)
    }

    return ReactDOM.createPortal((
      <div className={styles.modal} ref={editRef}>
        <h2>Форма детального просмотра и редактирования наряда</h2>
        <button className={styles.button} onClick={() => setIsProductModalOpened(true)}>Интерфейс оператора производственного процесса</button>
        <form className={styles.editForm}
          onSubmit={(e) => {
            e.preventDefault();
            changedWorkOrderInfoAsync(changedWorkOrderInfo);
          }
          }>

          <span>Номер наряда</span>
          <input
            className={styles.input}
            type="text"
            defaultValue={changedWorkOrderInfo.number}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...changedWorkOrderInfo, number: e.target.value });
            }}
          />

          <span>Дата начала производства</span>
          <input

            className={styles.input}
            type="date"
            defaultValue={changedWorkOrderInfo.start_date == null ? '' : changedWorkOrderInfo.start_date}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...changedWorkOrderInfo, start_date: e.target.value });
            }}
          />

          <span>Название материала</span>
          <select
            className={styles.input}
            defaultValue={changedWorkOrderInfo.material.id}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...changedWorkOrderInfo, material: { ...changedWorkOrderInfo.material, id: e.target.value } });
            }
            }
          >
            <option value={changedWorkOrderInfo.material.id}>{changedWorkOrderInfo.material.name}</option>
            {materials
              ? materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))
              : <option></option>}
          </select>

          <span>Название продукции</span>
          <select
            className={styles.input}
            defaultValue={changedWorkOrderInfo.product.id}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...changedWorkOrderInfo, product: { ...changedWorkOrderInfo.product, id: e.target.value } });
            }}
          >
            <option value={changedWorkOrderInfo.product.id}>{changedWorkOrderInfo.product.name}</option>
            {products
              ? products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))
              : <option></option>}
          </select>


          <span>Статус завершенности</span>
          <select className={styles.input}
            defaultValue={changedWorkOrderInfo.is_finished === true ? 'Завершено' : 'Не завершено'}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...changedWorkOrderInfo, is_finished: e.target.value == "true" ? true : false }
              );
            }}
          >
            <option value={changedWorkOrderInfo.is_finished.toString()}>{changedWorkOrderInfo.is_finished === true ? 'Завершено' : 'Не завершено'}</option>
            <option value="true">Завершено</option>
            <option value="false">Не завершено</option>
          </select>

          <button type='submit' className={styles.button}>Завершить</button>
        </form>
        {
          isProductModalOpened && (
            <WorkOrdersProductForm onClose={() => setIsEditModalOpened(false)} />
          )
        }
      </div >
    ), node)
  }


  return (
    <div>
      <div className={styles.mainTopbar}>
        <input className={styles.input}
          placeholder="Поиск"
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className={[styles.button, styles.white].join(' ')} onClick={() => {
          setIsModalOpened(true)
        }}>Создать новый наряд</button>
      </div>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th onClick={() => handleSort('id')}>id</th>
            <th onClick={() => handleSort('Номер наряда')}>Номер наряда</th>
            <th onClick={() => handleSort('Дата начала производства')}>Дата начала производства</th>
            <th onClick={() => handleSort('id материала')}>id материала</th>
            <th onClick={() => handleSort('Код материала')}>Код материала</th>
            <th onClick={() => handleSort('Название материала')}>Название материала</th>
            <th onClick={() => handleSort('id продукции')}>id продукции</th>
            <th onClick={() => handleSort('Код продукции')}>Код продукции</th>
            <th onClick={() => handleSort('Название продукции')}>Название продукции</th>
            <th onClick={() => handleSort('Статус завершенности')}>Статус завершенности</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedAndSearchedPosts
            ? sortedAndSearchedPosts.map((workOrder) => (
              <tr key={workOrder.id}>
                <td>{workOrder.id}</td>
                <td>{workOrder.number}</td>
                <td>{workOrder.start_date}</td>
                <td>{workOrder.material.id}</td>
                <td>{workOrder.material.code}</td>
                <td>{workOrder.material.name}</td>
                <td>{workOrder.product.id}</td>
                <td>{workOrder.product.code}</td>
                <td>{workOrder.product.name}</td>
                <td>{workOrder.is_finished
                  ? <span>Завершен</span>
                  : <span>Не завершен</span>
                }</td>
                <td>
                  <button
                    className={[styles.button, styles.white].join(' ')}
                    onClick={() => {
                      setWorkOrderIdInfo(workOrder);
                      setIsEditModalOpened(true);
                    }}>Открыть</button>
                </td>
              </tr>
            ))
            : <tr></tr>
          }
        </tbody>
      </table>
      <div>
      </div>

      <Pagination
        pagesArray={pagesArray}
        totalPages={totalPages}
        currentPage={currentPage}
        changePage={handlePageChange}
      />

      {
        isModalOpened && (
          <WorkOrdersForm onClose={() => setIsModalOpened(false)} />
        )
      }
      {
        isEditModalOpened && (
          <WorkOrdersEditForm onClose={() => setIsEditModalOpened(false)} />
        )
      }
    </div >
  );
}
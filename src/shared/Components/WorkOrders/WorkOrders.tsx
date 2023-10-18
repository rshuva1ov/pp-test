import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { axiosPostWorkOrder } from '../../API/newWorkOrderAPI';
import { debounce } from "debounce";
import { axiosGetNomenclature } from '../../API/nomenclatureAPI';
import { axiosGetWorkOrders } from '../../API/workOrdersAPI';
import { axiosPutWorkOrderWithId } from '../../API/workOrdersIdAPI';
import { NomenclatureInterface, WorkOrder, changeWorkOrderInterface, newWorkOrderInterface, tokenInterface } from '../Main';
import styles from './workorders.css';
import { Pagination } from '../Pagination';

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

  interface WorkOrdersFormInterface {
    onClose?: () => void;
  }

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

    type FormData = {
      number: string;
      start_date: string | null;
      material: string;
      product: string;
      is_finished: boolean;
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
        <h2>Форма создания наряда</h2>
        <form className={[styles.form, styles.modal].join(' ')} ref={ref}>
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
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>

          <select className={styles.input}
            value={newWorkOrder.product}
            onChange={(e) =>
              setNewWorkOrder({ ...newWorkOrder, product: e.target.value })
            }
          >
            <option value="">Выберите продукцию</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
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
  const [change, setChange] = useState(false);

  const WorkOrdersEditForm = (props: WorkOrdersFormInterface) => {
    const [nomenclature, setNomenclature] = useState<NomenclatureInterface[]>([]);
    const [materials, setMaterials] = useState<NomenclatureInterface[]>([]);
    const [products, setProducts] = useState<NomenclatureInterface[]>([]);

    const node = document.querySelector('#modal-edit-form_root');
    if (!node) return null;

    const ref = useRef<HTMLDivElement>(null);

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

    const [changedWorkOrderInfo, setChangedWorkOrderInfo] = useState<changeWorkOrderInterface>({
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

    const changedWorkOrderInfoAsync = async () => {
      if (change) {
        const confirmation = confirm('Вы уверены, что хотите внести изменения?');
        if (confirmation) {
          console.log(changedWorkOrderInfo);
          const response = await axiosPutWorkOrderWithId(changedWorkOrderInfo, TOKEN, workOrderIdInfo.id);
          console.log(response);

          if (response) {
            fetchWorkorders();
            props.onClose?.();
          }
        } else return;
      } else {
        props.onClose?.();
      }
    };

    return ReactDOM.createPortal((
      <div className={styles.modal} ref={ref}>
        <h2>Форма детального просмотра и редактирования наряда</h2>
        <form className={styles.editForm}
          onSubmit={(e) => {
            e.preventDefault();
            changedWorkOrderInfoAsync();
          }
          }>

          <span>Номер наряда</span>
          <input
            className={styles.input}
            type="text"
            defaultValue={workOrderIdInfo.number}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...workOrderIdInfo, number: e.target.value });
            }}
            onKeyDown={() => setChange(true)}
          />
          <span>Дата начала производства</span>
          <input

            className={styles.input}
            type="date"
            defaultValue={workOrderIdInfo.start_date == null ? '' : workOrderIdInfo.start_date}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...workOrderIdInfo, start_date: e.target.value });
            }}
            onKeyDown={() => setChange(true)}
          />
          <span>Название материала</span>
          <select
            className={styles.input}
            defaultValue={workOrderIdInfo.material.name}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...workOrderIdInfo, material: { ...workOrderIdInfo.material, name: e.target.value } });
              setChange(true);
            }
            }
          >
            <option value={workOrderIdInfo.material.name}>{workOrderIdInfo.material.name}</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
          <span>Название продукции</span>
          <select
            className={styles.input}
            defaultValue={workOrderIdInfo.product.name}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...workOrderIdInfo, product: { ...workOrderIdInfo.product, name: e.target.value } });
              setChange(true);
            }}
          >
            <option value={workOrderIdInfo.product.name}>{workOrderIdInfo.product.name}</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>


          <span>Статус завершенности</span>
          <select className={styles.input}
            defaultValue={workOrderIdInfo.is_finished === true ? 'Завершено' : 'Не завершено'}
            onChange={(e) => {
              setChangedWorkOrderInfo({ ...workOrderIdInfo, is_finished: Boolean(e.target.value) });
              setChange(true);
            }}
          >
            <option value={workOrderIdInfo.is_finished === true ? 'Завершено' : 'Не завершено'}>{workOrderIdInfo.is_finished === true ? 'Завершено' : 'Не завершено'}</option>
            <option value="true">Завершено</option>
            <option value="false">Не завершено</option>
          </select>

          <button type='submit' className={styles.button}>Завершить</button>
        </form>
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
            : <tr>
              Ожидаем
            </tr>
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

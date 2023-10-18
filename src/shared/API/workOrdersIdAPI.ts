import axios from "axios";
import { changeWorkOrderInterface, newWorkOrderInterface, tokenInterface } from "../Components/Main";


export async function axiosPutWorkOrderWithId(info: changeWorkOrderInterface, token: string | null, id: number) {
    // try {
    const response = await axios.put(`http://127.0.0.1:8000/api/v1/workorders/${id}/`,
        {
            number: info.number,
            start_date: info.start_date,
            material: {
                name: info.material.name,
            },
            product: {
                name: info.product.name,
            },
            is_finished: info.is_finished,
        },
        {
            headers: {
                Authorization: `Token ${token}`
            }
        }
    )
    return response;
    // } catch (error: any) {
    //     switch (error.code) {
    //         case 'ERR_BAD_REQUEST':
    //             alert('Данные не верны');
    //             break;
    //         case 'ERR_NETWORK':
    //             alert('Ошибка сервера');
    //             break;
    //         case 'ERR_CONNECTION_REFUSED':
    //             alert('Ошибка соединения с сервером');
    //             break;
    //         default:
    //             alert('Что-то пошло не так, повторите попытку');
    //             break;
    //     }
    // }
}
import axios from "axios";
import { tokenInterface } from "../Components/Main";

export async function axiosProducedProducts(id: any, token: any) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/workorders/${id}/products/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        return response;
    } catch (error: any) {
        switch (error.code) {
            case 'ERR_BAD_REQUEST':
                alert('Данные не верны');
                break;
            case 'ERR_NETWORK':
                alert('Ошибка сервера');
                break;
            case 'ERR_CONNECTION_REFUSED':
                alert('Ошибка соединения с сервером');
                break;
            default:
                alert('Что-то пошло не так, повторите попытку');
                break;
        }
    }
}
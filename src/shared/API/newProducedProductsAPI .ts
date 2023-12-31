import axios from "axios";
import { newProductInterface, tokenInterface } from "../Components/Main";

export async function axiosNewProducedProducts(id: number | string, token: string | null, newProduct: newProductInterface) {
    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/v1/workorders/${id}/products/`, newProduct, {
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
        switch (error.response.data.detail) {
            case 'У вас недостаточно прав для выполнения данного действия.':
                alert('У вас недостаточно прав для выполнения данного действия.');
                break;
        }
    }
}
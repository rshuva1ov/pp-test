import axios from "axios";


export async function axiosAuth(username: string, password: string) {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/api-token-auth/',
      {
        username: username, password: password,
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      }
    )
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
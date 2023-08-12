import {environment} from "../environments/environment";
import axios from 'axios';

export enum Method {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

function axiosOptions(method: Method, endpoint: string, body: {}) {
  const auth = localStorage.getItem('auth');

  return {
    method: method.toString(),
    url: environment.apiBaseUrl + '/' + endpoint,
    data: body,
    headers: auth ? {Authorization: `Bearer ${auth}`} : {}
  }
}

export async function useFetch(method: Method, endpoint: string, body: {}) {
  let error: null | string = null;

  const response = await axios(axiosOptions(method, endpoint, body)).catch(err => {
    error = String(err.response.data.message);
  });

  if (response?.data?.access_token)
    localStorage.setItem('auth', response.data.access_token);

  return { response, error }
}

export async function lostSession() {
  localStorage.removeItem('auth');
}

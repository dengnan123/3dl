import axios from 'axios';
import { API_HOST, getPreviewApiToken } from '../../config';
import { getLocaleMode } from '@/helpers/storage';

const API = axios.create({
  baseURL: API_HOST,
});

API.interceptors.request.use(config => {
  config.headers.lang = getLocaleMode();
  const token = getPreviewApiToken()
  if(token){
    config.headers.Authorization = getPreviewApiToken();
  }
  config.headers['DF-Account-ID'] = 1;
  config.headers['df-project-id'] = 1;
  config.headers['df-tenant-id'] = 1;
  return config;
});

API.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log('response..... error', error.message);
    return Promise.reject(error);
  },
);

export default API;

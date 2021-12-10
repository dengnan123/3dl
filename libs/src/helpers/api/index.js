import axios from 'axios';
import querystring from 'query-string'
// import { API_HOST } from '../../config';
// const server_port = process.env.NODE_ENV === 'production' ? window.location.port : 3001;
const API = axios.create({});

API.interceptors.request.use(config => {
  const { token = '' } = querystring.parse(window.location.search)

  if (token) {
    Object.assign(config.headers, { Authorization: token } )
  }
  return config;
});

API.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * HTTP Methods
 */
export const GET = 'GET'
export const POST = 'POST'
export const PATCH = 'PATCH'
export const PUT = 'PUT'
export const DELETE = 'DELETE'
export const OPTIONS = 'OPTIONS'
export const HEAD = 'HEAD'
export const TRACE = 'TRACE'
export const CONNECT = 'CONNECT'

export const HTTP_METHOD_LIST = [GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD, TRACE, CONNECT]

export default API;

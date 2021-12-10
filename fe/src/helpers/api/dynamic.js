import axios from 'axios';
// import querystring from 'query-string';
import { getLocaleMode } from '@/helpers/storage';
import { isObject } from 'lodash';
import {getPreviewApiToken} from '@/config'

const typeHash = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
};

export const API = headers => {
  const _API = axios.create({});
  _API.interceptors.request.use(config => {
    // const { token = '' } = querystring.parse(decodeURI(window.location.search));
    config.headers.lang = getLocaleMode();
    const token = getPreviewApiToken()
    if(token){
      config.headers.Authorization = getPreviewApiToken();
    }
    if (isObject(headers)) {
      config.headers = {
        ...config.headers,
        ...headers,
      };
    }
    if(isObject(headers.axiosConfig)){
      config = {
        ...config,
        ...headers.axiosConfig
      }
    }
    return config;
  });

  _API.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      console.log('dy response error message....', error.message);
      return Promise.reject(error);
    },
  );
  return _API;
};

export const dynamicAPIParams = ({ methodType, condition }) => {
  if (methodType === 'GET') {
    return {
      params: condition,
    };
  }
  return condition;
};

export default async function dynamicAPI({ dataApiUrl, condition, methodType, cusHeaders }) {
  const newType = typeHash[methodType];
  const newParams = dynamicAPIParams({
    methodType,
    condition,
  });
  return await API(cusHeaders)[newType](dataApiUrl, newParams);
}

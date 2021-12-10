import * as qs from 'query-string';
import { objectString } from './json';
import { isObject } from 'lodash';
import * as Agent from 'agentkeepalive';
const { HttpsAgent } = Agent;


export const getHostByUrl = inputUrl => {
  const keys = ['http://', 'https://'];
  const { url } = qs.parseUrl(inputUrl);
  for (const key of keys) {
    if (url.includes(key)) {
      const arr = url.split(key);
      if (arr.length === 2) {
        const newValue = arr[1];
        const data = newValue.split('/');
        if (data?.length) {
          return data[0];
        }
        return newValue;
      }
    }
  }
};


export const getHeaderData = ({ host, req, cusHeaders }) => {
  let hdata: any = {};
  hdata.Host = host;
  if (req.headers.Authorization) {
    hdata.Authorization = req.headers.Authorization;
  }
  if (isObject(cusHeaders)) {
    hdata = {
      ...hdata,
      ...cusHeaders,
    };
  }
  return hdata;
}

export const dealWithProxyUrl = ({ condition, dataApiUrl }) => {
  const strParams = objectString(condition);
  let newUrl = dataApiUrl;
  if (strParams) {
    newUrl = `${dataApiUrl}?${strParams}`;
  }
  const encodedURI = encodeURI(newUrl);
  return encodedURI
}

export const getAgent = ({ proxyUrl }) => {
  const opts = {
    maxSockets: 100,
    maxFreeSockets: 10,
    timeout: 60000,
    freeSocketTimeout: 30000,
  };
  const agent = proxyUrl.includes('https')
    ? new HttpsAgent(opts)
    : new Agent(opts);
  return agent
}
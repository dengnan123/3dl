import * as qs from 'query-string';
import { objectString } from './json';
import { isObject } from 'lodash';
import * as Agent from 'agentkeepalive';
import * as  Urlparse from 'url-parse'
const { HttpsAgent } = Agent;


export const getHostByUrl = inputUrl => {
  const { host } = Urlparse(inputUrl)
  return host
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
  if (!dataApiUrl) {
    return
  }
  const strParams = objectString(condition);
  let newUrl = dataApiUrl
  if (strParams) {
    newUrl = `${dataApiUrl}?${strParams}`;
  }
  const encodedURI = encodeURI(newUrl);
  console.log('proxyUrl------encodedURIencodedURI', encodedURI);
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
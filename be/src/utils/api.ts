// import * as  axios from 'axios';
// import querystring from 'query-string';


// // const server_port = process.env.NODE_ENV === 'production' ? window.location.port : 3001;
// const API = axios.create({
//   baseURL: API_HOST,
// });

// API.interceptors.request.use(config => {
//   const { token = '' } = querystring.parse(decodeURI(window.location.search));
//   config.headers.lang = getLocaleMode();
//   config.headers.Authorization = token;

//   config.headers['DF-Account-ID'] = 1;
//   config.headers['df-project-id'] = 1;
//   config.headers['df-tenant-id'] = 1;
//   return config;
// });

// API.interceptors.response.use(
//   response => {
//     return response.data;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

// export default API;
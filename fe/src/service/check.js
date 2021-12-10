import API from '../helpers/api';

export const buildTimeCheck = () => {
  return API.get(`/check`);
};

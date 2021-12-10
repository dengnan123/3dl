/* eslint-disable import/prefer-default-export */

export const pick = (obj, keys) => {
  const r = {};
  for (let i in keys) {
    const key = keys[i];
    r[key] = obj[key];
  }
  // keys.forEach(key => {
  //   r[key] = obj[key];
  // });
  return r;
};

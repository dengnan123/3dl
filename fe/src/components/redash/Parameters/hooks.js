export const hasKey = (arr = [], name) => {
  for (const v of arr) {
    if (v.name === name) {
      return true;
    }
  }
  return false;
};

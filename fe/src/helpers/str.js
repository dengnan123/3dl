export const getRegexValue = (str, left, right) => {
  const reg = new RegExp(`${left}(\\w+| )+${right}`, 'g');
  const arr = str.match(reg);
  if (!arr) {
    return [];
  }
  return arr.map(v => {
    const str1 = v.split(`${left}`)[1];
    return str1.split(`${right}`)[0].trim();
  });
};

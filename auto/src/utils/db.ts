export const switchFields = data => {
  const res = {
    ...data,
  };
  const keys = Object.keys(data);

  const upperCaseChars = getUpperCaseChars();

  for (const key of keys) {
    for (const upper of key) {
      if (upperCaseChars.includes(upper)) {
        const lowerCase = upper.toLowerCase();
        const newKey = key.replace(upper, `_${lowerCase}`);
        res[newKey] = res[key];
        delete res[key];
      }
    }
  }
  return res;
};

function getUpperCaseChars() {
  // 生成大写字母，A的Unicode值为65
  const str = [];
  for (let i = 65; i < 91; i++) {
    str.push(String.fromCharCode(i));
  }
  return str;
}

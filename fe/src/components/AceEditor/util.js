import { checkJsCode } from '@/helpers/screen';
import { isObject } from 'lodash';
export const validateJavascript = v => {
  const message = checkJsCode(v);
  return message;
};

export const validateJson = v => {
  try {
    JSON.parse(v);
  } catch (err) {
    return 'JSON 格式有误！！！';
  }
  return;
};

export const validateObj = {
  javascript: validateJavascript,
  json: validateJson,
};

export const validateFunc = (language, value) => {
  return validateObj[language] && validateObj[language](value);
};

export const javascriptCode = code => {
  return code;
};

export const modalCode = code => {
  return code;
};

export const jsonCode = code => {
  return JSON.parse(code);
};

export const codeObj = {
  javascript: javascriptCode,
  json: jsonCode,
};

export const dealWithCodeByLanguage = (language, value) => {
  return codeObj[language] && codeObj[language](value);
};

// import { reap } from '@/components/SafeReaper';
import ojectPath from 'object-path';

export const getFormFiledValue = ({ getFieldValue, key, data }) => {
  const formValue = getFieldValue(key);
  if (formValue !== undefined) {
    return formValue;
  }
  return data[key];
};

export const getFormDefValue = (propsData, form, key, defValue) => {
  const { getFieldValue } = form;
  const formValue = getFieldValue(key);
  if (formValue !== undefined) {
    return formValue;
  }
  return ojectPath.get(propsData, key, defValue || undefined);
  // return reap(propsData, key, defValue || undefined);
};

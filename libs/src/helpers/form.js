import { reap } from '../components/SafeReaper';

export const getFormDefValue = (propsData, form, key, defValue) => {
  const { getFieldValue } = form;
  const formValue = getFieldValue(key);
  if (formValue !== undefined) {
    return formValue;
  }
  return reap(propsData, key, defValue || undefined);
};

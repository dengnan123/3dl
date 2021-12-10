import { useRef } from 'react';
import { isEqual } from 'lodash';

export function useCompare(value, valueType = 'string') {
  let defaultValue;
  switch (valueType) {
    case 'number':
      defaultValue = 0;
      break;
    case 'string':
      defaultValue = '';
      break;
    case 'boolean':
      defaultValue = false;
      break;
    case 'array':
      defaultValue = [];
      break;
    case 'object':
      defaultValue = {};
      break;
    default:
      defaultValue = Symbol();
      break;
  }
  const ref = useRef(defaultValue);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

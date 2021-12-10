import { filterDataEs5Func } from '../../../helpers/compile';
import { isString, isFunction } from 'lodash';
export const getNewOptions = (props, opts) => {
  const { style } = props;
  if (style?.openOptionsFunc && style?.optionsFunc && isString(style.optionsFunc)) {
    return filterDataEs5Func({
      data: opts,
      filterFunc: style.optionsFunc,
      filterFuncEs5Code: style.optionsFuncEs5Code,
    });
  }
  if (style?.openOptionsFunc && style?.optionsFunc && isFunction(style.optionsFunc)) {
    return style.optionsFunc(opts);
  }
  return opts;
};

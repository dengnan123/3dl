import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { filterDataEs5Func } from '../../../../helpers/compile';
/**
 * 监听数据源是否变化
 */
function WatchDataChange(props) {
  const { onChange, style, data } = props;

  const openEqualFunc = style?.openEqualFunc ?? false;
  const equalFunc = style?.equalFunc;
  const equalFuncEs5Code = style?.equalFuncEs5Code;

  const dataRef = useRef(data);
  const onChangeRef = useRef(() => {});

  onChangeRef.current = onChange;

  useEffect(() => {
    let equal = false;
    if (openEqualFunc && equalFunc) {
      equal = filterDataEs5Func({
        data: { prevData: dataRef.current, currentData: data },
        filterFunc: equalFunc,
        filterFuncEs5Code: equalFuncEs5Code,
      });
    } else {
      equal = isEqual(dataRef.current, data);
    }

    if (!equal) {
      dataRef.current = data;
      onChangeRef.current && onChangeRef.current();
    }
  }, [data, equalFunc, equalFuncEs5Code, openEqualFunc]);

  return null;
}

WatchDataChange.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.any,
};

export default WatchDataChange;

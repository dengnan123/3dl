import { sortBy } from 'lodash';
import { DataFormatTypeFuncEnum } from './index';

export const getTableDataSource = (data, keys = []) => {
  if (!keys || !keys.length) {
    return data;
  }
  const dataMap = data.map((i, index) => {
    return { ...i, id: i.id || index };
  });
  // data排序
  const sortData = sortBy(dataMap, keys);

  let keysGroup = {};
  sortData.forEach(item => {
    let prevKey = null;
    for (let k of keys) {
      if (!prevKey) {
        prevKey = item[k];
      } else {
        prevKey = `${prevKey}-${item[k]}`;
      }
      let currentGroups = keysGroup[k] || {};
      if (currentGroups[prevKey]) {
        currentGroups[prevKey].push(item);
      } else {
        currentGroups[prevKey] = [item];
      }
      keysGroup[k] = currentGroups;
    }
  });

  // console.log(keysGroup, '====keysGroup')

  const dataList = sortData.map(item => {
    let newItem = item;
    let currentKey = null;
    for (let k of keys) {
      if (!currentKey) {
        currentKey = item[k];
      } else {
        currentKey = `${currentKey}-${item[k]}`;
      }

      let currentValue = keysGroup[k][currentKey];
      if (!currentValue || currentValue.length < 2) {
        continue;
      }
      const len = currentValue.length;
      if (newItem.id === currentValue[0].id) {
        newItem[`${k}_rowSpan`] = len;
      } else {
        newItem[`${k}_rowSpan`] = 0;
      }
    }
    return newItem;
  });

  // console.log(dataList, '==========dataList')
  return dataList;
};

export const getTableColumns = (cols, keys = []) => {
  const setColumns = arr => {
    const newArr = arr.map(i => {
      const { name } = i;
      if (i.children) {
        return {
          title: i.name,
          children: setColumns(i.children),
        };
      }
      if (keys.includes(name)) {
        return {
          title: name,
          dataIndex: name,
          render: (text, row, index) => {
            const obj = {
              children: text,
              props: {},
            };
            const rowSpan = row[`${name}_rowSpan`];
            if (rowSpan || rowSpan === 0) {
              obj.props.rowSpan = rowSpan;
            }
            return obj;
          },
        };
      }
      return {
        title: name,
        dataIndex: name,
      };
    });
    return newArr;
  };

  const columns = setColumns(cols);

  return columns;
};

export function formatQueryDataToTable({ queryData, columns = [], groupBy = [] }) {
  const rows = queryData?.rows || [];
  const finalColumns = getTableColumns(columns, groupBy);
  const dataSource = getTableDataSource(rows, groupBy);

  return {
    columns: finalColumns,
    dataSource,
  };
}

export function formatDataToTable({ rows = [], columns = [], groupBy = [] }) {
  const finalColumns = getTableColumns(columns, groupBy);
  const dataSource = getTableDataSource(rows, groupBy);
  return {
    columns: finalColumns,
    dataSource,
  };
}

/**
 * 通过 gData 和 gDataHash 格式化 columns 列表
 * @param {object} opts
 * @param {array} opts.gData
 * @param {object} opts.gDataHash
 * @returns {array} columns
 */
export function formatColumnsByGData(opts) {
  const gData = opts?.gData || [];
  const gDataHash = opts?.gDataHash || {};
  const _columns = loop(gData);

  return _columns || [];

  function loop(data) {
    return data?.map(n => {
      const { key, children } = n || {};
      const { title, dataIndex, dataFormatType, isGroup, ...restProps } = gDataHash?.[key] || {};
      const obj = { ...restProps, title: title ?? dataIndex, dataIndex };
      // 如果选择了格式化类型，添加 render 函数
      if (dataFormatType) {
        obj.render = DataFormatTypeFuncEnum[dataFormatType];
      }
      if (children && !!children?.length) {
        obj.children = loop(children);
      }
      return obj;
    });
  }
}

import { useEffect, useState } from 'react';
import { Parser } from 'node-sql-parser';
import { Input } from 'antd';

import styles from './index.less';

const parser = new Parser();

const opt = {
  database: 'MySQL',
};

const FieldsMap = ({ form, fieldsMap, setFieldsMap }) => {
  const { getFieldValue } = form;
  const queryString = getFieldValue('query');

  const [keysArr, setArr] = useState([]);

  useEffect(() => {
    if (!queryString) return;
    const sqlS = generateSql(queryString, {});
    try {
      const ast = parser.astify(sqlS, opt);
      const columns = ast?.columns;
      let arr = [];
      if (Array.isArray(columns)) {
        arr = columns
          .map(column => {
            const { as, expr } = column;
            if (as) {
              return as;
            }
            if (expr) {
              return expr.column;
            }
            return undefined;
          })
          .filter(item => item !== undefined);
      }
      setArr(arr);
    } catch (err) {
      console.log(err, '===err');
    }
  }, [queryString]);

  const onInputChange = (e, key) => {
    const currentValue = e?.target?.value;
    let fields = { ...fieldsMap };
    fields[key] = { as: currentValue };
    setFieldsMap(fields);
  };

  // console.log(keysArr, '===keysArr', fieldsMap);
  return (
    <div className={styles.fieldsContent}>
      {keysArr.map((key, index) => {
        const itemField = fieldsMap[key];
        const value = itemField?.as || null;
        return (
          <div key={`${key}-${index}`}>
            <span>{key}</span>
            <span>
              <Input placeholder="映射名称" value={value} onChange={e => onInputChange(e, key)} />
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FieldsMap;

// function querySelectKey(sqlString) {
//   if (!sqlString) {
//     return [];
//   }
//   if (!(sqlString.startsWith('select') || sqlString.startsWith('SELECT'))) {
//     return [];
//   }
//   const string = sqlString.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ');
//   let splitKey = ' from';
//   const lowerCaseIndex = string.indexOf(' from');
//   const capitalIndex = string.indexOf(' FROM');
//   // console.log(lowerCaseIndex, 'lowerCaseIndex===capitalIndex', capitalIndex);
//   if (lowerCaseIndex < 0 && capitalIndex < 0) {
//     return [];
//   }
//   if (lowerCaseIndex < 0) {
//     splitKey = ' FROM';
//   }
//   const splitForm = string.split(splitKey)[0];
//   const splitSelect = splitForm
//     .slice(6)
//     .split(',')
//     .filter(i => !!i);

//   return splitSelect.map(i => {
//     if (i.includes(' as ')) {
//       return i.split(' as ')[0].trim();
//     }
//     return i.trim();
//   });
// }

const generateSql = (tempQuery, parameters) => {
  if (!tempQuery) {
    return;
  }
  const arr = getRegexValue({
    str: tempQuery,
    parameters,
  });
  console.log('rep arr', arr);
  const newQuery = regexMapReplace(tempQuery, arr);
  return newQuery;
};

const getRegexValue = ({ str, left = '{{', right = '}}', parameters }) => {
  const reg = new RegExp(`${left}(\\w+| )+${right}`, 'g');
  const arr = str.match(reg);
  if (!arr) {
    return [];
  }
  return arr.map(v => {
    return {
      match: v,
      replace: '123',
    };
  });
};

const regexMapReplace = (str, map) => {
  map.forEach(function(err, regexItem) {
    str = str.replace(map[regexItem].match, map[regexItem].replace);
  });
  return str;
};

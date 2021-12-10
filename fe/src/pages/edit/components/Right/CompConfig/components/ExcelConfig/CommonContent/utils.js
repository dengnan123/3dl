import { v4 as uuid } from 'uuid';
import XLSX from 'xlsx';
import { ChartCompNameEnums, ChartTypeEnums } from '../const';

/**
 * excel数据转换为table数据
 * @param {Array<Array>} jsonArr
 */
export function excelToTableData(jsonArr = [], compName) {
  const header = jsonArr[0];
  const data = [...jsonArr].splice(2, jsonArr.length);
  let dataSource = [];
  // 判断表头最后一列是不是图表类型字段
  const lastColIstype = header[header.length - 1] === '图表类型';
  if (!lastColIstype) {
    // 模板格式错误
    throw new Error('模板格式错误');
  }
  const categories = [...jsonArr[1]].splice(1, header.length - 1);
  // 数据长度
  const dataLength = categories.length;
  dataSource = data.map(arr => {
    const name = arr[0];
    const data = [...arr].slice(1, dataLength + 1).map(n => {
      if (isNaN(Number(n))) {
        throw new Error('Y轴数据格式错误，必须是数字');
      }
      return { name: '', value: n };
    });
    let type = arr[arr.length - 1] || ChartTypeEnums[compName];
    type = type.trim().toLowerCase();
    if (compName === ChartCompNameEnums.LineAndBar) {
      if (![ChartTypeEnums.Line, ChartTypeEnums.Bar].includes(type)) {
        throw new Error('模板格式错误，请检查图表类型字段');
      }
    }
    type = compName !== ChartCompNameEnums.LineAndBar ? ChartTypeEnums[compName] : type;
    console.log('type', type);
    console.log('compName', compName);

    return { id: uuid(), name, data, type };
  });

  return { categories, dataSource };
}

/**
 * table数据转换为mockData
 */
export function tableDataToMockdata({ dataSource = [], categories = [] }) {
  const series = dataSource.map(n => ({ type: n.type, name: n.name, data: n.data }));
  return { categories, series };
}

/**
 * mockData转换为table数据
 */
export function mockdataToTableData(mockData, compName) {
  const categories = mockData?.categories || [];
  const series = mockData?.series || [];
  const dataSource = series.map(n => {
    let type = '';
    type = n.type || ChartTypeEnums[compName];
    const data = n?.data?.map(m => {
      if (m instanceof Object) {
        return m;
      }
      return { name: '', value: m };
    });
    return { id: uuid(), ...n, data, type };
  });

  return { categories, dataSource };
}

/**
 * 获取excel列坐标code
 * @param {number} index 列index，从0开始算
 */
export function getSheetStartCode(index) {
  return XLSX.utils.encode_col(index);
}
/**
 * mockData数据转换为excel数据
 */
export function downloadExcelByMockData({ mockData, filename = 'chart' }) {
  const categories = mockData?.categories || [];
  const series = (mockData?.series || []).map(n => {
    const data = n?.data?.map(m => {
      if (m instanceof Object) {
        return m;
      }
      return { name: '', value: m };
    });
    return { ...n, data };
  });
  // Excel文件名称
  filename = `${filename}.xlsx`;

  // 数据维度坐标
  const dataTypeStartAndEnd = {
    s: {
      // s开始
      c: 0, // 开始列
      r: 0, // 开始取值范围
    },
    e: {
      // e结束
      c: 0, // 结束列
      r: 1, // 结束范围
    },
  };

  // 数据坐标
  const dataStartAndEnd = {
    s: {
      // s开始
      c: 1, // 开始列
      r: 0, // 开始取值范围
    },
    e: {
      // e结束
      c: categories.length, // 结束列
      r: 0, // 结束范围
    },
  };

  // 图表类型坐标
  const chartTypeStartAndEnd = {
    s: {
      // s开始
      c: categories.length + 1, // 开始列
      r: 0, // 开始取值范围
    },
    e: {
      // e结束
      c: categories.length + 1, // 结束列
      r: 1, // 结束范围
    },
  };
  // 图表类型起点坐标
  const chartTypeStartCode = getSheetStartCode(categories.length + 1);

  // 数据头
  const headers = {
    A1: { v: '数据维度' },
    B1: { v: '数据' },
    [`${getSheetStartCode(categories.length + 1)}1`]: { v: '图表类型' },
  };

  (categories || []).forEach((n, i) => {
    const startCode = getSheetStartCode(i + 1);
    headers[`${startCode}2`] = { v: n };
  });

  // 数据正文
  const datas = {};

  (series || []).forEach((n, i) => {
    const data = n?.data || [];
    let startCode = '';
    const rowIndex = i + 3;

    datas[`A${rowIndex}`] = { v: n.name };
    datas[`${chartTypeStartCode}${rowIndex}`] = { v: n.type };
    data.forEach((m, j) => {
      startCode = getSheetStartCode(j + 1);
      datas[`${startCode}${rowIndex}`] = { v: m.value };
    });
  });

  // 合并 headers 和 data
  const output = Object.assign({}, headers, datas);
  // 最后一行index，从0开始算
  const endRowIndex = series.length + 1;
  // 表格范围，范围越大生成越慢
  const ref = `A1:${chartTypeStartCode}${endRowIndex}`;
  // 构建 workbook 对象
  var wb = {
    SheetNames: ['Sheet1'],
    Sheets: {
      // Sheet1 表示工作簿名称
      Sheet1: Object.assign({}, output, {
        '!ref': ref,
        // 合并
        '!merges': [dataTypeStartAndEnd, dataStartAndEnd, chartTypeStartAndEnd],
      }),
    },
  };
  // 写出Excel工作簿
  XLSX.writeFile(wb, filename);
}

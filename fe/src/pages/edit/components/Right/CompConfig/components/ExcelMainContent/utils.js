import XLSX from 'xlsx';

export const ChartTypeEnums = {
  Line: 'line',
  Bar: 'bar',
  Pie: 'pie',
  RadarChart: 'radar',
};

const charCodeInit = 65;

export function setInitialMockDataToTable(mockData, compName, isImport) {
  const standarMock = getStandardMockData(mockData, compName, isImport);
  let rowsArr = [];
  let tableData = commonMockdataToTableData(standarMock);
  for (let i = 1; i <= 9; i++) {
    const row = {
      rowId: i,
    };
    let others = tableData[i - 1];
    rowsArr.push({ ...row, ...others });
  }
  return rowsArr;
}

/**** 将Mock数据转换成Table数据 ****/
export function commonMockdataToTableData(mockData) {
  const categories = mockData?.categories || [];
  const series = mockData?.series || [];

  const categoriesLength = categories.length + 1;
  const categoriesData = ['', ...categories];

  let tableData = getSeriesRow(series, categoriesLength) || {};
  tableData[0] = { ...getFirstRow(categoriesData), rowkey: 'dataType' };

  return tableData;
}

/**** 将Table数据转换成Mock数据 ****/
export function tableDataToMock(currentMock, initData) {
  const { mockData, compName } = initData;
  let valueKeys = [];
  let categories = [];
  let categoriesObject = {};
  // 设置categories
  let firstRow = { ...currentMock[0] };
  delete firstRow.A;
  delete firstRow.rowId;
  delete firstRow.rowkey;
  let categoriesKeys = Object.keys(firstRow);

  for (let k of categoriesKeys) {
    if (!!firstRow[k]) {
      categories.push(firstRow[k]);
      valueKeys.push(k);
      categoriesObject[k] = firstRow[k];
    }
  }

  const seriesArr = currentMock.filter(d => !!d.A);
  if (compName === 'RadarChart') {
    const indicator = categories.map(i => {
      return { name: i };
    });
    const newSeries = getRadarMocks(seriesArr, valueKeys, mockData?.series);

    return { indicator, series: newSeries };
  }

  if (compName === 'Pie') {
    const newSeries = getPieTableMocks(seriesArr, valueKeys, categoriesObject);
    return { categories: [], series: newSeries };
  }

  const newSeries = seriesArr.map(s => {
    let echartData = [];
    for (let k of valueKeys) {
      echartData.push(s[k] || 0);
    }
    return { name: s.A, type: s.type || 'bar', data: echartData };
  });

  return { series: newSeries, categories };
}

function getRadarMocks(data = [], valueKeys, prevSeries) {
  const dataArr = data.map(s => {
    let echartData = [];
    for (let k of valueKeys) {
      echartData.push(s[k] || 0);
    }
    return { name: s.A, value: echartData };
  });
  const prevSeriesFirst = prevSeries[0] || {};
  const newSeries = [
    {
      ...prevSeriesFirst,
      data: dataArr,
    },
  ];
  return newSeries;
}

function getPieTableMocks(seriesArr = [], valueKeys, categoriesObject) {
  const newSeries = seriesArr.map(s => {
    let echartData = [];
    for (let k of valueKeys) {
      if (typeof s[k] === 'number') {
        echartData.push({ value: s[k] || 0, name: categoriesObject[k] });
      }
    }
    return { name: s.A, type: s.type || 'bar', data: echartData };
  });
  return newSeries;
}

/**
 * excel数据转换为table数据 导入数据
 * @param {Array<Array>} jsonArr
 */
export function excelToTableData(jsonArr = [], compName) {
  const header = jsonArr[0];
  const data = [...jsonArr].splice(2, jsonArr.length);
  // 判断表头最后一列是不是图表类型字段
  const lastColIstype = header[header.length - 1] === '图表类型';
  if (!lastColIstype) {
    // 模板格式错误
    throw new Error('模板格式错误');
  }

  // return;
  const categories = [...jsonArr[1]].splice(1, header.length - 1);
  // 数据长度
  const dataLength = categories.length;
  const dataSource = data.map(arr => {
    let type = arr[arr.length - 1] || ChartTypeEnums[compName];
    type = type.trim().toLowerCase();

    const name = arr[0];
    let itemData = [];
    if (type !== 'pie') {
      itemData = [...arr].slice(1, dataLength + 1).map(n => {
        if (isNaN(Number(n))) {
          throw new Error('Y轴数据格式错误，必须是数字');
        }
        return n;
      });
    } else {
      for (let i = 0; i < dataLength; i++) {
        const _val = arr[i + 1];
        if (!_val && _val !== 0) {
          continue;
        }
        itemData.push({ value: arr[i + 1], name: categories[i] });
      }
    }

    if (compName === 'LineAndBar') {
      if (![ChartTypeEnums.Line, ChartTypeEnums.Bar].includes(type)) {
        throw new Error('模板格式错误，请检查图表类型字段');
      }
    }
    type = compName !== 'LineAndBar' ? ChartTypeEnums[compName] : type;
    return { name, data: itemData, type };
  });

  const jsonStandarMockData = { categories, series: dataSource };
  //转成table data
  const tableData = setInitialMockDataToTable(jsonStandarMockData, compName, true);

  return tableData;
}

/**
 * mockData数据转换为excel数据
 */
export function downloadExcelByMockData({ mockData, filename = 'chart' }) {
  const standarMock = getStandardMockData(mockData, filename) || {};
  const categories = standarMock?.categories || [];
  const series = (standarMock?.series || []).map(n => {
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
  const endRowIndex = series.length + 2;
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

/**
 * 根据compName返回通用的mockData
 */
const getStandardMockData = (mock, compName, isImport) => {
  if (compName === 'RadarChart') {
    let indicator = isImport ? mock?.categories : mock?.indicator;
    const categories = indicator.map(i => {
      return i.name ? i.name : i;
    });
    const radarSeries = isImport ? mock?.series : mock?.series[0]?.data;
    const dataList = (radarSeries || []).map(i => {
      return {
        name: i.name,
        data: i.value ? i.value : i.data,
        type: 'radar',
      };
    });
    return { categories, series: dataList };
  }

  if (compName === 'Pie') {
    let pieSeries = mock?.series;
    let _categories = getPieChartMocks(mock);
    const dataList = (pieSeries || []).map(i => {
      const initData = i.data || [];
      let _data = [];
      for (let v of _categories) {
        const _v = initData.find(i => i.name === v) || {};
        if (_v) {
          _data.push(_v.value);
        } else {
          _data.push(undefined);
        }
      }
      return {
        ...i,
        name: i.name,
        data: _data,
        type: 'pie',
      };
    });
    return { categories: _categories, series: dataList };
  }
  return mock;
};

/**** 其他数据处理 ****/
const getFirstRow = arr => {
  let row = {};
  for (let c = 0; c <= arr.length; c++) {
    const colKey = String.fromCharCode(c + charCodeInit);
    row[colKey] = arr[c];
  }

  return row;
};

const getSeriesRow = (seriesArr, maxLength) => {
  let rows = {};
  for (let i in seriesArr) {
    const seriesItem = seriesArr[i];
    const { name, data, type } = seriesItem;
    let dataObj = {};
    for (let c = 1; c < maxLength; c++) {
      const colKey = String.fromCharCode(c + charCodeInit);
      const dataItem = data[c - 1];
      dataObj[colKey] = dataItem;
      if (dataItem instanceof Object) {
        dataObj[colKey] = dataItem?.value;
      }
    }
    const key = Number(i) + 1;
    rows[key] = { type, A: name, ...dataObj, rowkey: 'data' };
  }
  return rows;
};

/**
 * 获取excel列坐标code
 * @param {number} index 列index，从0开始算
 */
function getSheetStartCode(index) {
  return XLSX.utils.encode_col(index);
}

/**
 * 获取Pie图的图例
 */
const getPieChartMocks = mock => {
  const { series } = mock || {};
  let seriesData = [];
  let _categories = [];
  for (let s of series) {
    const { data } = s;
    if (data) {
      seriesData = [...seriesData, ...data];
    }
  }

  for (let i = 0; i < seriesData.length; i++) {
    const item = seriesData[i];
    if (!item.name || _categories.includes(item.name)) {
      continue;
    }
    _categories.push(item.name);
  }
  return _categories;
};

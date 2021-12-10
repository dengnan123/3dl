import { isNumber } from 'lodash';

/**
 * echarts type
 * @enum
 */
export const EchartTypeByCompName = {
  Bar: 'bar',
  Line: 'line',
  LineAndBar: 'bar',
  Pie: 'pie',
};

export function formatQueryDataToEchart({ queryData, xColumn, yColumn = [], groupBy, compName }) {
  try {
    if (!xColumn || !yColumn?.length || !queryData) {
      throw new Error('数据错误');
    }

    // 图例
    const legend = getLegend({ queryData, yColumn, groupBy });
    // x轴列表
    const categories = getCategories({ queryData, xColumn });

    const series = getSeries({
      legend,
      compName,
      queryData,
      groupBy,
      categories,
      xColumn,
      yColumn,
    });

    return {
      categories,
      series,
    };
  } catch (err) {
    return {
      categories: [],
      series: [],
      dataError: err,
    };
  }
}

export function getLegend(opts = {}) {
  const { queryData, yColumn = [], groupBy } = opts;

  let legend = [...yColumn];

  const rows = queryData?.rows || [];

  const legendKeyObj = {};

  if (groupBy) {
    rows.forEach(row => {
      const value = row?.[groupBy];
      if ([undefined, null].includes(value)) {
        return;
      }
      legendKeyObj[value] = true;
    });

    legend = Object.keys(legendKeyObj);
  }

  return legend;
}

export function getCategories({ queryData, xColumn }) {
  // x轴列表
  let categories = [];

  const rows = queryData?.rows || [];

  if (!xColumn) {
    return categories;
  }

  categories = rows.map(n => n?.[xColumn]).sort((a, b) => a - b);
  categories = [...new Set(categories)];

  return categories;
}

export function getSeries({ legend, compName, queryData, groupBy, categories, xColumn, yColumn }) {
  const series = legend.map(name => {
    const chartType = EchartTypeByCompName[compName];
    const currentRows =
      queryData?.rows?.filter(row => {
        if (groupBy) {
          return row?.[groupBy] === name;
        }
        return true;
      }) || [];
    const data = categories.map(xValue => {
      const findRow = currentRows.find(row => row?.[xColumn] === xValue);
      const values = yColumn.map(y => findRow?.[y] || 0);
      let value = values.reduce((total, current) => total + Number(current), 0);
      if (!isNumber(value)) {
        value = null;
      }
      return { name: xValue, value };
    });

    const seriesItem = { name, type: chartType, data };

    return seriesItem;
  });

  return series || [];
}

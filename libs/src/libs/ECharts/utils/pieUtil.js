import { reap } from '../../../components/SafeReaper';
import { cloneDeep } from 'lodash';
import { formatterFunc, getTooltip, getGraphColor, getGird, getToolboxOpt } from './basicUtil';
import { getPercentOrPx } from '../util';

export const pieOpt = ({ categories = [], series = [], option = {} }) => {
  const newSeries = getPieSeries(series, option);
  const optL = getPieLegend(categories, option.legend, series);
  const grid = getGird(option.grid);
  const title = option.title;
  const color = getGraphColor(option);
  const tooltip = getTooltip(option);
  const toolbox = getToolboxOpt(option);

  let initData = {
    title,
    grid,
    legend: { ...optL },
    series: newSeries,
    color,
    tooltip,
    toolbox,
  };

  return initData;
};

function getPieSeries(series, option) {
  const optSeries = reap(option, 'series', {});
  const emphasis = getEmphasis(option);
  const roseType = reap(optSeries, 'roseType', false);
  const showLabel = reap(optSeries, 'showLabel', true);
  const labelPosition = reap(optSeries, 'labelPosition', 'inside');
  const labelFontSize = reap(optSeries, 'labelFontSize', 12);
  const labelFontColor = reap(optSeries, 'labelFontColor');
  const LabelFormatter = reap(optSeries, 'LabelFormatter', '{a}\n {d}%');
  let _opt = {
    type: 'pie',
    label: {
      color: labelFontColor,
      fontSize: labelFontSize,
      show: showLabel,
      position: labelPosition,
      formatter: LabelFormatter,
    },
  };

  if (roseType) {
    _opt['roseType'] = 'radius';
  }

  const curOptSeries = reap(optSeries, 'series', []);

  const optCenter = reap(curOptSeries, 'center', ['50%', '50%']);
  const center = [getPercentOrPx(optCenter[0]), getPercentOrPx(optCenter[1])];

  const _series = series.map((v, index) => {
    const optSeriesData = reap(curOptSeries[index], 'data', []);
    const data = v.data.map((d, i) => ({ ...d, ...optSeriesData[i] }));
    const radius = [
      `${reap(curOptSeries[index], 'radius[0]', 0)}%`,
      `${reap(curOptSeries[index], 'radius[1]', 100)}%`,
    ];

    return {
      center,
      ...v,
      ..._opt,
      radius,
      emphasis,
      data,
    };
  });

  return _series;
}

function getPieLegend(categories, optL = {}, series) {
  let seriesData = [];
  let _categories = [...categories];
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

  const data = _categories.map(v => {
    const value = {
      name: v,
    };
    const icon = reap(optL, `data.icon`, '');
    if (icon) {
      value.icon = `path://${icon}`;
    }
    return value;
  });
  let legend = {
    ...optL,
  };
  const formatter = reap(optL, `formatter`, null);

  if (formatter) {
    // eslint-disable-next-line no-new-func
    legend.formatter = params => {
      return formatterFunc(params, formatter);
    };
  }
  legend.data = data;
  if (legend.position === 'top') {
    legend.top = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'left') {
    legend.left = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'right') {
    legend.right = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'bottom') {
    legend.bottom = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  return legend;
}

function getEmphasis(opts) {
  const emphasis = reap(opts, 'emphasis', {});
  const label = reap(emphasis, 'label', {});

  let newEmphasis = cloneDeep(emphasis);
  const newLabel = cloneDeep(label);
  const formatter = reap(newLabel, `formatter`, null);

  newLabel.formatter = params => {
    try {
      return formatterFunc(params, formatter);
    } catch (err) {
      console.log(err.message);
    }
  };

  newEmphasis = {
    ...emphasis,
    label: { ...newLabel },
  };

  return newEmphasis;
}

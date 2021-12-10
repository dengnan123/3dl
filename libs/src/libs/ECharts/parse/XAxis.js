import objectPath from 'object-path';
import _ from 'lodash';

const parseInterval = v => {
  if (v === 'auto') {
    return v;
  }
  if (_.isNumber(parseInt(v))) {
    return parseInt(v);
  }
  return 'auto';
};

const toEcharts = {
  'axisLabel.interval': v => {
    return parseInterval(v);
  },
  'axisTick.interval': v => {
    return parseInterval(v);
  },
};

const toConfig = {};

export const parseConfigToEcharts = (opt = {}) => {
  let _opt = _.cloneDeep(opt);
  for (const key in toEcharts) {
    const initValue = objectPath.get(_opt, key);
    if (initValue) {
      const nowValue = toEcharts[key](initValue);
      objectPath.set(_opt, key, nowValue);
    }
  }
  return _opt;
};

export const parseEchartsToConfig = (opt = {}) => {
  let _opt = _.cloneDeep(opt);
  for (const key in toConfig) {
    const initValue = objectPath.get(_opt, key);
    if (initValue) {
      const nowValue = toConfig[key](initValue);
      objectPath.set(_opt, key, nowValue);
    }
  }
  return _opt;
};

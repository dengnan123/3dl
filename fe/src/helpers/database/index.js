import moment from 'dayjs';
import { thousandsDigitFormat } from '@/helpers/windowUtil';
import { formatQueryDataToEchart } from './echart';
import { formatQueryDataToTable } from './table';

/**
 * 格式化数据类型
 * @enum
 */
export const DataFormatTypeEnum = {
  YYYYMMDDhhmm: 'YYYY/MM/DD hh:mm',
  ThousandsDigitFormat: 'thousandsDigitFormat',
};

/**
 * 格式化数据类型名称
 * @enum
 */
export const DataFormatTypeLabelEnum = {
  /** 日期格式 */
  [DataFormatTypeEnum.YYYYMMDDhhmm]: '时间（YYYY/MM/DD hh:mm）',
  [DataFormatTypeEnum.ThousandsDigitFormat]: '千分位',
};

/**
 * 格式化数据类型名称
 * @enum
 */
export const DataFormatTypeFuncEnum = {
  /** 日期格式 */
  [DataFormatTypeEnum.YYYYMMDDhhmm]: text =>
    moment(text).isValid() ? moment(text).format('YYYY/MM/DD HH:mm') : text,
  [DataFormatTypeEnum.ThousandsDigitFormat]: thousandsDigitFormat,
};

export const FormatFuncEnum = {
  Bar: formatQueryDataToEchart,
  Line: formatQueryDataToEchart,
  LineAndBar: formatQueryDataToEchart,
  Pie: formatQueryDataToEchart,
  AntdTable: formatQueryDataToTable,
};

export function formatQueryData(opts) {
  const compName = opts?.compName;
  const formatFunc = FormatFuncEnum[compName];
  return formatFunc && formatFunc(opts);
}

import moment from 'moment';

/**
 * 时间格式 年-月-日 时:分:秒 YYYY-MM-DD HH:mm:ss
 * @constant
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 时间格式 年-月-日 时:分  YYYY-MM-DD HH:mm
 * @constant
 */
export const DATE_MINUTE_FORMAT = 'YYYY-MM-DD HH:mm';

/**
 * 时间格式 时:分:秒  HH:mm:ss
 * @constant
 */
export const TIME_FORMAT = 'HH:mm:ss';
/**
 * 时间格式 时:分  HH:mm
 * @constant
 */
export const TIME_MINUTE_FORMAT = 'HH:mm';

/**
 * RangePicker 的ranges属性
 * @constant
 */
export const RANGE_PICKER_RANGES = {
  今天: [moment().startOf('day'), moment().endOf('days')],
  昨天: [
    moment()
      .subtract(1, 'days')
      .startOf('day'),
    moment()
      .subtract(1, 'days')
      .endOf('days'),
  ],
  本周: [moment().startOf('week'), moment().endOf('week')],
  本月: [moment().startOf('month'), moment().endOf('month')],
};

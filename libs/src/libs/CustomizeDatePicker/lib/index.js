import PropTypes from 'prop-types';
import { useState, useCallback, useRef } from 'react';
import { useDeepCompareEffect } from 'react-use';
import moment from 'moment';
import 'moment/locale/zh-cn';
import classnames from 'classnames';
import { getNameByLang } from '../../../helpers/lang';
import { DatePicker, TimePicker } from 'antd';

import styles from './index.less';
import { getValueByType, useChange } from './hooks';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const pickers = {
  DatePicker: DatePicker,
  MonthPicker: MonthPicker,
  RangePicker: RangePicker,
  WeekPicker: WeekPicker,
  TimePicker: TimePicker,
};

const CustomizeDatePicker = props => {
  const {
    style: {
      pickerType = 'DatePicker',
      pickerSize = 'default',
      timeColor = '#424242',
      timeBorderColor = '#d9d9d9',
      transparent = false,
      startPlaceholder = '请选择日期',
      startPlaceholderEn = 'Select date',
      endPlaceholder = '请选择日期',
      endPlaceholderEn = 'Select date',
      allowClear,
      autoFocus,
      format,
      showTime = false,
      showToday = false,
      disabledDateFunc,
      defaultValue,
      initOnChange = true,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
    },
    shouldClearParams,
    otherCompParams = {},
    data,
    lang = 'zh-CN',
  } = props;

  const [value, setValue] = useState();
  useDeepCompareEffect(() => {
    if (!data) {
      return;
    }
    setValue(data);
  }, [data]);
  const cahceDataRef = useRef();
  cahceDataRef.current = props;

  const handleChange = useCallback(value => {
    const {
      style: { pickerType, startTimeKey, endTimeKey },
      onChange,
    } = cahceDataRef.current;
    if (pickerType === 'RangePicker') {
      onChange &&
        onChange({
          [startTimeKey]: moment(value[0]).valueOf(),
          [endTimeKey]: moment(value[1]).valueOf(),
        });
      return;
    }
    onChange && onChange({ [startTimeKey]: moment(value).valueOf() });
  }, []);

  const outsideChangeValue = useCallback(
    value => {
      console.log('Set new date from outside:', value);
      const {
        style: { pickerType },
      } = cahceDataRef.current;
      const newV = getValueByType(value, pickerType);
      setValue(newV);
      handleChange(newV);
    },
    [handleChange],
  );

  const onPickerChange = useCallback(
    value => {
      setValue(value);
      handleChange(value);
    },
    [handleChange],
  );

  useChange({
    defaultValue,
    otherCompParams,
    setValue,
    onPickerChange,
    shouldClearParams,
    pickerType,
    outsideChangeValue,
    initOnChange,
    lang,
    data,
  });

  const Picker = pickers[pickerType];
  const placeholder =
    pickerType !== 'RangePicker'
      ? getNameByLang(lang, startPlaceholder, startPlaceholderEn)
      : [
          getNameByLang(lang, startPlaceholder, startPlaceholderEn),
          getNameByLang(lang, endPlaceholder, endPlaceholderEn),
        ];

  const lastValue = getValueByType(value, pickerType);

  return (
    <Picker
      className={classnames(styles.picker, { [styles.transparent]: transparent })}
      style={{ color: timeColor, borderColor: timeBorderColor }}
      size={pickerSize}
      placeholder={placeholder}
      value={lastValue}
      allowClear={allowClear}
      autoFocus={autoFocus}
      format={format}
      showTime={showTime}
      showToday={showToday}
      onChange={onPickerChange}
      getCalendarContainer={triggerNode => triggerNode}
      disabledDate={disabledDateFunc}
      disabledHours={disabledHours}
      disabledMinutes={disabledMinutes}
      disabledSeconds={disabledSeconds}
      hourStep={hourStep}
      minuteStep={minuteStep}
      secondStep={secondStep}
    />
  );
};

CustomizeDatePicker.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default CustomizeDatePicker;

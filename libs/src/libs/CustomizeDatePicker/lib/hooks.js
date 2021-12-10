import { useRef, useEffect } from 'react';
import {
  useDeepCompareEffect,
  useUpdateEffect,
  useEffectOnce,
  useFirstMountState,
} from 'react-use';
import moment from 'moment';
import { isArray } from 'lodash';

export const useChange = ({
  otherCompParams,
  setValue,
  onPickerChange,
  shouldClearParams,
  pickerType,
  outsideChangeValue,
  defaultValue,
  initOnChange,
  lang,
  data,
}) => {
  const initDate = moment().valueOf();
  const isFirstMount = useFirstMountState();

  const firstRef = useRef();
  firstRef.current = isFirstMount;

  useEffect(() => {
    moment.locale(lang);
  }, [lang]);

  useEffectOnce(() => {
    let value = [initDate, initDate];
    if (isArray(defaultValue) && defaultValue.length) {
      value[0] = moment(defaultValue[0]);
      if (defaultValue?.length >= 2) {
        value[1] = moment(defaultValue[1]);
      }
    }
    const newV = getValueByType(value, pickerType);
    if (!initOnChange) {
      console.log('首次不onChange:', newV);
      setValue(newV);
    } else {
      console.log('首次onChange:', newV);
      outsideChangeValue(newV);
    }
  });

  useDeepCompareEffect(() => {
    if (firstRef.current) {
      return;
    }
    const { timeValue = [initDate, initDate] } = otherCompParams;
    outsideChangeValue(timeValue);
    console.log('otherCompParams change', otherCompParams);
  }, [otherCompParams]);

  useDeepCompareEffect(() => {
    if (!data?.value) {
      return;
    }
    outsideChangeValue(data?.value);
    console.log('data change', data);
  }, [data]);

  useUpdateEffect(() => {
    // 外部需要清理组件的条件
    console.log('清理条件');
    if (shouldClearParams) {
      outsideChangeValue(null);
    }
  }, [shouldClearParams, outsideChangeValue]);

  useUpdateEffect(() => {
    // 日期选择器 类型发生了 改变
    console.log('pickerType change', pickerType);
    if (pickerType) {
      outsideChangeValue(null);
    }
  }, [pickerType, outsideChangeValue]);
};

export const getValueByType = (v, pickerType) => {
  if (pickerType === 'RangePicker') {
    if (isArray(v) && v?.length === 2) {
      return [moment(v[0]), moment(v[1])];
    } else {
      return [];
    }
  }
  if (isArray(v)) {
    return v[0] ? moment(v[0]) : undefined;
  }
  return v ? moment(v) : undefined;
};

import React, { useState, useCallback, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Input, TimePicker } from 'antd';
import moment, { isMoment } from 'moment';
import styles from './index.less';
import useDeepCompareEffect from 'use-deep-compare-effect';

const nowDate = moment();
const getMomentTime = v => {
  if (!v) {
    return nowDate;
  }
  if (isMoment(v)) {
    return v;
  }
  return moment(v);
};
const getTimestamp = v => {
  if (!v) {
    return moment().valueOf();
  }
  return moment(v).valueOf();
};
const getTimes = ({ startTime, endTime }) => {
  return {
    startTime: getMomentTime(startTime),
    endTime: getMomentTime(endTime),
  };
};
const getTimestamps = ({ startTime, endTime }) => {
  return {
    startTime: getTimestamp(startTime),
    endTime: getTimestamp(endTime),
  };
};

function TimeGroup(props) {
  const { data = {}, style = {}, onChange } = props;
  const { inputWidth = 200, inputHeight = 30, TimePickerWidth = 120, Margin = 10 } = style;
  console.log('TimeGroup Start 0701', props);

  const [timeData, setTimeData] = useState({
    ...getTimes(data),
    all: '',
  });

  const onChangeRef = useRef(onChange);

  useDeepCompareEffect(() => {
    if (JSON.stringify(data) === '{}') {
      return;
    }

    // console.log('TimeGroup  useDeepData 0701', data);
    const reusltData = {
      ...data,
      ...getTimes(data),
    };
    setTimeData(reusltData);
  }, [data]);

  const makeTimeData = useCallback(
    (type, v) => {
      const _data = { ...timeData, [type]: type === 'all' ? v?.target?.value : v };
      const reusltData = {
        startTime: _data['startTime'],
        endTime: _data['endTime'],
        all: _data['all'],
      };
      setTimeData({
        ...reusltData,
        ...getTimes(reusltData),
      });
      const newData = {
        ...reusltData,
        ...getTimestamps(reusltData),
      };
      console.log('newData-------- 0701', newData);
      onChangeRef.current && onChangeRef.current(newData);
      // console.log('Set onChange 0701');
    },
    [timeData],
  );
  // console.log('TimeGroup Start 2 0701', timeData);

  return (
    <div className={styles.container}>
      <Input
        onChange={v => {
          makeTimeData('all', v);
        }}
        value={timeData.all}
        size="small"
        style={{ width: inputWidth, height: inputHeight }}
      />
      <div className={styles.timeContainer}>
        <TimePicker
          onChange={(time, timeString) => {
            makeTimeData('startTime', moment(time).valueOf());
          }}
          value={timeData.startTime}
          size="large"
          style={{
            marginLeft: Margin,
            marginRight: Margin,
            width: TimePickerWidth,
          }}
        />
        <span>至</span>
        <TimePicker
          onChange={(time, timeString) => {
            makeTimeData('endTime', moment(time).valueOf());
          }}
          value={timeData.endTime}
          size="large"
          style={{
            marginLeft: Margin,
            marginRight: Margin,
            width: TimePickerWidth,
          }}
        />
      </div>
    </div>
  );
}

export default TimeGroup;

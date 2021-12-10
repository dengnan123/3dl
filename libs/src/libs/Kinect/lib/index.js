import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import { useKinect } from './Kinect';
// import styles from './index.less';

function Kinect(props) {
  const { onChange, style } = props;
  // const [kinectClass, setClass] = useState(null);
  const timer = useRef(null);
  const value = useRef(null);
  const { IP = 'localhost', range } = style;

  const getKey = useCallback(
    number => {
      if (!range || !range.length) {
        return null;
      }
      let timeValue = null;
      let keyValue = null;
      for (let item of range) {
        const { key, max, min, time } = item;
        if (!max && !min && min !== 0) {
          continue;
        }
        if (!max && number > min) {
          keyValue = key;
          timeValue = time;
          break;
        }
        if (!min && min !== 0 && number <= max) {
          keyValue = key;
          timeValue = time;
          break;
        }
        if (number <= max && number > min) {
          keyValue = key;
          timeValue = time;
          break;
        }
      }
      return { currentKey: keyValue, time: timeValue };
    },
    [range],
  );

  console.log('[kinectClasss-0414]');

  const onClearTimeout = useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const onDisChange = useCallback(
    distance => {
      console.log(distance, '====distance');
      const { currentKey, time } = getKey(distance);
      if (!currentKey) return;

      if (currentKey === value.current && time) {
        return;
      }

      if (currentKey === value.current && !time) {
        onClearTimeout();
        return;
      }
      onClearTimeout();
      if (!time) {
        value.current = currentKey;
        onChange && onChange({ distance: distance, distanceKey: currentKey });
        return;
      }
      timer.current = setTimeout(() => {
        value.current = currentKey;
        onChange && onChange({ distance: distance, distanceKey: currentKey });
      }, time * 1000);
    },
    [onChange, getKey, onClearTimeout],
  );

  useKinect({ event_ValueChange: onDisChange, IP });

  // useEffect(() => {
  //   const kinClass = new KinectManager({ event_ValueChange: onDisChange, IP });
  //   setClass(kinClass);
  // }, [onDisChange, IP]);

  return <div></div>;
}

Kinect.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Kinect;

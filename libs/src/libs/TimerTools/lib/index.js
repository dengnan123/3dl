import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';

const currentId = v4();

function TimerTools(props) {
  const { style = {}, onChange } = props;

  const { seconds, maxValue = 3, startIndex = 0 } = style;
  let timer = useRef(null);

  let onChangeRef = useRef(onChange);

  const clearIntervalFunc = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    clearIntervalFunc();
    if (seconds) {
      const indexMax = maxValue;
      let currentInd = startIndex;
      timer.current = setInterval(() => {
        const ind = currentInd > indexMax ? 0 : currentInd + 1;
        console.log(`MyChay 组件变化-${currentId}`, currentInd);
        onChangeRef.current && onChangeRef.current({ currentInd });
        currentInd = ind;
      }, 1000 * seconds);
    }
    return () => {
      clearIntervalFunc();
    };
  }, [seconds, startIndex, maxValue]);

  return <div></div>;
}

TimerTools.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default TimerTools;

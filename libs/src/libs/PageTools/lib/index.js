import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
moment.extend(advancedFormat);
const PageToolsLib = props => {
  const { style = {}, onChange, otherCompParams } = props;
  const {
    isMoveEvents = true,
    diff = 200,
    isTimesEvents = false,
    // startHours = 9,
    // endHours = 19,
  } = style;

  const intervalTimer = useRef(null);
  const [currentTime, setCurrentTime] = useState(moment());
  const [betweenFlag, setBetweenFlag] = useState(true);

  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);

  /*** 时间触发事件===START ***/
  const onClearTimeout = useCallback(() => {
    if (!intervalTimer.current) return;
    clearTimeout(intervalTimer.current);
    intervalTimer.current = null;
  }, []);

  useEffect(() => {
    if (!isTimesEvents) {
      onClearTimeout();
      return;
    }
    onClearTimeout();
    intervalTimer.current = setInterval(() => {
      setCurrentTime(moment());
    }, 1000 * 60);

    return () => {
      onClearTimeout();
    };
  }, [isTimesEvents, onClearTimeout]);

  useEffect(() => {
    if (!isTimesEvents) {
      return;
    }

    const currentHour = currentTime.hour();
    const currentM = currentTime.minute();
    const currentS = currentTime.second() / 600;
    const timesValue = currentHour + currentM / 60 + currentS;
    console.log(
      currentTime.format('HH:mm:ss'),
      '========currentTime',
      currentTime.hour(),
      'H====Mfl',
      timesValue,
    );

    const timeNotBetween = timesValue <= 8 || timesValue >= 22.5;
    if (timeNotBetween && betweenFlag) {
      console.log(false, '========currentTime--isBetween-');
      setBetweenFlag(!betweenFlag);
      onChange && onChange({ timeOnchange: { isBetween: false } });
      return;
    }

    if (!timeNotBetween && !betweenFlag) {
      console.log(true, '========currentTime--isBetween');
      setBetweenFlag(!betweenFlag);
      onChange && onChange({ timeOnchange: { isBetween: true } });
    }
  }, [betweenFlag, currentTime, isTimesEvents, onChange]);
  /*** 时间触发事件===END ***/
  /*** 移动触发事件,start--move--finish ***/
  const _onMoveStart = useCallback(event => {
    const { type } = event || {};
    const isMobile = type.includes('touch');

    if ((isMobile && !event.touches) || (!isMobile && event.buttons !== 1)) {
      return;
    }
    event.stopPropagation();
    const { clientY } = isMobile ? event.touches[0] : event;
    setStartY(clientY);
  }, []);

  const _onMoveUpdate = useCallback(event => {
    const { type } = event || {};
    const isMobile = type.includes('touch');

    if ((isMobile && !event.touches) || (!isMobile && event.buttons !== 1)) {
      return;
    }
    event.stopPropagation();
    const { clientY } = isMobile ? event.touches[0] : event;
    setEndY(clientY);
  }, []);

  const _onMoveFinish = useCallback(
    event => {
      event.stopPropagation();
      if (!startY || !endY || endY >= startY) {
        return;
      }
      console.log(startY, '======FinishFinish--clientY', endY);
      console.log(startY - endY, '======Finish--diff');
      if (startY - endY >= diff) {
        console.log('======Finish结束啦---');
        setStartY(0);
        setEndY(0);
        onChange && onChange({ dataValues: { ...otherCompParams, moveEnd: true } });
      }
    },
    [startY, endY, diff, onChange, otherCompParams],
  );

  useEffect(() => {
    if (!isMoveEvents) return;
    // web
    document.addEventListener('mousedown', _onMoveStart);
    document.addEventListener('mousemove', _onMoveUpdate);
    document.addEventListener('mouseup', _onMoveFinish);
    // Mobile
    document.addEventListener('touchstart', _onMoveStart);
    document.addEventListener('touchmove', _onMoveUpdate);
    document.addEventListener('touchend', _onMoveFinish);
    return () => {
      document.removeEventListener('mousedown', _onMoveStart);
      document.removeEventListener('mousemove', _onMoveUpdate);
      document.removeEventListener('mouseup', _onMoveFinish);
      document.removeEventListener('touchstart', _onMoveStart);
      document.removeEventListener('touchmove', _onMoveUpdate);
      document.removeEventListener('touchend', _onMoveFinish);
    };
  }, [isMoveEvents, _onMoveStart, _onMoveUpdate, _onMoveFinish]);
  /*** 移动触发事件 ***/

  return <div style={{ width: '100%', height: '100%' }}></div>;
};

export default PageToolsLib;

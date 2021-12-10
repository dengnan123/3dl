import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Building20Component from '../../../../components/Threejs/ComponentClass2/Building20/Building20Component';

function Index(props) {
  const { style = {}, data = {}, height = 1080 / 2, width = 1920 / 2 } = props;
  const {
    closeGUIManager = false,
    isHideGUI = false,
    isHideStats = false,
    domID = 'WebGL_Building20CompPPS',
    isRotate = false,
    rotateTime = 3,
  } = style;
  const buildingEvents = useRef({});
  const timer = useRef(null);

  const configs = {
    domID,
    closeGUIManager,
    isHideGUI,
    isHideStats,
    screenSize: [width, height],
  };

  /*** 定时旋转***/
  useEffect(() => {
    const { rotate } = buildingEvents.current || {};
    // console.log(buildingEvents.current, '======buildingEvents.current');
    // console.log(isRotate, '======rotateTime', rotateTime);
    if (rotate && isRotate && rotateTime) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      timer.current = setInterval(() => {
        rotate();
      }, rotateTime * 1000);
    } else {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  }, [isRotate, rotateTime]);

  const initCallBack = events => {
    const { rotate } = events;
    if (events) {
      buildingEvents.current = events;
    }
  };

  return <Building20Component data={configs} callBack={initCallBack} />;
}

Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Index;

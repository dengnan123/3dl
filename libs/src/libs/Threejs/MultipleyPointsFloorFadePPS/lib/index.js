import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MultiplyPointsFloorFadePPS from '../../../../components/Threejs/ComponentClass/MultiplyPointFloorFade/MultiplyPointsFloorFadePPS';

function Index(props) {
  const { style = {}, data = {}, height = 1080 / 2, width = 1920 / 2 } = props;

  const {
    step = 12,
    exp = 0.8,
    stepSpeed = 0.8,
    hisOffset = 0.1,
    hisLength = 0.5,
    isShowGUI = true,
    isShowStats = true,
    domID = 'WebGL_MultiplePointsFloorFade',
  } = style;

  const configs = {
    domID,
    isShowGUI,
    isShowStats,
    screenSize: [width, height],
    effects: {
      main: { floorFadeSetting: [step, exp, stepSpeed], hisRange: [hisOffset, hisLength] },
    },
  };
  // const containerDom = useRef();
  // useEffect(() => {
  //   if (containerDom && containerDom.current) {
  //     setdimensions({
  //       width: containerDom.current.clientWidth,
  //       height: containerDom.current.clientHeight,
  //     });
  //   }
  // }, []);
  // const [dimensions, setdimensions] = useState({ width: 1080 / 2, height: 1920 / 2 });
  // const { width, height } = dimensions;

  return (
    // <div ref={containerDom} style={{ height: '100%', width: '100%' }}>
    <MultiplyPointsFloorFadePPS data={configs} />
    // </div>
  );
}

Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Index;

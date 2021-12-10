import React from 'react';
import PropTypes from 'prop-types';

import MultiplePointNoisePPS from '../../../../components/Threejs/ComponentClass/MultiplePointNoise/MultiplePointNoisePPS';

function Index(props) {
  const { style = {}, data = {}, height = 1080 / 2, width = 1920 / 2 } = props;

  const {
    // step = 12,
    // exp = 0.8,
    // stepSpeed = 0.8,
    // hisOffset = 0.1,
    // hisLength = 0.5,
    isShowGUI = true,
    isShowStats = true,
    domID = 'WebGL_MultiplePointNoisePPS',
  } = style;

  const configs = {
    domID,
    isShowGUI,
    isShowStats,
    screenSize: [width, height],
    // effects: {
    //   main: { floorFadeSetting: [step, exp, stepSpeed], hisRange: [hisOffset, hisLength] },
    // },
  };

  return <MultiplePointNoisePPS data={configs} />;
}

Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Index;

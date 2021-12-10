import React from 'react';
import PropTypes from 'prop-types';
import WaterDropWavePPS from '../../../../components/Threejs/ComponentClass/WaterDropWave/WaterDropWavePPS';

function Index(props) {
  const { style = {}, data = {}, width = 1080 / 2, height = 1920 / 2 } = props;

  const {
    step = 12,
    exp = 0.8,
    stepSpeed = 0.8,
    hisOffset = 0.1,
    hisLength = 0.5,
    isShowGUI = true,
    isShowStats = true,
    domID = 'WebGL_WaterDropWavePPS',
  } = style;

  console.log(props, 'WebGL_WaterDropWavePPS');

  const configs = {
    domID,
    isShowGUI,
    isShowStats,
    screenSize: [width, height],
    effects: {
      main: { floorFadeSetting: [step, exp, stepSpeed], hisRange: [hisOffset, hisLength] },
    },
  };

  return <WaterDropWavePPS data={configs} />;
}

Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Index;

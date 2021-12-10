import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import { merge } from 'lodash';
import PPSComponent from '../../../../components/Threejs/ComponentClass2/Base/PPSComponent';
function Index(props) {
  const {
    style = {},
    data = {},
    height = 1920 / 4,
    width = 1080 / 4,
    otherCompParams = {},
  } = props;
  const {
    closeGUIManager = false,
    isHideGUI = true,
    isHideStats = true,
    lerpData = 0,
    defaultPPS = 'multiplePointNoisePPS',
    initPPSs = [
      'hisRangePPS',
      'waterDropWavePPS',
      'multiplePointNoisePPS',
      'multiplyPointsFloorFadePPS',
      'multiplyLevelFlowPPS',
      'multiplyPointsHisRangePPS',
      'waterSimulationPPS',
      'waterWaveSimulation',
      'volumeCloudPPS',
      'hisRangePPS2',
    ],
    PPScongfigs = {},
  } = style;

  const { ppsKey } = otherCompParams;


  const initPPSWithConfigs = useMemo(() => {
    return initPPSs.reduce((obj, cur) => {
      obj[cur] = {};
      for (const key in PPScongfigs) {
        if (key === cur) {
          obj[cur] = PPScongfigs[key];
        }
      }
      // dynamically adjust configs by outter API data
      for (const key in data) {
        if (key === cur) {
          obj[cur] = merge(obj[cur], data[key]);
        }
      }
      return obj;
    }, {});
  }, [initPPSs, PPScongfigs, data]);

  const configs = {
    domID: `PSSComponent-${v4()}`,
    closeGUIManager,
    isHideStats,
    isHideGUI,
    lerpData,
    screenSize: [width, height],
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <PPSComponent
        initPPSs={initPPSWithConfigs}
        data={configs}
        ppsKey={ppsKey && initPPSs.includes(ppsKey) ? ppsKey : defaultPPS}
      />
    </div>
  );
}



Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
  otherCompParams: PropTypes.object,
};

export default Index;

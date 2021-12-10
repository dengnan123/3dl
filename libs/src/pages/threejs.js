import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';

// import PPS from "../components/Threejs/Component/example/PPS";
// import BasePPS from '../components/Threejs/ComponentClass/Base/BasePPS';

// import MultiplePointNoisePPS from '../components/Threejs/ComponentClass/MultiplePointNoise/MultiplePointNoisePPS';
// import MultiplyPointsFloorFadePPS from '../components/Threejs/ComponentClass/MultiplyPointFloorFade/MultiplyPointsFloorFadePPS';
// import MutiplyLevelFlowPPS from '../components/Threejs/ComponentClass/MutiplyLevelFlow/MutiplyLevelFlow';
// import WaterDropWavePPS from '../components/Threejs/ComponentClass/WaterDropWave/WaterDropWavePPS';
// import HisRangePPS from '../components/Threejs/ComponentClass/HisRange/HisRangePPS';
// import KinectDataPPS from '../components/Threejs/ComponentClass/KinectData/KinectDataPPS';
import PPSComponent from '../components/Threejs/ComponentClass2/Base/PPSComponent';
import Building20Comp from '../components/Threejs/ComponentClass2/Building20/Building20Component';
import './threejs.css';

// const tabList = [
//   {
//     title: '噪声',
//     key: 'MultiplePointNoisePPS',
//     Comp: MultiplePointNoisePPS,
//   },
//   {
//     title: '渐变',
//     key: 'FloorFadePPS',
//     Comp: MultiplyPointsFloorFadePPS,
//   },
//   {
//     title: '流动',
//     key: 'LevelFlowPPS',
//     Comp: MutiplyLevelFlowPPS,
//   },
//   {
//     title: '水滴波纹',
//     key: 'WaterDropWavePPS',
//     Comp: WaterDropWavePPS,
//   },
//   {
//     title: '双层扫描',
//     key: 'HisRangePPS',
//     Comp: HisRangePPS,
//   },
//   // {
//   //   title: '人体识别',
//   //   key: 'KinectDataPPS',
//   //   Comp: KinectDataPPS,
//   // },
//   {
//     title: 'example',
//     key: 'BasePPS',
//     Comp: BasePPS,
//   },
// ];
const tabList = [
  {
    title: '默认',
    key: 'Building20Comp',
    Comp: Building20Comp,
  },

];
function Threejs(props) {
  const [state, setState] = useState({
    activeKey: 'Building20Comp',
    // activeKey: 'KinectDataPPS',
  });

  const handleTabChange = key => {
    const guiDom = document.getElementsByClassName('dg ac');
    if (guiDom && guiDom.length) {
      guiDom[0].innerHTML = '';
    }
    setState({ activeKey: key });
  };
  return (
    <Tabs activeKey={state.activeKey} onChange={handleTabChange}>
      {tabList.map(n => {
        const { title, key, Comp } = n;
        return (
          <Tabs.TabPane tab={title} key={key}>
            {state.activeKey === key ? <Comp data={{ screenSize: [1080 / 4, 1920 / 4] }} /> : null}
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
}

export default Threejs;

import React from 'react';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { message } from 'antd';
import { HisRangePPS } from '../HisRange/HisRangePPS';
import { WaterDropWavePPS } from '../WaterDropWave/WaterDropWavePPS';
import { MultiplePointNoisePPS } from '../MultiplePointNoise/MultiplePointNoisePPS';
import { MultiplyPointsFloorFadePPS } from '../MultiplyPointFloorFade/MultiplyPointsFloorFadePPS';
import { MultiplyLevelFlowPPS } from '../MutiplyLevelFlow/MutiplyLevelFlow';
import { WaterSimulationPPS } from '../WaterSimulation/WaterSimulationPPS';
import { Building20Floors } from '../Building20/Building20Floors';
import { WaterWaveSimulation } from '../WaterWaveSimulation/WaterWaveSimulation';
import { VolumeCloudPPS } from '../VolumeCloud/VolumeCloudPPS';
import { HisRangePPS2 } from '../HisRange2/HisRangePPS2';

import { MultiplyPointsHisRangePPS } from '../MultiplyPointsHisRange/MultiplyPointsHisRangePPS';

import { GUIManager } from '../Tool/GUI/GUIManager';

class PPSComponent extends React.Component {
  constructor(props) {
    super(props);
    this.localData = {
      time: new Vector2(0.1, 1.0),
      domID: props.data.domID || 'WebGL-output-PPS',
      screenSize: new Vector2(1080 / 2, 1920 / 2),
      PPSDic: {},
      currentKey: { value: '' },
      printFunction: props.printFunction,
      isForceCloseGUI: props.data.closeGUIManager || false,
      PPSFunc: {
        hisRangePPS: HisRangePPS,
        waterDropWavePPS: WaterDropWavePPS,
        multiplePointNoisePPS: MultiplePointNoisePPS,
        multiplyPointsFloorFadePPS: MultiplyPointsFloorFadePPS,
        multiplyLevelFlowPPS: MultiplyLevelFlowPPS,
        multiplyPointsHisRangePPS: MultiplyPointsHisRangePPS,
        waterSimulationPPS: WaterSimulationPPS,
        // building20Floors: Building20Floors,
        waterWaveSimulation: WaterWaveSimulation,
        volumeCloudPPS: VolumeCloudPPS,
        hisRangePPS2: HisRangePPS2,
      },
    };
    this.obj = {
      container: null,
      gui: null,
      renderer: null,
    };
    this.isDestoryAnimation = { value: false };
    this.frameIndex = { value: 1 };
  }
  componentDidMount() {
    const localData = this.localData;
    const obj = this.obj;
    const isDestoryAnimation = this.isDestoryAnimation;
    const frameIndex = this.frameIndex;

    // renderer 初始化
    this.initBaseObj(obj, localData);

    // 通过传入数据进行初始化
    this.initFromProps(this.props, obj, true);

    const ppsDic = localData.PPSDic;
    for (const key in ppsDic) {
      const ppsEffectDic = ppsDic[key].data.EffectDic;
      if (!ppsEffectDic) {
        continue;
      }

      for (const passKey in ppsEffectDic) {
        const effectTime = ppsEffectDic[passKey].uniforms.time;
        if (!effectTime) {
          continue;
        }
        ppsEffectDic[passKey].uniforms.time.value = localData.time;
      }
    }

    // 挂载animate到帧计时器
    animate();

    function animate() {
      if (isDestoryAnimation.value) return;
      requestAnimationFrame(animate);

      frameIndex.value++;
      const deltaTime = 0.01;
      let dt = deltaTime * localData.time.y;
      localData.time.x += dt;
      obj.gui.animate();
      let pps = localData.PPSDic[localData.currentKey.value];
      if (pps) pps.animate(dt, frameIndex.value);
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    // 传入数据进行更新
    this.initFromProps(this.props, false);
    console.log('componentDidUpdate');
  }

  componentWillUnmount() {
    // 关闭animation
    this.isDestoryAnimation.value = true;
  }

  initGUI(data, obj, ppsKey) {
    let gui = obj.gui;
    if (data.isForceCloseGUI) {
      return;
    }
    let pps = data.PPSDic[ppsKey];
    gui.clear();

    let dropList = {};
    for (let key in data.PPSDic) {
      dropList[key] = key;
    }

    var indexData = {
      uniform: {
        value: data.currentKey.value,
      },
      key: '显示图',
      type: 'drop',
      order: -1,
      info: {
        dropList: dropList,
      },

      func: [
        key => {
          this.changePPS(key);
          if (!data.isForceCloseGUI) {
            obj.gui.display();
          }
        },
      ],
    };
    gui.addValue(indexData, null);

    pps.initGUI();

    printData();
    gui.display();

    function printData() {
      var settingFolder = gui.settingFolder;
      var printFunction = function () {
        let printData = {};
        try {
          for (const [key, value] of Object.entries(data.PPSDic)) {
            printData[key] = value.getEffects();
          }
          var jsonString = JSON.stringify(printData, null, 2);
          const el = document.createElement('textarea');
          el.value = jsonString;
          el.setAttribute('readonly', '');
          el.style.position = 'absolute';
          el.style.left = '-9999px';
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);

          message.success('配置成功复制到剪切板');
        } catch (error) {
          message.error(error.message);
        }

        if (data.printFunction) {
          data.printFunction(jsonString);
        }
      };
      var printData = {
        uniform: { value: printFunction },
        key: '打印',
        info: { displayName: '打印' },
      };
      obj.gui.addValue(printData, settingFolder);
    }
  }

  initBaseObj(obj, localData) {
    obj.container = document.getElementById(localData.domID);
    obj.renderer = new THREE.WebGLRenderer();
    obj.renderer.setPixelRatio(window.devicePixelRatio);
    obj.container.appendChild(obj.renderer.domElement);
    obj.renderer.setSize(localData.screenSize.x, localData.screenSize.y);
    obj.gui = new GUIManager(obj.container, {
      domID: localData.domID,
      isForceClose: localData.isForceCloseGUI,
    });
  }

  // 切换
  initFromProps(props, isInit) {
    const localData = this.localData;
    const obj = this.obj;

    const initGUI = this.initGUI;
    onScreenSize();
    initPPS();
    changePPS();
    updatePPSData();
    updateGUIState();

    function onScreenSize() {
      // 数据格式不正确
      if (!props.data.screenSize && props.data.screenSize.length !== 2) {
        return;
      }
      // 两次渲染数据相同
      if (
        props.data.screenSize[0] === localData.screenSize.x &&
        props.data.screenSize[1] === localData.screenSize.y
      ) {
        return;
      }
      // 调整本地数据尺寸、画布尺寸、GUI尺寸
      localData.screenSize.set(props.data.screenSize[0], props.data.screenSize[1]);
      obj.renderer.setSize(props.data.screenSize[0], props.data.screenSize[1]);
      const ppsDic = localData.PPSDic;
      for (var key in ppsDic) {
        ppsDic[key].setScreenSize();
      }
    }

    function initPPS() {
      const initialSet = props.initPPSs || {};
      const globalData = {
        data: {
          time: localData.time,
          screenSize: localData.screenSize,
        },
        container: obj.container,
      };

      if (JSON.stringify(initialSet) === '{}') {
        return;
      }
      //***********************************此次必有bug */
      if (Object.keys(localData.PPSDic).length === Object.keys(initialSet).length) return;

      const localPPSDic = {};
      for (let key in initialSet) {
        if (localData.PPSDic[key]) {
          localPPSDic[key] = localData.PPSDic[key];
        } else {
          const ppsItem = new localData.PPSFunc[key](globalData);
          ppsItem.init(obj.gui, obj.renderer);
          localPPSDic[key] = ppsItem;
        }
      }
      localData.PPSDic = localPPSDic;
    }

    function changePPS() {
      const key = props.ppsKey;
      if (!key) return;
      let pps = localData.PPSDic[key];
      //当key不变，只刷新数据
      if (key === localData.currentKey.value) return;
      localData.currentKey.value = key;
      if (!pps) {
        return;
      }
      pps.onChangeInit();
      initGUI(localData, obj, key);
    }

    function updatePPSData() {
      const { data, initPPSs = {}, ppsKey } = props;
      //如果是init则初始化所有的数据
      //如果不是init，则初始化非currentKey的数据
      if (isInit) {
        for (let key in initPPSs) {
          try {
            if (!localData.PPSDic[key]) continue;
            localData.PPSDic[key].setEffects(initPPSs[key]);
          } catch (error) {
          }
        }
      } else {
        // for (let key in initPPSs) {
        //   if (!localData.PPSDic[key]) continue;
        //   if (key === localData.currentKey.value) {
        //     const lerpTime = data.lerpData;
        //     const lerpData = lerpTime ? { lerpTime: lerpTime } : null;
        //     try {
        //       localData.PPSDic[key].setEffects(initPPSs[key], lerpData);
        //     } catch (error) {
        //     }
        //     continue;
        //   }
        //   try {
        //     localData.PPSDic[key] && localData.PPSDic[key].setEffects(initPPSs[key]);
        //   } catch (error) {
        //   }
        // }


        const lerpTime = data.lerpData;
        const lerpData = lerpTime ? { lerpTime: lerpTime } : null;
        if (!localData.PPSDic[ppsKey]) {
        }
        try {
          localData.PPSDic[ppsKey].setEffects(initPPSs[ppsKey], lerpData);
        } catch (error) {
        }
        // try {
        //   localData.PPSDic[ppsKey] && localData.PPSDic[ppsKey].setEffects(initPPSs[ppsKey]);
        // } catch (error) {
        // }
      }
    }

    function updateGUIState() {
      if (localData.isForceCloseGUI) return;
      !props.data.isHideGUI ? obj.gui.show() : obj.gui.hide();
      !props.data.isHideStats ? obj.gui.showStats() : obj.gui.hideStats();
    }

    return;
  }

  render() {
    return <div id={this.localData.domID} />;
  }
}
export default PPSComponent;

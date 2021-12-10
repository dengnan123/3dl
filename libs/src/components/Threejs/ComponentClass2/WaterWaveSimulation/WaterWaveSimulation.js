import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import { render } from 'react-dom';
import { HeightMapShader } from './Shader/HeightMapShader';
import { SmoothShader } from './Shader/SmoothShader';
import { WaterWaveShader } from './Shader/WaterWaveShader';
import normalTex from '../../3D/textures/waternormals.jpg';
import backTex from './Texture/WaterDrop_heightMap.jpg';

class WaterWaveSimulation extends BasePPS {
  constructor(props) {
    props['isBlur'] = false;
    super(props);
  }
  initSelf(data, obj) {
    console.log('1111');
    // console.log("Self");
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    const renderer = obj.renderer;

    initMainPass();

    function initMainPass() {
      initGPUCR();
      initMainPass();
      function initGPUCR() {
        const mouseItems = {
          cache: [],
          current: [],
          globalSize: {
            maxSize: 0.2,
            minSize: 0.15,
            maxPower: 1,
            minPower: 0.8,
            offsetFreq: 4,
            time: 0.5,
          },
        };
        data['mouseItems'] = mouseItems;
        // const item = new mouseItem(mouseItems.globalSize);
        // mouseItems.current.push(item);
        // item.random();
        const gpuCRData = {};
        data.EffectDic['gpuCR'] = { uniforms: gpuCRData };
        gpuCRData['width'] = { value: 256 };
        gpuCRData['bounds'] = { value: 1024 };
        gpuCRData['bounds_Half'] = { value: 512 };
        gpuCRData['viscosityConstant'] = { value: 0.95 };
        gpuCRData['heightAlpha'] = { value: 1 };
        gpuCRData['heightCompensation'] = { value: 0 };
        gpuCRData['isStateOK'] = { value: true };
        gpuCRData['stateOKDuration'] = { value: 1 };
        const mouses = [];
        for (let index = 0; index < 10; index++) {
          mouses.push(new Vector4(0, 0, 0, 0));
        }
        gpuCRData['mouses'] = { value: mouses };
        gpuCRData['mainMouse'] = { value: new Vector4(-0.4, -0.39, 0.26, 0) };
        gpuCRData['mainMousePower'] = { value: 0.25 };
        gpuCRData['mainMouseT'] = { value: 1.62 };
        gpuCRData['mainMouseMove'] = {
          singleTime: { value: 3 },
          time: { value: 0 },
          startPoint: { value: new Vector2(-0.4, -0.43) },
          endPoint: { value: new Vector2(-0.4, 0.4) },
        };
        gpuCRData['mouseStack'] = [];
        gpuCRData['T'] = { value: 0.17 };

        data['timeRela'] = data['timeRela'] || {};
        data.timeRela['gpuCR'] = { value: 0 };

        const gpuCR = new GPUComputationRenderer(
          gpuCRData.width.value,
          gpuCRData.width.value,
          renderer,
        );
        obj['gpuCR'] = gpuCR;
        const renderTargets = {};
        data['renderTargets'] = renderTargets;
        const variables = {};
        data['variables'] = variables;
        const shaders = {};
        data['shaders'] = shaders;
        const simplex = new SimplexNoise();

        const heightmap0 = gpuCR.createTexture();
        fillTexture(heightmap0);

        const heightMapVariable = gpuCR.addVariable(
          'heightmap',
          HeightMapShader().fragmentShader,
          heightmap0,
        );
        variables['heightmap'] = heightMapVariable;
        gpuCR.setVariableDependencies(heightMapVariable, [heightMapVariable]);

        heightMapVariable.material.uniforms['viscosityConstant'] = gpuCRData.viscosityConstant;
        heightMapVariable.material.uniforms['heightCompensation'] = gpuCRData.heightCompensation;
        heightMapVariable.material.uniforms['mouses'] = gpuCRData.mouses;
        heightMapVariable.material.uniforms['screenSize'] = { value: data.screenSize };
        heightMapVariable.material.uniforms['mainMouse'] = gpuCRData.mainMouse;
        heightMapVariable.material.defines.BOUNDS = gpuCRData.bounds.value.toFixed(1);

        const error = gpuCR.init();
        if (error !== null) {
          console.log('ComputeShader错误1:', error);
        }

        function fillTexture(texture) {
          const waterMaxHeight = 10;
          const WIDTH = gpuCRData.width;
          function noise(x, y) {
            let multR = waterMaxHeight;
            let mult = 0.025;
            let r = 0;
            for (let i = 0; i < 15; i++) {
              r += multR * simplex.noise(x * mult, y * mult);
              multR *= 0.53 + 0.025 * i;
              mult *= 1.25;
            }

            return r;
          }

          const pixels = texture.image.data;

          let p = 0;
          for (let j = 0; j < WIDTH; j++) {
            for (let i = 0; i < WIDTH; i++) {
              const x = (i * 128) / WIDTH;
              const y = (j * 128) / WIDTH;

              pixels[p + 0] = noise(x, y);
              pixels[p + 1] = pixels[p + 0];
              pixels[p + 2] = 0;
              pixels[p + 3] = 1;

              p += 4;
            }
          }
        }
        // function InitTexture() {
        //   var texPathDic = data.texPathDic;
        //   var texName;
        //   var tex;
        //   //高度图
        //   if ((texName = texPathDic.heightMap)) {
        //     tex = new THREE.TextureLoader().load(texName);
        //     mainU['heightTex'].value = tex;
        //   } else {
        //     tex = new THREE.TextureLoader().load(texHeightPath);
        //     mainU['heightTex'].value = tex;
        //   }
        //   // tex.wrapS = THREE.RepeatWrapping;
        //   // tex.wrapT = THREE.RepeatWrapping;
        // }
      }
      function initMainPass() {
        mainPass = new ShaderPass(WaterWaveShader());
        composer.addPass(mainPass);
        data.EffectDic['main'] = mainPass;
        const mainU = mainPass.uniforms;
        const gpuCRData = data.EffectDic.gpuCR.uniforms;
        mainU.time.value = data.time;
        var texPathDic = data.texPathDic;
        var texName;
        var tex;
        //高度图
        if ((texName = texPathDic.normalTex)) {
          tex = new THREE.TextureLoader().load(texName);
          mainU['normalTex'].value = tex;
        } else {
          tex = new THREE.TextureLoader().load(normalTex);
          mainU['normalTex'].value = tex;
        }
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;

        if ((texName = texPathDic.backTex)) {
          tex = new THREE.TextureLoader().load(texName);
          mainU['backTex'].value = tex;
        } else {
          tex = new THREE.TextureLoader().load(backTex);
          mainU['backTex'].value = tex;
        }

        mainU.WIDTH = gpuCRData.width;
        mainPass.material.defines.BOUNDS = gpuCRData.bounds.value.toFixed(1);

        console.log(gpuCRData);
      }
    }
  }

  initGUISelf(data, obj) {
    var gui = obj.gui;
    var mainU = data.EffectDic['main'].uniforms;

    const gpuCRU = data.EffectDic.gpuCR.uniforms;
    // 'viscosityConstant'
    // 'heightCompensation'
    const visData = {
      uniform: gpuCRU.viscosityConstant,
      key: '波动衰减',
      info: { isSlider: true, min: 0.8, max: 0.9999, delta: 0.0001 },
    };
    const heiData = {
      uniform: gpuCRU.heightCompensation,
      key: 'heightCompensation',
      info: { isSlider: true },
    };
    gui.addValue(visData);
    gui.addValue(heiData);

    //T
    const TData = {
      uniform: gpuCRU.T,
      key: '周期',
      info: { isSlider: true, delta: 0.01, min: 0.001 },
    };
    gui.addValue(TData);

    // maxSize: 0.2,
    //         minSize: 0.15,
    //         maxPower: 1,
    //         minPower: 0.8,
    //         offsetFreq:4,
    const globalSize = data['mouseItems'].globalSize;
    const minSizeData = {
      uniform: { value: globalSize.maxSize },
      key: '最大半径',
      info: { isSlider: true, max: 0.3 },
      onChange: v => {
        globalSize.minSize = v;
      },
    };
    const maxSizeData = {
      uniform: { value: globalSize.minSize },
      key: '最小半径',
      info: { isSlider: true, max: 0.3 },
      onChange: v => {
        globalSize.maxSize = v;
      },
    };
    const minPowerData = {
      uniform: { value: globalSize.maxPower },
      key: '最大强度',
      info: { isSlider: true, max: 2 },
      onChange: v => {
        globalSize.minPower = v;
      },
    };
    const maxPowerData = {
      uniform: { value: globalSize.minPower },
      key: '最小强度',
      info: { isSlider: true, max: 2 },
      onChange: v => {
        globalSize.maxPower = v;
      },
    };
    const freqData = {
      uniform: { value: globalSize.offsetFreq },
      key: '点波动频率（X帧/次）',
      info: { delta: 1 },
      onChange: v => {
        globalSize.offsetFreq = v;
      },
    };
    const tData = {
      uniform: { value: globalSize.time },
      key: '点存在时间',
      info: { isSlider: true },
      onChange: v => {
        globalSize.time = v;
      },
    };

    gui.addValue(minSizeData);
    gui.addValue(maxSizeData);
    gui.addValue(minPowerData);
    gui.addValue(maxPowerData);
    gui.addValue(freqData);
    gui.addValue(tData);

    const topColorData = { uniform: mainU.topColor, type: 'color', key: '顶部颜色' };
    const bottomColorData = { uniform: mainU.bottomColor, type: 'color', key: '底部颜色' };
    const normalData = {
      uniform: mainU.normalScale,
      key: '法线贴图强度',
      info: { isSlider: true, max: 1, min: 0.01 },
    };
    const subNormalData = {
      uniform: mainU.subNormalScale,
      key: '水滴法线强度',
      info: { isSlider: true, max: 2, min: 0.01 },
    };
    const totalNormalData = {
      uniform: mainU.subNormalScale,
      key: '总法线强度',
      info: { isSlider: true, max: 2, min: 0.01 },
    };
    gui.addValue(topColorData);
    gui.addValue(bottomColorData);
    gui.addValue(normalData);
    gui.addValue(subNormalData);
    gui.addValue(totalNormalData);

    const mainMouseData = {
      uniform: gpuCRU.mainMouse,
      key: '主要点',
      infos: [
        { displayName: 'posX', isSlider: true, min: -0.5, max: 0.5 },
        { displayName: 'posY', isSlider: true, min: -0.5, max: 0.5 },
        { displayName: 'size', isSlider: true, max: 0.5 },
        { isPass: true },
      ],
    };
    const mainMousePowerDate = {
      uniform: gpuCRU.mainMousePower,
      key: '主要点强度',
      info: { isSlider: true, max: 3 },
    };
    const mainMouseT = {
      uniform: gpuCRU.mainMouseT,
      key: '主要点频率',
      info: { isSlider: true, max: 5 },
    };
    gui.addValue(mainMouseData);
    gui.addValue(mainMousePowerDate);
    gui.addValue(mainMouseT);

    const mainMouseStartData = {
      uniform: gpuCRU.mainMouseMove.startPoint,
      key: '主要点起点',
      infos: [{ displayName: '主要点起点X' }, { displayName: '主要点起点Y' }],
    };
    const mainMouseEndData = {
      uniform: gpuCRU.mainMouseMove.endPoint,
      key: '主要点终点',
      infos: [{ displayName: '主要点终点X' }, { displayName: '主要点终点Y' }],
    };
    const singleTimeData = {
      uniform: gpuCRU.mainMouseMove.singleTime,
      key: '单程时间',
      info: { isSlider: true, min: 1, max: 50 },
    };
    gui.addValue(mainMouseStartData);
    gui.addValue(mainMouseEndData);
    gui.addValue(singleTimeData);
    const isOkData = { uniform: gpuCRU.isStateOK, key: '是否显示' };
    gui.addValue(isOkData);
  }

  onChangeInitSelf(data, obj) { }

  animateSelf(data, obj, deltaTime, isLog) {
    isLog && console.log("WaterWaveSimulation");

    const snU = data.variables.heightmap.material.uniforms;
    const gpuCR = obj.gpuCR;

    const gpuCRT = data.timeRela.gpuCR;
    // {
    //   "waterWaveSimulation": {
    //     "gpuCR": {
    //       "isStateOK": [
    //         false
    //       ]
    //     }
    //   }
    // }

    const gpuCRU = data.EffectDic.gpuCR.uniforms;

    //mouses
    animateMainMouse();
    animateMouse();

    gpuCR.compute();

    // gpuCRU.mousePos.value.set(0,0);
    // gpuCR.compute();
    const mainU = data.EffectDic.main.uniforms;
    mainU.heightTex.value = gpuCR.getCurrentRenderTarget(data.variables.heightmap).texture;

    function animateMainMouse() {
      if (!gpuCRU.isStateOK.value) {
        gpuCRU.stateOKDuration.value += deltaTime;
        gpuCRU.stateOKDuration.value = Math.min(gpuCRU.stateOKDuration.value, 1);
        const mainInfo = gpuCRU.mainMouseMove;
        mainInfo.time.value += deltaTime;
        if (mainInfo.time.value > mainInfo.singleTime.value) {
          mainInfo.time.value -= mainInfo.singleTime.value;
        }
        let alpha = mainInfo.time.value / mainInfo.singleTime.value;

        // gpuCRU.mainMousePower.value = 0.25
        gpuCRU.T.value = 0.1;
        gpuCRU.mainMouse.value.x =
          mainInfo.startPoint.value.x * (1 - alpha) + mainInfo.endPoint.value.x * alpha;
        gpuCRU.mainMouse.value.y =
          mainInfo.startPoint.value.y * (1 - alpha) + mainInfo.endPoint.value.y * alpha;
        gpuCRU.mainMouse.value.w =
          Math.sin(data.time.x * gpuCRU.mainMouseT.value * Math.PI * 10) *
          gpuCRU.mainMousePower.value;
        gpuCRU.mainMouse.value.w *= gpuCRU.stateOKDuration.value;
      } else {
        gpuCRU.T.value = 0.17;

        gpuCRU.stateOKDuration.value -= deltaTime;
        gpuCRU.stateOKDuration.value = Math.max(gpuCRU.stateOKDuration.value, 0);
        gpuCRU.mainMouse.value.w *= gpuCRU.stateOKDuration.value;
      }
    }
    function animateMouse() {
      const T = Math.max(gpuCRU.T.value, 0.001);
      gpuCRT.value += deltaTime;
      const mouseItems = data.mouseItems;
      //根据频率增加
      while (gpuCRT.value >= T) {
        gpuCRT.value -= T;
        if (mouseItems.current.length > 10) {
          console.log(gpuCRT, T);
          console.log('mouse item数目大于10');
          continue;
        }
        if (mouseItems.cache.length > 0) {
          const item = mouseItems.cache.pop();
          item.random();
          mouseItems.current.push(item);
        } else {
          const item = new mouseItem(mouseItems.globalSize);
          item.random();
          mouseItems.current.push(item);
        }
      }
      //更新
      let stopindex = -1;
      for (var index in mouseItems.current) {
        if (mouseItems.current[index].animate(deltaTime)) {
          stopindex = index;
        }
      }

      if (stopindex != -1) {
        const arr = [];
        for (var index in mouseItems.current) {
          if (index <= stopindex) {
            mouseItems.cache.push(mouseItems.current[index]);
          } else {
            arr.push(mouseItems.current[index]);
          }
        }
        mouseItems.current = arr;
      }

      //清空
      const mouses = gpuCRU.mouses.value;
      mouses.forEach(element => {
        element.w = 0;
      });
      for (let index = 0; index < Math.min(mouseItems.current.length, 10); index++) {
        const item = mouseItems.current[index];
        mouses[index].set(item.pos.x, item.pos.y, item.size, item.outputPower);
      }
      // console.log("点数:", mouseItems.current.length);
      // console.log(gpuCRU.mouses);
      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];

      // }
    }
  }
}

function mouseItem(globalSize) {
  let pos = new Vector2();
  this.pos = new Vector2();
  let posOffset;

  const random = Math.random();
  const maxTime = 10;
  const freq = globalSize.offsetFreq;
  let frame = 0;
  this.size = 0;
  let power = 0;
  this.time = 0;

  this.outputPower = 0;
  this.random = function () {
    const { maxSize, minSize, maxPower, minPower, time } = globalSize;
    this.size = minSize + (maxSize - minSize) * random;
    posOffset = this.size * 0.01;
    power = minPower + (maxPower - minPower) * random;
    pos.set(Math.random() - 0.5, Math.random() - 0.5);
    this.pos.copy(pos);
    this.time = time;
    frame = 0;
  };
  this.animate = function (deltaTime) {
    frame++;
    this.time -= deltaTime;
    this.outputPower = power * this.time;
    if (frame % freq == 0) {
      this.pos.set(pos.x + Math.random() * posOffset, pos.y + Math.random() * posOffset);
    }
    if (this.time <= 0) {
      return true;
    }
  };
}
export { WaterWaveSimulation };

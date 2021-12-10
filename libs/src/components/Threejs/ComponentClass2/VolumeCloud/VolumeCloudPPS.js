import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GetNoiseArr3Map, GetNoiseArr3Map2 } from './GetNoiseArr3';
import { VolumeShader } from './Shader/VolumeShader';
// import { render } from 'react-three-fiber';
import { BackShader } from './Shader/BackShader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { KinectManager } from '../../3D/Kinect2/KinectManager';
import cloudMapPath from './Texture/New_Graph_cloud.jpg';
import normalTex from '../../3D/textures/waternormals.jpg';
import { math } from 'polished';

class VolumeCloudPPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = true;
    super(props);
  }
  initSelf(data, obj) {
    console.log('1111');
    // console.log("Self");
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    const renderer = obj.renderer;
    let scene, camera;
    let mesh;
    data.frameStep = 6;
    initMain();
    initMainPass();
    function initMain() {
      // obj['kinect'] = new KinectManager();
      // renderer.setSize(1024,1024);
      console.log(renderer);
      scene = new THREE.Scene();
      obj['scene'] = scene;

      camera = new THREE.PerspectiveCamera(0.5, 1, 0.1, 100);
      camera.position.set(0, 0, 1.5);
      obj['camera'] = camera;
      camera.position.set(0, 0, 57.2);
      camera.rotation.set(0, 0, 0);

      composer.addPass(new RenderPass(scene, camera));

      // new OrbitControls( camera, renderer.domElement );
      const texData = {
        size: 256,
        circlePercent: 0.3,
        linearPercent: 0.6,
        scale: 4,
        scaleOffset: new Vector3(0, 0, 0),
      };
      data['texData'] = texData;

      const texture = GetNoiseArr3Map2(texData);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const shader = VolumeShader();
      const material = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: {
          base: { value: new THREE.Color(0x798aa0) },
          map: { value: texture },
          cameraPos: { value: new THREE.Vector3() },
          threshold: { value: 0.25 },
          opacity: { value: 0.25 },
          range: { value: 0.1 },
          steps: { value: 50 },
          frame: { value: 0 },
        },
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide,
        transparent: true,
      });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      data.EffectDic['main'] = material;
      data['mainMesh'] = mesh;

      const parameters = {
        threshold: { value: 0.346 },
        opacity: { value: 1 },
        range: { value: 0.014 },
        steps: { value: 20 },
      };
      data['parameters'] = parameters;
      material.uniforms.threshold = parameters.threshold;
      material.uniforms.opacity = parameters.opacity;
      material.uniforms.range = parameters.range;
      material.uniforms.steps = parameters.steps;

      data.EffectDic['mainParams'] = { uniforms: {} };
      data.EffectDic.mainParams.uniforms['threshold'] = { value: 0.17 };
      data.EffectDic.mainParams.uniforms['T'] = { value: 9.09 };
      data.EffectDic.mainParams.uniforms['range'] = { value: 0.034 };
      data.EffectDic.mainParams.uniforms['states'] = { value: 3 };
      data.EffectDic.mainParams.uniforms['tParamsArr'] = { value: [0.16, 0.23, 0.28, 0.32] };
    }
    function initMainPass() {
      mainPass = new ShaderPass(BackShader());
      composer.addPass(mainPass);
      data.EffectDic['mainPass'] = mainPass;
      const mainU = mainPass.uniforms;
      console.log(data);
      console.log(mainU);

      mainU.time.value = data.time;

      var texPathDic = data.texPathDic;
      var texName;
      var tex;
      //高度图
      if ((texName = texPathDic.heightTex)) {
        tex = new THREE.TextureLoader().load(texName);
        mainU['heightTex'].value = tex;
      } else {
        tex = new THREE.TextureLoader().load(cloudMapPath);
        mainU['heightTex'].value = tex;
      }
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;

      if ((texName = texPathDic.normalTex)) {
        tex = new THREE.TextureLoader().load(texName);
        mainU['normalTex'].value = tex;
      } else {
        tex = new THREE.TextureLoader().load(normalTex);
        mainU['normalTex'].value = tex;
      }
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
    }

  }

  initGUISelf(data, obj) {
    const gui = obj.gui;
    const parameters = data.parameters;
    const mainParams = data.EffectDic.mainParams.uniforms;
    const thresholdData = {
      uniform: mainParams.threshold,
      key: 'threshold',
      info: { isSlider: true, delta: 0.0001, min: 0.1, max: 0.4 },
    };
    const opacityaData = {
      uniform: parameters.opacity,
      key: 'opacity',
      info: { isSlider: true, delta: 0.0001 },
    };
    const rangeData = {
      uniform: parameters.range,
      key: 'range',
      info: { isSlider: true, delta: 0.0001, max: 0.3 },
    };
    const stepsData = {
      uniform: parameters.steps,
      key: 'steps',
      info: { isSlider: true, max: 100, delta: 1 },
    };
    const TData = {
      uniform: mainParams.T,
      key: '轮动周期',
      info: { isSlider: true, min: 1, max: 100 },
    };
    const rangeData2 = {
      uniform: mainParams.range,
      key: '轮动范围±v',
      info: { isSlider: true, min: 0, max: 0.2, delta: 0.001 },
    };
    const folder = gui.addFolder({ key: '参数', isOpen: true });
    gui.addValue(thresholdData, folder);
    gui.addValue(opacityaData, folder);
    gui.addValue(rangeData, folder);
    gui.addValue(stepsData, folder);
    gui.addValue(TData, folder);
    gui.addValue(rangeData2, folder);
    gui.addValue({
      uniform: data.EffectDic.mainPass.uniforms.topColor2,
      type: 'color',
      key: '顶部top',
    });
    gui.addValue({
      uniform: data.EffectDic.mainPass.uniforms.bottomColor2,
      type: 'color',
      key: '顶部bottom',
    });
    gui.addValue({
      uniform: data.EffectDic.mainPass.uniforms.topColor,
      type: 'color',
      key: 'topColor',
    });
    gui.addValue({
      uniform: data.EffectDic.mainPass.uniforms.bottomColor,
      type: 'color',
      key: 'bottomColor',
    });
    gui.addValue({ uniform: mainParams.states, key: "States", info: { isSlider: true, max: 3, delta: 1 } });

    function initMapGenerate() {
      const sonFolder = gui.addFolder({ key: '图生成', isOpen: true });
      const texData = data.texData;

      const circlePercentData = {
        uniform: { value: texData.circlePercent },
        key: '半圆渐变',
        info: { isSlider: true, delta: 0.001 },
        onChange: v => {
          texData.circlePercent = v;
          onValueChange();
        },
      };
      const linearPercentData = {
        uniform: { value: texData.linearPercent },
        key: '深度渐变',
        info: { isSlider: true, delta: 0.001 },
        onChange: v => {
          texData.linearPercent = v;
          onValueChange();
        },
      };
      const perlinScaleData = {
        uniform: { value: texData.scale },
        key: '噪声缩放',
        info: { isSlider: true, max: 10 },
        onChange: v => {
          texData.scale = v;
          onValueChange();
        },
      };
      const perlinOffsetData = {
        uniform: { value: texData.scaleOffset },
        key: '噪声偏移',
        infos: [
          { displayName: '噪声偏移X', isSlider: true, max: 10 },
          { displayName: '噪声偏移Y', isSlider: true, max: 10 },
          { displayName: '噪声偏移Z', isSlider: true, max: 10 },
        ],
        onChange: v => {
          texData.scale = v;
          onValueChange();
        },
      };

      gui.addValue(circlePercentData, sonFolder);
      gui.addValue(linearPercentData, sonFolder);
      gui.addValue(perlinScaleData, sonFolder);
      gui.addValue(perlinOffsetData, sonFolder);
      function onValueChange() {
        const tex = GetNoiseArr3Map2(texData);
        data.EffectDic.main.uniforms.map.value = tex;
      }
    }
  }

  animateSelf(data, obj, deltaTime, isLog) {
    isLog && console.log("VolumeCloudPPS");

    data['aaaa'] = data['aaaa'] || 1;
    data['aaaa']++;
    //   console.log(data['aaaa']);

    const mainU = data.EffectDic.main.uniforms;
    const mainPassU = data.EffectDic.mainPass.uniforms;
    const mainP = data.EffectDic.mainParams.uniforms;

    //更新mainP;
    const targetThres = mainP.tParamsArr.value[mainP.states.value];
    if (targetThres != mainP.threshold.value) {
      if (targetThres > mainP.threshold.value) {
        mainP.threshold.value = Math.min(targetThres, mainP.threshold.value + deltaTime * 0.01);
      }
      else {
        mainP.threshold.value = Math.max(targetThres, mainP.threshold.value - deltaTime * 0.01);
      }
    }
    mainU.cameraPos.value.copy(obj.camera.position);
    mainU.frame.value++;
    mainU.threshold.value =
      mainP.threshold.value +
      mainP.range.value * Math.sin(((Math.PI * 2) / mainP.T.value) * mainPassU.time.value.x);

    // console.log(mainP.threshold.value);
    //   console.log('renderer');
    // console.log(data.EffectDic.mainPass);
  }
}

export { VolumeCloudPPS };

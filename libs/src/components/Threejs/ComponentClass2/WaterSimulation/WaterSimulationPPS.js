import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { WaterSimulationPass, WaterSimulationPoint } from './Pass/WaterSimulationPass';
import { GUIListInitData, GUIListInit } from '../Tool/GUIListInit';
import {
  CenterDiffusionDYEShader,
  CenterDiffusionVelocityShader,
} from './Pass/Shader/CenterDiffusionShader';
import { WSDShader } from './Shader/WSDShader';
import backTex from './Texture/backTex.jpg';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { color } from 'three/examples/jsm/libs/dat.gui.module';

class WaterSimulationPPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = false;
    super(props);
  }
  initSelf(data, obj) {
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;

    data.EffectDic['mainParams'] = { uniforms: {} };

    CreateMain();

    CreateColorPass();

    CreateMainParmas();

    var defaultUniform = null;

    function CreateMain() {
      var dyeMat = new THREE.ShaderMaterial(new CenterDiffusionDYEShader());
      var velocityMat = new THREE.ShaderMaterial(new CenterDiffusionVelocityShader());
      mainPass = new WaterSimulationPass(data.screenSize, dyeMat, velocityMat);
      // mainPass = new WaterSimulationPass(data.screenSize);
      composer.addPass(mainPass);
      data.EffectDic['main'] = mainPass;

      // mainPass.uniforms.isCopy.value = true;
      //添加静态点
      initStaticPoints();

      function initStaticPoints() {
        const staticInputs = mainPass.uniforms.staticInputs.value;
        const p0 = new WaterSimulationPoint();
        // p0.color.set(175 / 255.0, 238 / 255.0, 238 / 255.0);
        p0.color.set(1, 1, 1);
        p0.isShow = true;
        p0.R = 0.25;
        p0.pos.set(0.11, 0.07);
        p0.dPos.set(0.5, 0.5);
        p0.dPower = 7.22;
        p0.colorPower = 0.305;
        p0.name = '静态输出点';
        staticInputs.push(p0);
        data.EffectDic['mainParams'].uniforms['mainPoint'] = { value: p0 };

      }
    }

    function CreateColorPass() {
      const pass = new ShaderPass(new WSDShader());
      const uniforms = pass.uniforms;
      composer.addPass(pass);
      data.EffectDic['colorP'] = pass;

      initTexture();

      function initTexture() {
        var texPathDic = data.texPathDic;
        var texName;
        var tex;
        if ((texName = texPathDic.backgroundTex)) {
          tex = new THREE.TextureLoader().load(texName);
          uniforms['backTex'].value = tex;
        } else {
          tex = new THREE.TextureLoader().load(backTex);
          uniforms['backTex'].value = tex;
        }
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
      }
    }

    function CreateMainParmas() {
      const mainPU = data.EffectDic.mainParams.uniforms;
      mainPU['T'] = { value: 2.5 };
      mainPU['isStateOK'] = { value: false };
      mainPU['currentState'] = { value: true };
      mainPU['stateChangeTime'] = { value: 5 };
      mainPU['stateChangeT'] = { value: 5 };
    }

    // initPassGUI();
    // initShaderGUI();
  }
  initGUISelf(data, obj) {
    console.log('initGUISelf');

    var gui = obj.gui;
    var mainPass = data.EffectDic.main;

    initPassGUI();
    initShaderGUI();
    function initPassGUI() {
      const passFolder = gui.addFolder({ key: '水模拟参数' });
      initGlobalParamGUI();
      initInputParamGUI();

      function initGlobalParamGUI() {
        let mFolder = gui.addFolder({ key: '全局参数', isOpen: true }, passFolder);
        //质量
        var dye_ResolutionData = {
          uniform: mainPass.uniforms['dye_Resolution'],
          key: '画面质量',
          type: 'drop',
          info: {
            dropList: { 特高: 2048, 高质量: 1024, 中质量: 512, 低质量: 256, 非常低质量: 128 },
          },
          onChange: mainPass.onResolutionChange,
        };
        gui.addValue(dye_ResolutionData, mFolder);

        //模拟分辨率
        var sim_ResolutionData = {
          uniform: mainPass.uniforms['sim_Resolution'],
          key: '模拟分辨率',
          type: 'drop',
          info: { dropList: { '256': 256, '128': 128, '64': 64, '32': 32 } },
          onChange: mainPass.onResolutionChange,
        };
        gui.addValue(sim_ResolutionData, mFolder);
        //显示的图
        var showIndexData = {
          uniform: mainPass.uniforms['show_Index'],
          key: '显示纹理',
          type: 'drop',
          info: { dropList: { velocity: 1, dye: 2, curl: 3, divergence: 4, pressure: 5 } },
        };
        gui.addValue(showIndexData, mFolder);

        //暂停
        var isPauseData = {
          uniform: mainPass.uniforms.isPause,
          key: '暂停',
          info: { isBoolean: true },
        };
        gui.addValue(isPauseData, mFolder);

        //压力衰减
        var pressureData = {
          uniform: mainPass.uniforms.PRESSURE,
          key: '压力衰减',
          info: { isSlider: true, max: 1 },
        };
        gui.addValue(pressureData, mFolder);
        //压力衰减计算次数
        var pressureITERATIONSData = {
          uniform: mainPass.uniforms.PRESSURE_ITERATIONS,
          key: '压力衰减计算次数',
          info: {
            displayName: '压力衰减计算次数',
            min: 1,
            max: 40,
            delta: 1,
            isSlider: true,
          },
        };
        gui.addValue(pressureITERATIONSData, mFolder);
        //
        var curlData = {
          uniform: mainPass.uniforms.CURL,
          key: '涡流强度',
          info: { displayName: '涡流强度', min: 0, max: 50, isSlider: true },
        };
        gui.addValue(curlData, mFolder);

        var clearData = {
          uniform: {
            value: () => {
              mainPass.uniforms.clearRT = true;
            },
          },
          key: '清除纹理',
          order: 999,
        };
        gui.addValue(clearData, mFolder);

        var velocityDissData = {
          uniform: mainPass.uniforms.VELOCITY_DISSIPATION,
          info: { displayName: 'vel_Diss', isSlider: true, max: 2 },
        };
        gui.addValue(velocityDissData, mFolder);

        var velocityDissData = {
          uniform: mainPass.uniforms.VELOCITY_DISSIPATION,
          info: { displayName: 'vel_Diss', isSlider: true, max: 2 },
        };
        gui.addValue(velocityDissData, mFolder);

        var dyeDissData = {
          uniform: mainPass.uniforms.DENSITY_DISSIPATION,
          info: { displayName: 'dye_Diss', isSlider: true, max: 2 },
        };
        gui.addValue(dyeDissData, mFolder);
      }
      function initInputParamGUI() {
        let mFolder = gui.addFolder({ key: '数据输入', isOpen: true }, passFolder);
        initRandomGUI();
        initStaticGUI();

        function initRandomGUI() {
          let sonFolder = gui.addFolder({ key: '随机' }, mFolder);
          var splatForceData = {
            uniform: mainPass.uniforms.SPLAT_MULTIPLY_FORCE,
            info: { displayName: '随机输入强度', isSlider: true, min: 0, max: 2000 },
          };
          gui.addValue(splatForceData, sonFolder);
          var splatRadiusData = {
            uniform: mainPass.uniforms.SPLAT_MULTIPLY_RADIUS,
            info: { displayName: '输入半径', isSlider: true, max: 1 },
          };
          gui.addValue(splatRadiusData, sonFolder);

          var randomRData = {
            uniform: mainPass.uniforms.SPLAT_MULTIPLY_STATIC_RADIU,
            info: { displayName: '随机半径' },
          };
          gui.addValue(randomRData, sonFolder);

          var randomGenerateData = {
            uniform: { value: randomGenerate },
            key: '随机生成',
            info: { displayName: '随机生成', order: 100 },
          };
          function randomGenerate() {
            var num = Math.round(Math.random() * 5 + 5);
            mainPass.uniforms['splatStack'].value.push(num);
          }
          gui.addValue(randomGenerateData, sonFolder);
        }
        function initStaticGUI() {
          var points = mainPass.uniforms.staticInputs.value;

          const staticFolder = gui.addFolder({ key: '静态输入', isOpen: true }, mFolder);
          for (var key in points) {
            points[key].initGUI(gui, staticFolder);
          }
          // var staticPoints =mainPass.uniforms.staticInputs.value;
          // var data = new GUIListInitData(points,staticPoints.length>=2?2:0,staticPoints.length);
          // var guiListInit = new GUIListInit(gui,data,staticFolder);

          // var generateData = {uniform:{value:()=>{mainPass.uniforms.SPLAT_STATIC_UPDATE.value = true}},infos:[{displayName:"刷新"}]};
          // gui.addValue(generateData,staticFolder);
        }
        function initMoveGUI() {
          let sonFolder = gui.addFolder({ folderName: '滑动输入', isOpen: true, parent: mFolder });
          var splatForceData = {
            uniform: mainPass.uniforms.SPLAT_FORCE,
            infos: [{ displayName: '输入强度', isSlider: true, min: 0, max: 2000 }],
          };
          gui.addValue(splatForceData, sonFolder);
          var splatRadiusData = {
            uniform: mainPass.uniforms.SPLAT_RADIUS,
            infos: [{ displayName: '输入半径', isSlider: true, max: 1 }],
          };
          gui.addValue(splatRadiusData, sonFolder);
        }
      }
    }
    function initShaderGUI() {
      const folder = gui.addFolder({ key: 'shader参数', isOpen: true });
      const shaderU = data.EffectDic.colorP.uniforms;
      const velPowerData = {
        uniform: shaderU.velPower,
        key: '水流影响强度',
        info: { isSlider: true, delta: 0.001 },
      };
      const tCData = { uniform: shaderU.topColor, type: 'color', key: '背景顶部颜色' };
      const bCData = { uniform: shaderU.bottomColor, type: 'color', key: '背景底部颜色' };
      const wdCData = { uniform: shaderU.waterDyeColor, type: 'color4', key: '水染颜色' };
      gui.addValue(velPowerData, folder);
      gui.addValue(tCData, folder);
      gui.addValue(bCData, folder);
      gui.addValue(wdCData, folder);
    }

    const funData = { uniform: { value: () => { data.EffectDic.mainParams.uniforms.isStateOK.value = !data.EffectDic.mainParams.uniforms.isStateOK.value; } }, key: "取反" };
    gui.addValue(funData);
  }
  animateSelf(data, obj, deltaTime) {
    const colorPU = data.EffectDic.colorP.uniforms;
    const passPRT = data.EffectDic.main.renderTargets;
    colorPU.dyeTex.value = passPRT.dye.read.texture;
    colorPU.velTex.value = passPRT.velocity.read.texture;

    const mainPU = data.EffectDic.mainParams.uniforms;
    let angle = (Math.sin(data.time.x * Math.PI * 2 / mainPU.T.value) + 1) / 2 * Math.PI / 2;
    const p = mainPU.mainPoint.value;
    p.dPos.set(Math.sin(angle), Math.cos(angle));
    console.log(mainPU.isStateOK.value);
    if (mainPU.currentState.value != mainPU.isStateOK.value) {
      mainPU.currentState.value = mainPU.isStateOK.value;
      let a = mainPU.mainPoint.value.color.x;
      if (!mainPU.currentState.value) {
        mainPU.stateChangeTime.value = data.time.x - a * mainPU.stateChangeT.value;
      }
      else {
        mainPU.stateChangeTime.value = data.time.x - (1 - a) * mainPU.stateChangeT.value;
      }
    }
    let alpha = (data.time.x - mainPU.stateChangeTime.value) / mainPU.stateChangeT.value;
    alpha = Math.min(alpha, 1);

    if (mainPU.currentState.value) alpha = 1 - alpha;
    // console.log(alpha);


    mainPU.mainPoint.value.color.set(alpha, alpha, alpha);

  }
}
export { WaterSimulationPPS };

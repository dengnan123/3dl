import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { GUIInitEllipsePoints, GUIInitScreenNoise, GUIInitBezier4P } from '../Tool/GUITypeInit';
import { WaterDropWaveShader } from './Shader/WaterDropWaveShader';

import texHeightPath from './Texture/WaterDrop_heightMap.jpg';
import texGroundPath from './Texture/WaterDrop_backMask.jpg';
import texGradientPath from './Texture/WaterDrop_gradientTex.jpg';
import texNormal1Path from './Texture/Water_1_M_Normal.jpg';
import texNormal2Path from './Texture/Water_1_M_Normal.jpg';
import texWhitePath from './Texture/WaterDrop_whiteNoise.jpg';

class WaterDropWavePPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = true;
    super(props);
  }
  initSelf(data, obj) {
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    data['animateParam'] = {};
    data['animateParam']['smoothMin'] = 0;
    data['animateParam']['smoothMinForward'] = true;

    initMainPass();

    function initMainPass() {
      initMainPass();
      function initMainPass() {
        mainPass = new ShaderPass(WaterDropWaveShader());
        composer.addPass(mainPass);
        data.EffectDic['main'] = mainPass;
        var mainU = mainPass.uniforms;
        InitTexture();
        function InitTexture() {
          var texPathDic = data.texPathDic;
          var texName;
          var tex;
          //高度图
          if ((texName = texPathDic.heightMap)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['heightTex'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texHeightPath);
            mainU['heightTex'].value = tex;
          }
          // tex.wrapS = THREE.RepeatWrapping;
          // tex.wrapT = THREE.RepeatWrapping;

          //背景图
          if ((texName = texPathDic.groundTex)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['groundTex'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texGroundPath);
            mainU['groundTex'].value = tex;
          }
          // tex.wrapS = THREE.RepeatWrapping;
          // tex.wrapT = THREE.RepeatWrapping;

          //渐变
          if ((texName = texPathDic.gradientTex)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['gradientTex'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texGradientPath);
            mainU['gradientTex'].value = tex;
          }
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;

          //法线1
          if ((texName = texPathDic.normalTex1)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['normalTex1'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texNormal1Path);
            mainU['normalTex1'].value = tex;
          }
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;

          //法线2
          if ((texName = texPathDic.normalTex2)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['normalTex2'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texNormal1Path);
            mainU['normalTex2'].value = tex;
          }
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;

          //噪声
          if ((texName = texPathDic.whiteTex)) {
            tex = new THREE.TextureLoader().load(texName);
            mainU['whiteTex'].value = tex;
          } else {
            tex = new THREE.TextureLoader().load(texWhitePath);
            mainU['whiteTex'].value = tex;
          }
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
        }
      }
    }
  }
  initGUISelf(data, obj) {
    return;
    var gui = obj.gui;
    var mainU = data.EffectDic['main'].uniforms;
    initMainGUI();

    function initMainGUI() {
      var smoothFolder = gui.addFolder({ folderName: '平滑设置', isOpen: true });
      var smoothData = {
        uniform: mainU['smoothSetting'],
        infos: [
          { displayName: 'min', name: 'Smooth_Min', isSlider: true, max: 0.5 },
          { displayName: 'max', name: 'Smooth_Max', isSlider: true },
          { displayName: '背景颜色偏置', key: 'Smooth_Z', isSlider: true },
          { displayName: '噪声强度', key: 'Smooth_W', isSlider: true },
        ],
        func: [
          (value, params) => {
            if (value.x > value.y) {
              value.x = value.y;
              params['x'] = value.y;
            }
          },
        ],
      };
      gui.addValue(smoothData, smoothFolder);

      var colorTopData = {
        uniform: mainU['colorTop'],
        isColor: true,
        infos: [{ displayName: '顶部颜色', order: -1 }],
      };
      var colorBottomData = {
        uniform: mainU['colorBottom'],
        isColor: true,
        infos: [{ displayName: '底部颜色', order: -1 }],
      };
      gui.addValue(colorTopData);
      gui.addValue(colorBottomData);

      var normalSettingFolder = gui.addFolder({ folderName: '法线设置', isOpen: true });
      var normalSettingData = {
        uniform: mainU['normalSetting'],
        infos: [
          { displayName: '法线波动速度', isSlider: true },
          { displayName: '法线波动强度', isSlider: true, max: 5.0 },
          { displayName: '右边界', isSlider: true },
          { displayName: '左边界', isSlider: true },
        ],
      };
      gui.addValue(normalSettingData, normalSettingFolder);
    }
  }

  onChangeInitSelf(data, obj) {
    data['isOnChange'] = true;
  }
  animateSelf(data, obj, deltaTime, isLog) {
    isLog && console.log("WaterDropWave");

    var mainU = data.EffectDic['main'].uniforms;
    mainU['normalSettingT'].value += deltaTime * mainU['normalSetting'].value.x;

    if (data['isOnChange']) {
      mainU.normalSetting.value.z = 0;
      data['isOnChange'] = false;
      ////
      if (obj.gui) {
        obj.gui.refreshGUI();
      }
    }

    mainU.normalSetting.value.z += 0.01;
    mainU.normalSetting.value.z = Math.min(mainU.normalSetting.value.z, 1);

    var minV = data['animateParam']['smoothMin'];
    minV += data['animateParam']['smoothMinForward'] ? 1 / 60 : -1 / 60;
    if (minV >= 120) data['animateParam']['smoothMinForward'] = false;
    if (minV <= 0) data['animateParam']['smoothMinForward'] = true;
    data['animateParam']['smoothMin'] = minV;

    mainU.smoothSetting.value.x = minV / 120 / 2;
  }
}
export { WaterDropWavePPS };



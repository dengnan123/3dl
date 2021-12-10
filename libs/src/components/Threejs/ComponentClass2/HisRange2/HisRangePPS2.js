// import {GUIInit} from '../Tool/GUITypeInit';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import BasePPS from '../Base/BasePPS.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GUIInitHisRange } from '../Tool/GUITypeInit';

import { HisRangeShaderCreator } from './Shader/HisRangeShaderCreator';
import texHeightPath from './Texture/ActiveFade_height.jpg';
import texBackLevelPath from './Texture/tvoc背景.png';
import texGradientPath from './Texture/ActiveFade_gradient.jpg';
import texNormalPath from '../../3D/textures/waternormals.jpg';

class HisRangePPS2 extends BasePPS {
  constructor(props) {
    props['isBlur'] = false;
    super(props);
  }
  initSelf(data, obj) {
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    data['animateParam'] = {};
    data['animateParam']['t1'] = 0;
    data['animateParam']['t1Forward'] = true;

    data.EffectDic['mainParams'] = { uniforms: {} };
    data.EffectDic.mainParams.uniforms['states'] = { value: 3 };
    data.EffectDic.mainParams.uniforms['tParamsArr'] = { value: [0.16, 0.23, 0.28, 0.32] };
    initMainPass();

    function initMainPass() {
      CreateMain();
      function CreateMain() {
        mainPass = new ShaderPass(HisRangeShaderCreator());
        composer.addPass(mainPass);
        data.EffectDic['main'] = mainPass;
        var mainU = mainPass.uniforms;
        mainU.time.value = data.time;
        InitTexture();
        function InitTexture() {
          var texPathDic = data.texPathDic;
          var texName = 'heightTex';
          if (texPathDic[texName]) {
            mainU[texName].value = new THREE.TextureLoader().load(texName);
          } else {
            mainU[texName].value = new THREE.TextureLoader().load(texHeightPath);
          }

          texName = 'backLevelTex';
          if (texPathDic[texName]) {
            mainU[texName].value = new THREE.TextureLoader().load(texName);
          } else {
            mainU[texName].value = new THREE.TextureLoader().load(texBackLevelPath);
          }
          mainU[texName].value.wrapS = THREE.RepeatWrapping;
          mainU[texName].value.wrapT = THREE.RepeatWrapping;
          texName = 'gradientTex';
          if (texPathDic[texName]) {
            mainU[texName].value = new THREE.TextureLoader().load(texName);
          } else {
            mainU[texName].value = new THREE.TextureLoader().load(texGradientPath);
          }
          texName = 'normalTex';
          if (texPathDic[texName]) {
            mainU[texName].value = new THREE.TextureLoader().load(texName);
          } else {
            mainU[texName].value = new THREE.TextureLoader().load(texNormalPath);
          }
          mainU[texName].value.wrapS = THREE.RepeatWrapping;
          mainU[texName].value.wrapT = THREE.RepeatWrapping;
          // console.log(mainU);
        }
      }
    }
  }
  initGUISelf(data, obj) {
    var gui = obj.gui;
    const guiItem = {};
    obj['guiItem'] = guiItem;
    var mainFolder = null;
    var mainU = data.EffectDic['main'].uniforms;
    var settingBHFolder = gui.addFolder({ key: '手动设置', isOpen: true });
    // console.log("GUI");
    initMainGUI();
    initBack();
    function initMainGUI() {
      initColor();
      //Levels
      var level1data = {
        uniform: mainU['level1'],
        key: 'level1',
        infos: [
          { displayName: '偏移', isSlider: true, min: 0.15, max: 0.8, name: 'Level1偏移' },
          { displayName: '长度', isSlider: true, name: 'Level1长度' },
        ],
      };
      const level1GUIItem = gui.addValue(level1data, settingBHFolder);
      guiItem['level1'] = level1GUIItem;
      var levelAlphaData = {
        uniform: mainU['levelAlpha'],
        info: { displayName: '透明过度范围', isSlider: true },
      };
      gui.addValue(levelAlphaData, settingBHFolder);

      var normaldata = {
        uniform: mainU['normalSetting'],
        key: 'normalSetting',
        infos: [
          { displayName: 'Normal缩放', isSlider: true, min: 0, max: 2, name: 'normal缩放' },
          { displayName: 'Normal强度', isSlider: true, max: 0.2, name: 'Normal强度' },
        ],
      };
      gui.addValue(normaldata, settingBHFolder);
      function initColor() {
        var colorFolder = gui.addFolder({ key: '颜色', isOpen: true, order: -1 });
        var topData = {
          uniform: mainU['topColor'],
          type: 'color',
          info: { displayName: '顶部颜色' },
        };
        var bottomData = {
          uniform: mainU['bottomColor'],
          type: 'color',
          info: { displayName: '底部颜色' },
        };
        var backGroundColorData = {
          uniform: mainU['backGroundColor'],
          type: 'color',
          info: { displayName: '背景颜色' },
        };
        gui.addValue(topData, colorFolder);
        gui.addValue(bottomData, colorFolder);
        gui.addValue(backGroundColorData, colorFolder);
      }
    }
    function initBack() {
      const folder = gui.addFolder({ key: '背景参数', isOpen: true });
      const normal2XData = {
        uniform: mainU.normal2X,
        key: 'normal2X',
        infos: [
          { displayName: '一层速度', isSlider: true, max: 10 },
          { displayName: '一层强度', isSlider: true, max: 1 },
          { displayName: '二层速度', isSlider: true, max: 10 },
          { displayName: '二层强度', isSlider: true, max: 1 },
        ],
      };
      gui.addValue(normal2XData, folder);
    }
  }

  animateSelf(data, obj, deltaTime) {
    var mainU = data.EffectDic['main'].uniforms;
    var t1 = data['animateParam']['t1'];
    // t1 += data['animateParam']['t1Forward'] ? 1 : -1;
    t1 += data['animateParam']['t1Forward'] ? 1 / 30 : -1 / 30;
    if (t1 >= 120) data['animateParam']['t1Forward'] = false;
    if (t1 <= 0) data['animateParam']['t1Forward'] = true;
    data['animateParam']['t1'] = t1;

    mainU.level1.value.y = (t1 / 120) * 0.2 + 0.34;
    // if (obj.guiItem) {
    //   obj.guiItem.level1.updateGUI();
    // }
    // obj.guiItem.level1GUIItem.updateGUI();
    // obj.gui.refreshGUI();
  }
}
export { HisRangePPS2 };

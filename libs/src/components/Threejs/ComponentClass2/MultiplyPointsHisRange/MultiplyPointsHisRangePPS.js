// import {GUIInit} from '../Tool/GUITypeInit';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GUIInitHisRange } from "../Tool/GUITypeInit";

import { MultiplyPointsHisrangeShader } from './Shader/MultiplyPointsHisrangeShader';
import texHeightPath from './Texture/ActiveFade_height.jpg';
import texBackLevelPath from './Texture/FadeCircle_backLevel.jpg';
import texGradientPath from './Texture/ActiveFade_gradient.jpg';
import texNormalPath from '../../GlobalTexture/Water_1_M_Normal.jpg';
import { GUIListInitData, GUIListInit } from '../Tool/GUIListInit';
class MultiplyPointsHisRangePPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = true;
    super(props);

  }
  initSelf(data, obj) {
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;

    initMainPass();

    function initMainPass() {
      CreateMain();
      function CreateMain() {

        mainPass = new ShaderPass(MultiplyPointsHisrangeShader());
        composer.addPass(mainPass);
        data.EffectDic['main'] = mainPass;
        var mainU = mainPass.uniforms;
        // InitTexture();
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
        }

      }

    }

  }
  initGUISelf(data, obj) {
    return;
    var gui = obj.gui;
    var mainU = data.EffectDic['main'].uniforms;
    initBigPoints();

    function initBigPoints() {
      const bigFolder = gui.addFolder({ folderName: '大点', isOpen: true });
      const guiListData = [];
      for (let index = 0; index < 10; index++) {
        guiListData.push(new getPointGUI(index));
      }
      var glid = new GUIListInitData(guiListData, 10, 10);
      var gli = new GUIListInit(gui, glid, bigFolder);


    }
    function getPointGUI(index) {
      const p = mainU.points1.value[index];
      const ps = mainU.pointsSet1.value[index];
      // console.log(p);
      // console.log(ps);
      this.initGUI = function (gui, folder) {
        var pData = {
          uniform: { value: p }, infos: [
            { displayName: "位置X", isSlider: true, min: -1, max: 2 },
            { displayName: "位置Y", isSlider: true, min: -1, max: 2 },
            { displayName: "深度", isSlider: true },
            { displayName: "是否显示", isBoolean: true },
          ]
        }
        gui.addValue(pData, folder);
        var psData = {
          uniform: { value: ps }, infos: [
            { displayName: "半径", isSlider: true, min: 0, max: 1 },
            { displayName: "畸变率", isSlider: true, min: 0.5, max: 2 },
            { displayName: "角度", isSlider: true, max: 360 },
            { displayName: "影响因素", isBoolean: true },
          ]
        }
        gui.addValue(psData, folder);
      }

    }

    // console.log("GUI");
    // initMainGUI();
    // function initMainGUI() {
    //   var mainFolder = null;
    //   var mainU = data.EffectDic['main'].uniforms;
    //   var settingBHFolder = gui.addFolder({ folderName: "手动设置", isOpen: true });

    //   initColor();
    //   //Levels
    //   var level1data = {
    //     uniform: mainU['level1'],
    //     infos: [
    //       { displayName: '偏移', isSlider: true, min: 0.15, max: 0.8, name: 'Level1偏移' },
    //       { displayName: '长度', isSlider: true, name: 'Level1长度' },
    //     ],
    //   };
    //   gui.addValue(level1data, settingBHFolder);
    //   var levelAlphaData =
    //   {
    //     uniform: mainU['levelAlpha'],
    //     infos: [
    //       { displayName: '透明过度范围', isSlider: true }
    //     ]
    //   }
    //   gui.addValue(levelAlphaData, settingBHFolder);

    //   var normaldata = {
    //     uniform: mainU['normalSetting'],
    //     infos: [
    //       { displayName: 'Normal缩放', isSlider: true, min: 0, max: 2, name: 'normal缩放' },
    //       { displayName: 'Normal强度', isSlider: true, max: 0.2, name: 'Normal强度' },
    //     ],
    //   };
    //   gui.addValue(normaldata, settingBHFolder);
    //   function initColor() {
    //     var colorFolder = gui.addFolder({ folderName: "颜色", isOpen: true, order: -1. });
    //     var topData = { uniform: mainU['topColor'], isColor: true, infos: [{ displayName: '顶部颜色' }] };
    //     var bottomData = { uniform: mainU['bottomColor'], isColor: true, infos: [{ displayName: '底部颜色' }] };
    //     var backGroundColorData = { uniform: mainU['backGroundColor'], isColor: true, infos: [{ displayName: '背景颜色' }] };
    //     gui.addValue(topData, colorFolder);
    //     gui.addValue(bottomData, colorFolder);
    //     gui.addValue(backGroundColorData, colorFolder);
    //   }
    // }
  }
}
export { MultiplyPointsHisRangePPS };
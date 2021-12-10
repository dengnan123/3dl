import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GUIInitEllipsePoints, GUIInitFloorFade, GUIInitHisRange } from '../Tool/GUITypeInit';
import { MuliplePointsFloorFadeShaderCreator } from './Shader/MultipleyPointsFloorFadeShader';
import jianbian from './Texture/jianbian.png';
import BackGround from './Texture/BackGround.png';

class MultiplyPointsFloorFadePPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = true;
    super(props);

  }
  initSelf(data, obj) {
    var gui = obj.gui;
    var mainPass;
    var mainU;
    var composer = obj.composer;
    initMainPass();
    function initMainPass() {
      CreateMainPass();
      InitTexture();
      function CreateMainPass() {
        var defaultUniform = {
          time: { value: new Vector2(0.0, 1.0) },
          screenSize: { value: data.screenSize },

          // x y z isDisplay
          points: {
            value: [
              new Vector4(0.75, 0.86, 0, 1.0),
              new Vector4(0.17, 0.1, 0, 1.0),
              new Vector4(0.17, 0.1, 0, 1.0),
            ],
          },
          // a b angle
          pointsSetting: {
            value: [
              new Vector4(0.37, 1.189, 0, 0),
              new Vector4(0.32, 1.021, 0, 0),
              new Vector4(0.17, 0.1, 0, 1.0),
            ],
          },
          globalRScale: { value: 1.0 },

          floorFadeSetting: { value: new Vector3(12.0, 0.8, 0.5) },
          floorFadeSpeedT: { value: 0 },
          hisRange: { value: new Vector2(0.8, 0.2) },
          gradientTex: { value: null },
          groundTex: { value: null },
        };
        mainPass = new ShaderPass(MuliplePointsFloorFadeShaderCreator(defaultUniform));
        composer.addPass(mainPass);
        data.EffectDic['main'] = mainPass;
        mainU = mainPass.uniforms;
      }
      function InitTexture() {
        var texPathDic = data.texPathDic;
        if (texPathDic.gradientTex) {
          mainU['gradientTex'].value = new THREE.TextureLoader().load(texPathDic.gradientTex);
        } else {
          mainU['gradientTex'].value = new THREE.TextureLoader().load(jianbian);
        }
        if (texPathDic.groundTex) {
          mainU['groundTex'].value = new THREE.TextureLoader().load(texPathDic.gradientTex);
        } else {
          mainU['groundTex'].value = new THREE.TextureLoader().load(BackGround);
        }
      }
    }


  }
  initGUISelf(data, obj) {
    return;
    var gui = obj.gui;
    var mainPass = data.EffectDic['main'];
    var mainU = mainPass.uniforms;

    initGUI();
    function initGUI() {
      var mainFolder = null;
      initPoints();
      initFade();
      function initPoints() {
        var pointsFolder = gui.addFolder({
          folderName: '椭圆点列',
          order: 0,
          parent: mainFolder,
          isOpen: true,
          key: '椭圆点列_1',
        });
        var guiInitPoints = GUIInitEllipsePoints(
          gui,
          MuliplePointsFloorFadeShaderCreator,
          mainPass,
          'points',
          'pointsSetting',
          pointsFolder,
        );
      }
      function initFade() {
        var ffFolder = gui.addFolder({
          folderName: '渐变',
          order: 1,
          parent: mainFolder,
          isOpen: true,
        });
        var guiFloorFade = GUIInitFloorFade(gui, mainU.floorFadeSetting, ffFolder);
        var guiHisRange = GUIInitHisRange(gui, mainU.hisRange, ffFolder);
      }
    }
  }

  animateSelf(data, obj, deltaTime, isLog) {
    isLog && console.log("MultiplyPointsFloorFadePPS");

    var mainU = data.EffectDic['main'].uniforms;
    mainU['floorFadeSpeedT'].value += deltaTime * mainU['floorFadeSetting'].value.z;
  }
}




export { MultiplyPointsFloorFadePPS };

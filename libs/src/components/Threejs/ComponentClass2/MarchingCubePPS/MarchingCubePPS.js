// import {GUIInit} from '../Tool/GUITypeInit';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { MultiplePointNoiseShaderCreator } from './Shader/MultiplePointNoiseShader';
import { GUIInitEllipsePoints, GUIInitScreenNoise } from "../Tool/GUITypeInit";

class MarchingCubePPS extends BasePPS {
  constructor(props) {
    props['isBlur'] = false;
    super(props);

  }
  initSelf(data, obj) {
    // console.log("Self");
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    initMainPass();

    function initMainPass() {
      CreateMain();

      function CreateMain() {
        data['camera'] = new THREE.PerspectiveCamera(45, window.innerWidth, window.innerHeight);
      }
    }
  }
  initGUISelf(data, obj) {
    var gui = obj.gui;
    // var mainPass = data.EffectDic['main'];
    // console.log("GUI");
    // initGUI();
    // function initGUI() {
    //     var mainFolder = null;
    //     initPoints();
    //     initColors();
    //     initNoise();
    //     function initPoints() {
    //         var pointsFolder = gui.addFolder({ folderName: "椭圆点列", order: 0, parent: mainFolder, isOpen: true, key: "椭圆点列_1" });
    //         var guiInitPoints = new GUIInitEllipsePoints(gui, MultiplePointNoiseShaderCreator, mainPass, "points", "pointsSetting", pointsFolder)

    //     }
    //     function initColors() {
    //         var colorFolder = gui.addFolder({ folderName: "颜色", order: 1 });
    //         var cdata = { uniform: mainPass.uniforms.u_Color, isColor: true, infos: [{ displayName: "顶点颜色" }] };
    //         var c2data = { uniform: mainPass.uniforms.u_GroundColor, isColor: true, infos: [{ displayName: "背景颜色" }] };
    //         var cl = gui.addValue(cdata, colorFolder);
    //         var cl2 = gui.addValue(c2data, colorFolder);
    //         console.log(mainPass.uniforms.smoothStep1);

    //         //SmoothStep Fade
    //         var smoothStepData = {
    //             uniform: mainPass.uniforms.smoothStep1,
    //             infos: [
    //                 { displayName: "偏置位置", order: 1, isSlider: true, min: 0.01, max: 0.99 },
    //                 { displayName: "偏置宽度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
    //                 { displayName: "随时间潮汐强度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
    //                 { displayName: "随时间潮汐速度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
    //             ]
    //         };
    //         var ssl = gui.addValue(smoothStepData, colorFolder);

    //         //贝塞尔曲线
    //         var bezierData = {
    //             uniform: mainPass.uniforms.u_bezierP1,
    //             infos: [
    //                 { isPass: true },
    //                 { displayName: "中心Y", isSlider: true }
    //             ]
    //         }
    //         var bezierL = gui.addValue(bezierData, colorFolder);
    //     }
    //     function initNoise() {
    //         var folder = gui.addFolder({ folderName: '噪声', order: 2 });
    //         GUIInitScreenNoise(gui, mainPass, folder);
    //     }

    // }

  }
}
export { MarchingCubePPS };


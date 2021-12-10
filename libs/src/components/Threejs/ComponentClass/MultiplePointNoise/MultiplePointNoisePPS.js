// import {GUIInit} from '../Tool/GUITypeInit';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { MultiplePointNoiseShaderCreator } from './Shader/MultiplePointNoiseShader';
import { GUIInitEllipsePoints, GUIInitScreenNoise } from "../Tool/GUITypeInit";
class MultiplePointNoisePPS extends BasePPS {
    constructor(props) {
        props.data['domID'] = props.data['domID'] || "WebGL_MultiplePointNoisePPS";
        super(props);
    }
    initMain(data, obj) {
        var gui = obj.gui;
        var mainPass;
        var composer = obj.composer;

        initMainPass();

        function initMainPass() {
            CreateMain();
            initGUI();

            function CreateMain() {
                var defaultUniform = {
                    "time": { value: data.time },
                    "u_Color": { value: new Vector3(0.945, 0.8196, 0.0588) },
                    "u_GroundColor": { value: new Vector3(0.5333334, 0.2313, 0.8941) },
                    "u_bezierP1": { value: new Vector2(0.5, 0.77) },
                    "screenSize": { value: data.screenSize },
                    // x y z isDisplay
                    "points": {
                        value: [
                            new Vector4(-0.12, 0.87, 0, 1.0),
                            new Vector4(1.22, 0.67, 0, 1.0),
                            new Vector4(0.5, -0.19, 0, 1.0),
                        ]
                    },
                    // a b angle 
                    "pointsSetting": {
                        value: [
                            new Vector4(0.37, 1.081, 90, 0),
                            new Vector4(0.26, 1.0, 0, 0),
                            new Vector4(0.5, 1.4, 0, 0),
                        ]
                    },
                    'globalRScale': { value: 1.0 },

                    'screenNoise': { value: new Vector3(370.0, 0.06, 0.13) },
                    'smoothStep1': { value: new Vector4(0.53, 0.39, 0.2, 6.62 / 2.0) },
                };
                mainPass = new ShaderPass(MultiplePointNoiseShaderCreator(defaultUniform));
                composer.addPass(mainPass);
                data.EffectDic['main'] = mainPass;

            }
            function initGUI() {
                var mainFolder = null;
                initPoints();
                initColors();
                initNoise();
                function initPoints() {
                    var pointsFolder = gui.addFolder({ folderName: "椭圆点列", order: 0, parent: mainFolder, isOpen: true, key: "椭圆点列_1" });
                    var guiInitPoints = new GUIInitEllipsePoints(gui, MultiplePointNoiseShaderCreator, mainPass, "points", "pointsSetting", pointsFolder)

                }
                function initColors() {
                    var colorFolder = gui.addFolder({ folderName: "颜色", order: 1 });
                    var cdata = { uniform: mainPass.uniforms.u_Color, isColor: true, infos: [{ displayName: "顶点颜色" }] };
                    var c2data = { uniform: mainPass.uniforms.u_GroundColor, isColor: true, infos: [{ displayName: "背景颜色" }] };
                    var cl = gui.addValue(cdata, colorFolder);
                    var cl2 = gui.addValue(c2data, colorFolder);
                    console.log(mainPass.uniforms.smoothStep1);

                    //SmoothStep Fade
                    var smoothStepData = {
                        uniform: mainPass.uniforms.smoothStep1,
                        infos: [
                            { displayName: "偏置位置", order: 1, isSlider: true, min: 0.01, max: 0.99 },
                            { displayName: "偏置宽度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
                            { displayName: "随时间潮汐强度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
                            { displayName: "随时间潮汐速度", order: 1, isSlider: true, min: 0.01, max: 0.99 },
                        ]
                    };
                    var ssl = gui.addValue(smoothStepData, colorFolder);

                    //贝塞尔曲线
                    var bezierData = {
                        uniform: mainPass.uniforms.u_bezierP1,
                        infos: [
                            { isPass: true },
                            { displayName: "中心Y", isSlider: true }
                        ]
                    }
                    var bezierL = gui.addValue(bezierData, colorFolder);
                }
                function initNoise() {
                    var folder = gui.addFolder({ folderName: '噪声', order: 2 });
                    GUIInitScreenNoise(gui, mainPass, folder);
                }

            }
        }


    }
    animate(data, obj) {
    }


}
export default MultiplePointNoisePPS;
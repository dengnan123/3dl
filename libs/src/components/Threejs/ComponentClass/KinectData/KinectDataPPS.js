import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GUIInitEllipsePoints, GUIInitScreenNoise, GUIInitBezier4P } from "../Tool/GUITypeInit";
import { KinectManager } from 'three/examples/Kinect2/KinectManager';
import { KinectDataDiplayShader } from './Shader/KinectDataDisplayShader';
class KinectDataPPS extends BasePPS {
    constructor(props) {
        props.data['domID'] = props.data['domID'] || "WebGL_KinectDataPPS";
        props.data['kinect'] = props.data['kinect'] || new KinectManager({ infos: ['color', 'depth', 'body'] });
        super(props);
    }
    initMain(data, obj) {
        var gui = obj.gui;
        var mainPass;
        var mainU;
        var composer = obj.composer;
        data['isBlur'] = false;

        initKinectron();
        initMainPass();

        function initKinectron() {
        }
        function initMainPass() {
            CreateMain();
            initGUI();
            var defaultUniform = null;
            function CreateMain() {
                mainPass = new ShaderPass(KinectDataDiplayShader(defaultUniform));
                composer.addPass(mainPass);
                data.EffectDic['main'] = mainPass;
                mainU = mainPass.uniforms;
                mainU.colorTex.value = obj.kinect.receiveData['color'].value;
                mainU.depthTex.value = obj.kinect.receiveData['depth'].value;
                mainU.screenSize.value = data.screenSize;
            }
            function initGUI(params) {

            }
        }


    }
    animate(data, obj) {
        var kinect = obj.kinect;
        var joint = kinect.receiveData['body'].value;
        var mainU = data.EffectDic['main'].uniforms;
        var ljs = mainU['jointLeft'].value;
        var rjs = mainU['jointRight'].value;
        if (joint) {
            for (let index = 0; index < 6; index++) {
                if (joint[index]) {
                    if (joint[index].tracked) {
                        var jsd = joint[index].joints;
                        // console.log(jsd[7]);
                        if (jsd[7]) {
                            ljs[index].set(jsd[7].colorX, 1 - jsd[7].colorY, 1);
                            // console.log(ljs[index]);
                        }
                        if (jsd[11]) {
                            rjs[index].set(jsd[11].colorX, 1 - jsd[11].colorY, 1);
                            // console.log(rjs[index]);
                        }
                        continue;
                    }
                }
                ljs[index].set(0, 0, 0);
                rjs[index].set(0, 0, 0);
            }
        }
        else {
            for (let index = 0; index < 6; index++) {
                ljs[index].set(0, 0, 0);
                rjs[index].set(0, 0, 0);
            }
        }
    }


}
export default KinectDataPPS;
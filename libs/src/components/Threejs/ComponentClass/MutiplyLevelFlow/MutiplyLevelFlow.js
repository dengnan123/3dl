
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GUIInitEllipsePoints, GUIInitFloorFade, GUIInitHisRange } from "../Tool/GUITypeInit";
import { MultiplyLevelFlowShader } from './Shader/ThreeLevelFlowShader';
import { ShaderMaterial } from 'three';

import texHeightPath from './Texture/New_Graph_height.jpg';
import texGradientPath from './Texture/jianbianAVG.png';
import texNormal1Path from './Texture/Water_1_M_Normal.jpg';
import texNormal2Path from './Texture/Water_2_M_Normal.jpg';
import texShuiMoPath from './Texture/shuimo.png';
class MultiplyLevelFlowPPS extends BasePPS {
    constructor(props) {
        props.data['domID'] = props.data['domID'] || "WebGL_MultiplePointsFloorFade";
        super(props);

    }
    initMain(data, obj) {
        var gui = obj.gui;
        var mainPass;
        var mainU;
        var composer = obj.composer;
        initMainPass();

        initGUI();

        function initMainPass() {
            CreateMainPass();
            InitTexture();
            function CreateMainPass() {
                var defaultUniform = null;
                mainPass = new ShaderPass(MultiplyLevelFlowShader(defaultUniform));
                composer.addPass(mainPass);
                data.EffectDic['main'] = mainPass;
                mainU = mainPass.uniforms;
            }
            function InitTexture() {
                var texPathDic = data.texPathDic;
                var texName;
                var tex;
                //高度图
                if (texName = texPathDic.heightMap) {
                    tex = new THREE.TextureLoader().load(texName);
                    mainU['heightTex'].value = tex;
                }
                else {
                    tex = new THREE.TextureLoader().load(texHeightPath);
                    mainU['heightTex'].value = tex;

                }
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;

                //渐变
                if (texName = texPathDic.gradientTex) {
                    tex = new THREE.TextureLoader().load(texName);
                    mainU['gradientTex'].value = tex;
                }
                else {
                    tex = new THREE.TextureLoader().load(texGradientPath);
                    mainU['gradientTex'].value = tex;

                }
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;

                //法线1
                if (texName = texPathDic.normalTex1) {
                    tex = new THREE.TextureLoader().load(texName);;
                    mainU['normalTex1'].value = tex;
                }
                else {
                    tex = new THREE.TextureLoader().load(texNormal1Path);
                    mainU['normalTex1'].value = tex;
                }
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;

                //法线2
                if (texName = texPathDic.normalTex2) {
                    tex = new THREE.TextureLoader().load(texName);
                    mainU['normalTex2'].value = tex;
                }
                else {
                    tex = new THREE.TextureLoader().load(texNormal2Path);
                    mainU['normalTex2'].value = tex;

                }
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;

                //水墨
                if (texName = texPathDic.waterTex) {
                    tex = new THREE.TextureLoader().load(texName);
                    mainU['waterTex'].value = tex;
                }
                else {
                    tex = new THREE.TextureLoader().load(texShuiMoPath);
                    mainU['waterTex'].value = tex;

                }
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
            }
        }
        function initGUI() {
            initLevel();

            function initLevel() {
                var levelSettings = mainU['levelSetting'].value;
                var levelUVSettings = mainU['levelUVSetting'].value;
                var settingStore = [];
                var uvSettingStore = [];

                initValue();
                initGUI();
                function initValue() {
                    if (levelSettings.length != levelUVSettings.length) {
                        throw 'levelSettings和levelUVSetting数组长度不一致';
                    }
                    for (let index = 0; index < levelSettings.length; index++) {
                        settingStore.push(levelSettings[index]);
                        uvSettingStore.push(levelUVSettings[index]);
                    }
                    for (let index = levelSettings.length; index < 10; index++) {
                        settingStore.push(new Vector4(0.5, 0.5, 0.25, 0.25));
                        uvSettingStore.push(new Vector4(0, 0, 1, 0.5));
                    }
                }
                function initGUI() {
                    initStep();




                    var globalFolder = gui.addFolder({ folderName: '全局变量', key: 'Global层', isOpen: true })
                    var normalSettingData = {
                        uniform: mainU['normalSetting'], infos: [
                            { displayName: '方向X', isSlider: true },
                            { displayName: '方向Y', isSlider: true },
                            { displayName: '速度', isSlider: true, max: 10 },
                            { displayName: '强度', isSlider: true },
                        ]
                    };
                    gui.addValue(normalSettingData, globalFolder);
                    var smoothstepData = {
                        uniform: mainU['uvSmoothStepRange'], infos: [
                            { displayName: '平滑偏置', isSlider: true },
                            { displayName: '平滑长度', isSlider: true },
                        ]
                    };
                    gui.addValue(smoothstepData, globalFolder);

                    var stepFadeWidthData = {
                        uniform: mainU['stepFadeWidth'], infos: [
                            { displayName: "层渐变宽度", isSlider: true, max: 2 }
                        ]
                    }
                    gui.addValue(stepFadeWidthData, globalFolder);


                    function initStep() {
                        var mainFolder = gui.addFolder({ folderName: '层', key: 'Level层', isOpen: true });
                        var sonFolders = [];


                        for (let index = 0; index < 10; index++) {
                            var folder = gui.addFolder({ folderName: `第${index + 1}层`, parent: mainFolder, isHide: index >= levelSettings.length });
                            sonFolders.push(folder);
                            var data = {
                                uniform: { value: settingStore[index] }, infos: [
                                    { displayName: '层位置Step', isSlider: true },
                                    { displayName: '颜色Step', isSlider: true },
                                    { displayName: '流动速度', isSlider: true },
                                    { displayName: '流动强度', isSlider: true },
                                ]
                            }
                            gui.addValue(data, folder);
                            var dataUV = {
                                uniform: { value: uvSettingStore[index] }, infos: [
                                    { displayName: '偏置X', isSlider: true },
                                    { displayName: '偏置Y', isSlider: true },
                                    { displayName: '缩放', isSlider: true, max: 3 },
                                    { displayName: "法线贴图Alpha", isSlider: true }
                                ]
                            }
                            gui.addValue(dataUV, folder);
                        }
                        var numData = {
                            uniform: { value: levelSettings.length }, infos: [
                                { displayName: '层数量', isSlider: true, min: 1, max: 10, delta: 1 },
                            ], func: [onNumChange]
                        };
                        gui.addValue(numData, mainFolder);

                        function onNumChange(value) {
                            if (levelSettings.length != value) {
                                // var levelSettings = mainU['levelSetting'].value;
                                // var levelUVSettings = mainU['levelUVSetting'].value;
                                // var settingStore = [];
                                // var uvSettingStore = [];
                                levelSettings.splice(0, levelSettings.length);
                                levelUVSettings.splice(0, levelUVSettings.length);
                                levelSettings.push(...settingStore.slice(0, value));
                                levelUVSettings.push(...uvSettingStore.slice(0, value));
                                var shader = MultiplyLevelFlowShader({}, { levelCount: value });
                                mainPass.material = new ShaderMaterial(
                                    {
                                        defines: Object.assign({}, shader.defines),
                                        uniforms: mainPass.uniforms,
                                        vertexShader: shader.vertexShader,
                                        fragmentShader: shader.fragmentShader
                                    }
                                )
                                resetPointsGUI(value);
                            }
                        }
                        function resetPointsGUI(value) {
                            for (let index = 0; index < value; index++) {
                                var sonFolder = sonFolders[index].folder;
                                sonFolder.show();
                            }
                            for (let index = value; index < 10; index++) {
                                var sonFolder = sonFolders[index].folder;
                                sonFolder.hide();
                            }
                        }
                    }
                }
            }
        }
    }
    animate(data, obj, deltaTime) {
        var gui = obj.gui;
        var mainU = data.EffectDic['main'].uniforms;
        mainU['normalSettingT'].value += deltaTime * mainU['normalSetting'].value.z;
    }
}

export default MultiplyLevelFlowPPS;
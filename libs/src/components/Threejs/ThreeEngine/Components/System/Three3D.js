import { WebGLRenderer, Vector2, TextureLoader, RepeatWrapping } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { CameraManager } from './Three3D/CameraManager';
// import { InstanceManager } from './Three3D/InstanceManager';
import { LightManager } from './Three3D/LightManager';
import { SceneManager } from './Three3D/SceneManager';

// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutlinePass } from '../SaveModuleFile/outlinePass';

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { GUIStats } from './GUI/GUIStat';
import { GUIManager } from './GUI/GUIManager';
import CustomStyle from './GUI/GUIStack/Node/CustomStyle';
import { SelectionManager } from './Three3D/SelectionManager';
import outlinePaternTexPath from '../../../3D/textures/tri_pattern.jpg';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { HorizontalNormalBlurShader } from "../../Shader/PostProcess/HorizontalNormalBlur";
import { LightScanPass } from './Three3D/Pass/LightScan/LightScanPass';
import { RenderPassDepth } from './Three3D/Pass/RenderPassDepth/RenderPassDepth';
// import { Scene } from '../../../3D/build/three.module';

var Three3D = function (eventComp, infos) {
    const { animate, screenSize } = eventComp;
    let container = null;
    let renderer = null;
    let composer = null;
    const effects = {};

    let sceneManager = null;
    let cameraManager = null;
    let lightManager = null;
    // let instanceManager = null;

    let selectionManager = null;

    const resolution = new Vector2();
    const GUI = {};





    function animateFunc(deltaTime) {
        composer.render(deltaTime);
        // console.log(deltaTime);
    }
    init();

    function init() {

        const { domID, notNeedScene, isTransparent } = infos;

        //初始化container
        container = document.getElementById(domID);
        container.style.position = "relative";
        //初始化renderer
        renderer = new WebGLRenderer({ antialias: true, alpha: isTransparent });
        renderer.setPixelRatio(window.devicePixelRatio);
        // // renderer.toneMapping = ReinhardToneMapping;
        // renderer.domElement.style.width = `${infos.screenSize[0] * infos.screenScale}px`;
        // renderer.domElement.style.height = `${infos.screenSize[1] * infos.screenScale}px`;
        container.appendChild(renderer.domElement);


        if (isTransparent) {
            renderer.setClearColor(0xEEEEEE, 0.0);
        }
        initGUI();

        initComposer();


        GUI.gui.draw();
        function initComposer() {
            //初始化Composer
            composer = new EffectComposer(renderer);
            if (notNeedScene) {
                console.warn("已经禁用Scene");
            }
            else {
                resolution.copy(eventComp.screenSize.size);

                //初始化场景
                sceneManager = new SceneManager(eventComp, GUI.gui)
                //初始化摄像机
                cameraManager = new CameraManager(eventComp, renderer.domElement, sceneManager.scene, GUI.gui);
                //初始化光源
                lightManager = new LightManager(eventComp, sceneManager.scene, GUI.gui);
                //初始化composer
                composer = new EffectComposer(renderer);
                // //初始化renderPass
                // let renderPass = new RenderPass(sceneManager.scene, cameraManager.camera);
                // effects['renderPass'] = renderPass;
                // composer.addPass(renderPass);

                let renderPass = new RenderPassDepth(sceneManager.scene, cameraManager.camera, resolution);
                effects['renderPass'] = renderPass;
                composer.addPass(renderPass);


                //初始化GPU Instance Manager
                // instanceManager = new InstanceManager(eventComp, sceneManager.scene);

                // console.log(eventComp.screenSize);
                //初始化Outline
                const outlinePass = new OutlinePass(resolution, sceneManager.scene, cameraManager.camera);
                effects['outlinePass'] = outlinePass;
                composer.addPass(outlinePass);
                const textureLoader = new TextureLoader();
                textureLoader.load(outlinePaternTexPath, function (texture) {

                    outlinePass.patternTexture = texture;
                    texture.wrapS = RepeatWrapping;
                    texture.wrapT = RepeatWrapping;

                });
                //初始化SMAA
                const SMAA = new SMAAPass(eventComp.screenSize.size.x * renderer.getPixelRatio(), eventComp.screenSize.size.y * renderer.getPixelRatio());
                composer.addPass(SMAA);
                effects['SMAA'] = SMAA;


                //扫光
                const lightScan = new LightScanPass(eventComp.screenSize.size, sceneManager.scene, cameraManager.camera, animate.time);
                composer.addPass(lightScan);
                effects['lightScan'] = lightScan;
                lightScan.depthTexture = renderPass.renderTarget.depthTexture;



                //Bloom
                const bloomPass = new UnrealBloomPass(resolution, 1.58, 0.68, 0.17);
                composer.addPass(bloomPass);
                effects['bloom'] = bloomPass;


                //blur
                const blurPass = new ShaderPass(HorizontalNormalBlurShader);
                composer.addPass(blurPass);
                effects['blurH'] = blurPass;
                blurPass.uniforms.h.value = 1 / eventComp.screenSize.size.x;



                //初始化Selection
                selectionManager = new SelectionManager(eventComp, GUI);

                initSettingGUI();
                function initSettingGUI() {
                    const { gui } = GUI;
                    const ppsFolder = gui.addSystemFolder({ key: "PostProcess", name: "屏幕后处理", isOpen: true, order: 99, style: CustomStyle.red });


                    outlineGUI();
                    ScanLightGUI();
                    bloomGUI();
                    blurGUI();
                    function outlineGUI() {
                        const outlineFolder = ppsFolder.addFolder({ key: "Outline", name: "描边" });
                        const edgeStreData = {
                            uniform: { value: outlinePass.edgeStrength }, key: "edgeStrength", info: { isSlider: true, max: 10, min: 0.01 }, onChange: (val) => {
                                outlinePass.edgeStrength = val;
                            }
                        };
                        const edgeGlowData = {
                            uniform: { value: outlinePass.edgeGlow }, key: "edgeGlow", info: { isSlider: true }, onChange: (val) => {
                                outlinePass.edgeGlow = val;
                            }
                        };
                        const edgeThickData = {
                            uniform: { value: outlinePass.edgeThickness }, key: "edgeThickness", info: { isSlider: true, max: 10 }, onChange: (val) => {
                                outlinePass.edgeThickness = val;
                            }
                        };
                        const edgePulsePeriodData = {
                            uniform: { value: outlinePass.pulsePeriod }, key: "pulsePeriod", info: { isSlider: true }, onChange: (val) => {
                                outlinePass.pulsePeriod = val;
                            }
                        };
                        const visibleColorData = { uniform: { value: outlinePass.visibleEdgeColor }, key: "visibleColor" };
                        const hiddenEdgeColorData = { uniform: { value: outlinePass.hiddenEdgeColor }, key: "hiddenEdgeColor" };
                        const usePaternData = {
                            uniform: { value: outlinePass.usePatternTexture }, key: "usePatternTexture", onChange: (val) => {
                                outlinePass.usePatternTexture = val;
                            }
                        };
                        outlineFolder.addValue(edgeStreData);
                        outlineFolder.addValue(edgeGlowData);
                        outlineFolder.addValue(edgeThickData);
                        outlineFolder.addValue(edgePulsePeriodData);
                        outlineFolder.addValue(visibleColorData);
                        outlineFolder.addValue(hiddenEdgeColorData);
                        outlineFolder.addValue(usePaternData);
                    }

                    function ScanLightGUI() {
                        const slFolder = ppsFolder.addFolder({ key: "ScanLight", name: "扫光", isOpen: true });
                        const slPass = lightScan;
                        const slUni = slPass.uniforms;

                        slFolder.addValue({ key: "scanColor", uniform: slUni._scanColor, isShowVector: true, info: { name: "颜色" } });
                        slFolder.addValue({ key: 'scanPower', uniform: slUni._scanPower, info: { isSlider: true, max: 10, name: "颜色强度" } });
                        slFolder.addValue({
                            key: "scanOption", uniform: slUni._scanOp, infos: [
                                { key: 'angle', name: "角度", isSlider: true, max: 360 },
                                { key: 'length', name: "周期长度", isSlider: true, max: 10000, delta: 1 },
                                { key: 'percent', name: "百分比", isSlider: true, max: 1 },
                                { key: 'speed', name: "速度", isSlider: true, max: 5000, delta: 1 },
                            ]
                        })

                        const rangeFolder = slFolder.addFolder({ key: "RangeFolder", name: "范围" });
                        //中心
                        rangeFolder.addValue({
                            key: "scanCenter", uniform: slUni._scanCenter, headName: "范围中心", infos: [
                                { key: "X" }, { key: "Y" }, { key: "Z" }
                            ]
                        });
                        //半径
                        rangeFolder.addValue({
                            key: "scaneDistance", uniform: slUni._scanDistance, name: "范围半径", info: { isSlider: true, max: 10000, delta: 1 }
                        })
                        //底高
                        rangeFolder.addValue({
                            key: "scanHeightRange", uniform: slUni._scanHeight, infos: [{ key: "底", min: -500, max: 0, delta: 1 }, { key: "顶", min: 0, max: 500, delta: 1 }]
                        })
                    }

                    function bloomGUI() {
                        const folder = ppsFolder.addFolder({ key: "Bloom", name: "发光" });
                        const exposureData = {
                            uniform: { value: 1 }, key: "exposure", info: { isSlider: true, max: 2, min: 0.1 }, onChange: (val) => {
                                renderer.toneMappingExposure = Math.pow(val, 4.0);
                            }
                        };
                        const bloomThresholdData = {
                            uniform: { value: bloomPass.threshold }, key: "threshold", info: { isSlider: true }, onChange: (val) => {
                                bloomPass.threshold = val;
                            }
                        };

                        const bloomStrengthData = {
                            uniform: { value: bloomPass.strength }, key: "strength", info: { isSlider: true, max: 3 }, onChange: (val) => {
                                bloomPass.strength = val;
                            }
                        };

                        const bloomRadiusData = {
                            uniform: { value: bloomPass.radius }, key: "radius", info: { isSlider: true }, onChange: (val) => {
                                bloomPass.radius = val;
                            }
                        };
                        folder.addValue(exposureData);
                        folder.addValue(bloomThresholdData);
                        folder.addValue(bloomStrengthData);
                        folder.addValue(bloomRadiusData);
                    }

                    function blurGUI() {
                        const blurFolder = ppsFolder.addFolder({ key: "Blur", name: "水平边缘模糊", isOpen: true });
                        const uni = effects.blurH.uniforms;
                        blurFolder.addValue({ uniform: uni.hScale, key: 'hScale', name: "强度", info: { isSlider: true, min: 0.0001, max: 10 } });
                        blurFolder.addValue({
                            uniform: uni.smoothStepV, key: 'ssv', headName: "偏置", infos: [
                                { key: "偏移", isSlider: true, min: 0.0001, max: 1 },
                                { key: "宽度", isSlider: true, min: 0.0001, max: 1 }
                            ]
                        });
                        blurFolder.addValue({ uniform: uni.colorScale, key: "colorScale", name: "暗处颜色倍率", info: { isSlider: true } });
                    }


                }
            }

            var onScreenSizeChange = (val, force, scale) => {
                renderer.setSize(val.x, val.y);
                renderer.domElement.style.width = `${val.x * scale}px`;
                renderer.domElement.style.height = `${val.y * scale}px`;
                composer.setSize(val.x, val.y);
                effects.outlinePass.setSize(val.x, val.y);
                effects.SMAA.setSize(val.x, val.y);
                effects.bloom.setSize(val.x, val.y);
                // effects.DOF.setSize(val.x, val.y);
                // console.log(composer);
                console.log(`更新屏幕大小 Width:${val.x} Height:${val.y}`);
            }
            screenSize.addListener('Three3D', onScreenSizeChange);
            //开始加入渲染
            // console.log(animate)
            animate.SetRenderAnimate(animateFunc);
        }
        function initGUI() {
            //GUI
            GUI['stats'] = new GUIStats(eventComp, infos.domID, container);
            GUI.stats.setActive(true);
            const gui = new GUIManager(eventComp, infos, false);
            GUI['gui'] = gui;

            gui.addSystemValue({ uniform: { value: animate.pause }, key: "pause", name: "Pause", order: 9999, onChange: (val) => { animate.pause = val }, style: CustomStyle.red });
        }
    }


    Object.defineProperty(this, "obj", {
        get: function () { return { container, renderer, scene: sceneManager.scene, camera: cameraManager.camera } },
    })
    Object.defineProperty(this, "Effects", {
        get: function () { return { composer, effects } },
    })
    Object.defineProperty(this, "scene", {
        get: function () { return sceneManager.scene },
    })
    Object.defineProperty(this, "sceneManager", {
        get: function () { return sceneManager },
    })
    Object.defineProperty(this, "sceneGroup", {
        get: function () { return sceneManager.group },
    })
    Object.defineProperty(this, "outlinePass", {
        get: function () { return effects.outlinePass },
    })
    Object.defineProperty(this, "cameraManager", {
        get: function () { return cameraManager },
    })
    Object.defineProperty(this, "selection", {
        get: function () { return selectionManager },
    })
    Object.defineProperty(this, "selectionManager", {
        get: function () { return selectionManager },
    })
    Object.defineProperty(this, "lightManager", {
        get: function () { return lightManager },
    })
    Object.defineProperty(this, "gui", {
        get: function () { return GUI.gui },
    })






}


export { Three3D }
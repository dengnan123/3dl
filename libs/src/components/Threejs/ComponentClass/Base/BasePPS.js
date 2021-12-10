import React from 'react';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';

// import {GUIInit} from '../Tool/GUITypeInit';

import { GUIManager } from '../Tool/GUIManager';
class BasePPS extends React.Component {
  constructor(props) {
    super(props);
    this.data = {
      time: new Vector2(0.1, 1.0),
      EffectDic: {},
      domID: props.data.domID || 'WebGL-output-PPS',
      screenSize: new Vector2(1080 / 2, 1920 / 2),
      uniformDic: props.data.uniformDic || {},
      texPathDic: props.data.texPathDic || {},
      GUITypeInit: {},
      isBlur: true,
      kinectFrameIndex: 0,
    };
    this.obj = {
      renderer: null,
      composer: null,
      container: null,
      gui: null,
      kinect: props.data['kinect'],
    };
  }
  setSize(width, height) {
    this.data.screenSize.set(width, height);
    this.obj.renderer.setSize(width, height);
    this.obj.composer.setSize(width, height);
  }

  copyDataToUniforms(preProps, data, gui) {
    const effects = preProps?.data?.effects;
    if (!effects) {
      return;
    }
    const { EffectDic } = data;
    for (const [key, value] of Object.entries(effects)) {
      for (const [uname, uvalue] of Object.entries(value)) {
        const uni = EffectDic[key]['uniforms'][uname];
        if (!uni) {
          console.log(key, uname, '不存在..');
          continue;
        }
        if (uvalue.length === 1) {
          EffectDic[key]['uniforms'][uname].value = uvalue[0];
          continue;
        }
        if (uvalue.length === 2) {
          EffectDic[key]['uniforms'][uname].value.set(uvalue[0], uvalue[1]);
          continue;
        }
        if (uvalue.length === 3) {
          EffectDic[key]['uniforms'][uname].value.set(uvalue[0], uvalue[1], uvalue[2]);
          continue;
        }
        if (uvalue.length === 4) {
          EffectDic[key]['uniforms'][uname].value.set(uvalue[0], uvalue[1], uvalue[2], uvalue[3]);
          continue;
        }
      }
    }
    gui.refreshGUI();
  }
  initFromProps(props, obj) {
    const { data } = props;
    // console.log(data);
    if (data.isShowGUI) {
      obj.gui.show();
    } else {
      obj.gui.hide();
    }
    if (data.isShowStats) {
      obj.gui.showStats();
    } else {
      obj.gui.hideStats();
    }

    // return;
    obj.gui.showStats();
    obj.gui.show();
  }

  componentDidMount() {
    this.initThree();
    this.initFromProps(this.props, this.obj);
    if (this.props.data.screenSize) {
      this.setSize(this.props.data.screenSize[0], this.props.data.screenSize[1]);
    }

    let isMove = false;
    let startX, startY;

    const guiDomContainer = document.getElementById(`${this.data.domID}-GUIContainer`);
    const guiDom = document.getElementById(`${this.data.domID}-GUIController`);

    const handleMousedown = e => {
      isMove = true;
      startX = e.pageX;
      startY = e.pageY;
    };

    const handleMousemove = e => {
      if (!isMove) return;

      const walkX = startX - e.pageX;
      const walkY = e.pageY - startY;
      startX = e.pageX;
      startY = e.pageY;

      let guiStyle = getComputedStyle(guiDom);
      let currentTop = parseInt(guiStyle.top.replace('px', ''));
      let currentRight = parseInt(guiStyle.right.replace('px', ''));

      guiDom.style.top = currentTop + walkY + 'px';
      guiDom.style.right = currentRight + walkX + 'px';
    };

    const handleMouseup = e => {
      e.preventDefault();
      isMove = false;
      startX = null;
      startY = null;
    };

    guiDom.addEventListener('mousedown', handleMousedown, false);
    guiDom.addEventListener('mousemove', handleMousemove, false);
    guiDomContainer.addEventListener('mouseup', handleMouseup, false);
  }

  // componentWillUnmount(){

  // }

  componentDidUpdate(preProps) {
    this.copyDataToUniforms(preProps, this.data, this.obj.gui);
    this.initFromProps(preProps, this.obj);
    if (preProps.data.screenSize) {
      this.setSize(preProps.data.screenSize[0], preProps.data.screenSize[1]);
    }
  }

  initMain(data, obj) {
    console.log('BasePPS');
  }
  animate(data, obj, deltaTime) {}

  initThree() {
    let renderer, composer;
    let container;
    var obj = this.obj;
    const data = this.data;
    var initMain = this.initMain;
    var selfAnimate = this.animate;
    var copyDataToUniforms = this.copyDataToUniforms;
    init(this.props);
    // initBaseGUI();
    animate();

    this.setSize(data.screenSize.x, data.screenSize.y);

    function init(props) {
      container = document.getElementById(data.domID);
      obj.container = container;
      //初始化Renderer
      //*********************************************************************** */
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      composer = new EffectComposer(renderer);

      obj.renderer = renderer;
      obj.composer = composer;
      //*********************************************************************** */

      obj.gui = new GUIManager(container, data);
      const gui = obj.gui;
      // // postprocessing

      initMain(data, obj);

      initBlur();
      initTime();
      // initTest();
      gui.display();
      copyDataToUniforms(props, data, obj.gui);

      function initBlur() {
        if (!data.isBlur) return;
        const effectHBlur = new ShaderPass(HorizontalBlurShader);
        const effectVBlur = new ShaderPass(VerticalBlurShader);
        composer.addPass(effectHBlur);
        composer.addPass(effectVBlur);
        data.EffectDic['BlurH'] = effectHBlur;
        data.EffectDic['BlurV'] = effectVBlur;
        initGUI();

        function initGUI() {
          initBlur();

          function initBlur() {
            var folder = gui.addFolder({ folderName: '模糊', order: -1 });
            var uniGlobal = { value: 1 };
            var uniH = { value: 1 };
            var uniV = { value: 1 };
            //模糊强度
            var blurPowerData = {
              uniform: uniGlobal,
              infos: [{ displayName: '模糊强度(全局)', isSlider: true, max: 20 }],
              func: [onBlurPowerChange],
            };
            var blurPowerDataH = {
              uniform: uniH,
              infos: [{ displayName: '模糊强度（水平）', isSlider: true, max: 20 }],
              func: [onBlurPowerChange],
            };
            var blurPowerDataV = {
              uniform: uniV,
              infos: [{ displayName: '模糊强度（竖直）', isSlider: true, max: 20 }],
              func: [onBlurPowerChange],
            };
            gui.addValue(blurPowerData, folder);
            gui.addValue(blurPowerDataH, folder);
            gui.addValue(blurPowerDataV, folder);

            function onBlurPowerChange() {
              var h = 2 / (data.screenSize.x / (uniGlobal.value * uniH.value));
              var v = 2 / (data.screenSize.y / (uniGlobal.value * uniV.value));
              data.EffectDic['BlurH'].uniforms['h'].value = h;
              data.EffectDic['BlurV'].uniforms['v'].value = v;
            }
          }
        }
      }
      function initTime() {
        var settingFolder = gui.settingFolder;
        var timeData = {
          uniform: { value: data.time },
          infos: [
            { isPass: true },
            { displayName: '时间速度', order: -1, isSlider: true, max: 10 },
          ],
        };
        gui.addValue(timeData, settingFolder);
        for (var key in data.EffectDic) {
          var uniTime = data.EffectDic[key].uniforms.time;
          if (uniTime) {
            uniTime.value = data.time;
          }
        }
      }
      function initTest() {
        //默认无排序
        var order = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //顺序
        // var order = [1,2,3,4,5,6,7,8,9,10];
        //倒序
        // var order = [10,9,8,7,6,5,4,3,2,1]
        // //Vector2
        // 显示名字  位置  根 是否展开  key(key默认和显示名字一致,如果同一根下重复显示名字需要单独输入)
        var folder = gui.addFolder({
          folderName: '测试',
          order: 99999999,
          parent: null,
          isOpen: true,
        });
        //布尔类型
        var booleanData = {
          uniform: { value: true },
          infos: [{ displayName: '布尔', order: order[0] }],
          func: [],
        };
        gui.addValue(booleanData, folder);
        //数值类型
        var valueData = {
          uniform: { value: 1 },
          infos: [{ displayName: '数值', order: order[1] }],
          func: [],
        };
        gui.addValue(valueData, folder);
        //数值布尔
        var valueData = {
          uniform: { value: 1 },
          infos: [{ displayName: '数值(布尔)', order: order[2], isBoolean: true }],
          func: [],
        };
        gui.addValue(valueData, folder);
        //数值滑动条 默认 min：0 max:1 delta:0.01
        var valueSliderData = {
          uniform: { value: 1 },
          infos: [
            {
              displayName: '数值(滑动条)',
              order: order[3],
              isSlider: true,
              min: -1,
              max: 1,
              delta: 0.1,
            },
          ],
          func: [],
        };
        gui.addValue(valueSliderData, folder);
        //Vector2
        var valueVector2Data = {
          uniform: { value: new Vector2(0.2, 0.4) },
          infos: [
            { displayName: '数值X', order: order[4], isSlider: true, min: -1, max: 1, delta: 0.1 },
            { displayName: '数值Y', order: order[5], isSlider: true, min: -1, max: 1, delta: 0.1 },
          ],
          func: [],
        };
        gui.addValue(valueVector2Data, folder);
        //Vector3
        var valueVector3Data = {
          uniform: { value: new Vector3(0.2, 0.4, 0.6) },
          infos: [
            {
              name: 'Vector3数值X',
              displayName: '数值X',
              order: order[4],
              isSlider: true,
              min: -1,
              max: 1,
              delta: 0.1,
            },
            { isPass: true },
            { displayName: '数值Z', order: order[5], isSlider: true, min: -1, max: 1, delta: 0.1 },
          ],
          func: [],
        };
        gui.addValue(valueVector3Data, folder);
        //Vector4
        var vector4Folder = gui.addFolder({
          folderName: '数值',
          order: 11,
          parent: folder,
          isOpen: true,
          key: 'Vector4T1',
        });
        var valueVector4Data = {
          uniform: { value: new Vector4(0.2, 0.4, 0.6, 0.8) },
          infos: [
            { name: '数值X', displayName: '数值', order: 3, isBoolean: true },
            { name: '数值Y', displayName: '数值', order: 2 },
            {
              name: '数值Z',
              displayName: '数值',
              order: 1,
              isSlider: true,
              min: 0,
              max: 1,
              delta: 0.1,
            },
            { isPass: true },
          ],
          func: [],
        };
        gui.addValue(valueVector4Data, vector4Folder);

        //Color Vec3 Color
        var colorV3Data = {
          uniform: { value: new Vector3(0.2, 0.4, 0.6, 0.8) },
          isColor: true,
          infos: [{ displayName: '颜色' }],
          func: [],
        };
        gui.addValue(colorV3Data, folder);

        //Color Vec3 Color
        var colorV4Data = {
          uniform: { value: new Vector4(0.2, 0.4, 0.6, 0.8) },
          isColor: true,
          infos: [{ displayName: '颜色2' }, { isPass: true }],
          func: [],
        };
        gui.addValue(colorV4Data, folder);
        var colorV41Data = {
          uniform: { value: new Vector4(0.2, 0.4, 0.6, 0.8) },
          isColor: true,
          infos: [
            { displayName: '颜色3' },
            { displayName: '颜色31', order: order[2], isBoolean: true },
          ],
          func: [],
        };
        gui.addValue(colorV41Data, folder);
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      const deltaTime = 0.01;
      data.time.x += deltaTime * data.time.y;
      obj.gui.Animation();
      selfAnimate(data, obj, deltaTime * data.time.y);
      composer.render();
    }
  }

  render() {
    return <div id={this.data.domID}></div>;
  }
}

export default BasePPS;

import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';
class BasePPS {
  constructor(props) {
    // console.log(props);
    this.data = {
      isInit: false,
      EffectDic: {},
      isBlur: props.isBlur || false,
      time: props.data.time,
      screenSize: props.data.screenSize,
      texPathDic: {},
      updateStack: {},
      frameStep: 3,
    };
    this.obj = {
      container: props.container,
      renderer: null,
      composer: null,
      gui: null,
      guiItem: {},
    };
  }
  init(gui, renderer, props) {
    let data = this.data;
    if (data.isInit) {
      return;
    }
    let composer;
    let obj = this.obj;
    let container = obj.container;
    obj.gui = gui;
    this.init3DSelf(data, obj);
    composer = new EffectComposer(renderer);
    obj.renderer = renderer;
    obj.composer = composer;

    this.initSelf(data, obj, props);
    initBlur();
    for (var key in data.EffectDic) {
      var pu = data.EffectDic[key].uniforms;
      // if (pu['screenSize']) {
      //   pu['screenSize'].value = data.screenSize;
      // }
    }

    function initBlur() {
      if (!data.isBlur) return;
      const effectHBlur = new ShaderPass(HorizontalBlurShader);
      const effectVBlur = new ShaderPass(VerticalBlurShader);
      composer.addPass(effectHBlur);
      composer.addPass(effectVBlur);
      data.EffectDic['BlurH'] = effectHBlur;
      data.EffectDic['BlurV'] = effectVBlur;
    }
    data.isInit = true;
  }

  init3DSelf(data, obj) { }
  initSelf(data, obj, props) { }

  initGUI() {
    let data = this.data;
    let obj = this.obj;
    let gui = obj.gui;
    var settingFolder = gui.addFolder({
      key: '设置',
      order: 9999,
      parent: null,
      isOpen: true,
    });

    initBlur();
    initTime();
    this.initGUISelf(data, obj);
    function initBlur() {
      if (!data.isBlur) return;

      var folder = gui.addFolder({ key: '模糊', order: -1 });
      var uniGlobal = { value: 1 };
      var uniH = { value: 1 };
      var uniV = { value: 1 };
      //模糊强度
      var blurPowerData = {
        uniform: uniGlobal,
        key: '模糊强度(全局)',
        info: { displayName: '模糊强度(全局)', isSlider: true, max: 20 },
        onChange: onBlurPowerChange,
      };
      var blurPowerDataH = {
        uniform: uniH,
        key: '模糊强度(水平)',
        info: { displayName: '模糊强度（水平）', isSlider: true, max: 20 },
        onChange: onBlurPowerChange,
      };
      var blurPowerDataV = {
        uniform: uniV,
        key: '模糊强度(竖直)',
        info: { displayName: '模糊强度（竖直）', isSlider: true, max: 20 },
        onChange: onBlurPowerChange,
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
    function initTime() {
      var timeData = {
        uniform: { value: data.time },
        key: 'time',
        infos: [{ isPass: true }, { displayName: '时间速度', order: -1, isSlider: true, max: 10 }],
      };
      gui.addValue(timeData, settingFolder);
    }
  }
  initGUISelf(data, obj) { }

  onChangeInit() {
    this.onChangeInitSelf(this.data, this.obj);
  }
  onChangeInitSelf(data, obj) { }



  setScreenSize() { }
  setScreenSizeSelf(data, obj) { }
  animate(deltaTime, frameIndex) {
    let data = this.data;
    let obj = this.obj;

    if (!data.isInit) {
      return;
    }

    const updateStackLength = Object.keys(data.updateStack).length;



    this.animateSelf(data, obj, deltaTime, false




    );

    //更新渐变字典
    if (updateStackLength > 0) {
      updateStackDic();
    }
    // obj.composer.render();
    if (frameIndex % data.frameStep === 0) {
      obj.composer.render();
    }
    function updateStackDic() {
      const deleteKey = [];
      for (var key in data.updateStack) {
        if (data.updateStack[key].animate()) {
          deleteKey.push(key);
        }
      }
      for (var key in deleteKey) {
        delete data.updateStack[deleteKey[key]];
      }

      return;
      if (deleteKey.length > 0) {
      }
    }
  }
  animateSelf(data, obj, deltaTime, isLog) { }

  setEffects(effects, lerpData) {

    if (!effects) {
      return;
    }
    const data = this.data;
    const gui = this.obj.gui;
    var EffectDic = data.EffectDic;

    if (lerpData && lerpData.lerpTime !== 0) {
      for (const [key, value] of Object.entries(effects)) {
        if (!EffectDic[key]) continue;
        for (const [uname, uvalue] of Object.entries(value)) {
          //检查是否存在修改的字段
          const uni = EffectDic[key]['uniforms'][uname];
          if (!uni) {
            continue;
          }
          if (uvalue.length === 0) continue;
          var lerpNode = new lerpDataUniformNode(uni, uvalue, lerpData);
          if (lerpNode.isCorrectInit) {
            data.updateStack[uname] = lerpNode;
          }
        }
      }
    } else {
      for (const [key, value] of Object.entries(effects)) {
        if (!EffectDic[key]) continue;
        for (const [uname, uvalue] of Object.entries(value)) {
          //检查是否存在修改的字段
          const uni = EffectDic[key]['uniforms'][uname];
          if (!uni) {
            console.log(key, uname, '不存在..');
            continue;
          }
          if (uvalue.length === 0) continue;

          new lerpDataUniformNode(uni, uvalue);
        }
      }
    }

    function setVector2(vec, v) {
      let x = v[0] || vec.x;
      let y = v[1] || vec.y;
      vec.set(x, y);
    }
    function setVector3(vec, v) {
      let x = v[0] || vec.x;
      let y = v[1] || vec.y;
      let z = v[2] || vec.z;
      vec.set(x, y, z);
    }
    function setVector4(vec, v) {
      console.log(vec, v);
      let x = v[0] || vec.x;
      let y = v[1] || vec.y;
      let z = v[2] || vec.z;
      let w = v[3] || vec.w;
      vec.set(x, y, z, w);
    }
  }
  getEffects() {
    const data = this.data;
    const effectDic = data.EffectDic;
    const outputEffects = {};
    for (const [key, value] of Object.entries(effectDic)) {
      outputEffects[key] = {};
      for (const [uname, uniform] of Object.entries(value.uniforms)) {
        let tv = typeof uniform.value;
        if (uniform.value == null || uniform.value.isTexture) {
          continue;
        }
        if (tv === 'number') {
          outputEffects[key][uname] = [uniform.value];
          continue;
        }
        if (uniform.value.isVector2) {
          outputEffects[key][uname] = [uniform.value.x, uniform.value.y];
          continue;
        }
        if (uniform.value.isVector3) {
          outputEffects[key][uname] = [uniform.value.x, uniform.value.y, uniform.value.z];
          continue;
        }
        if (uniform.value.isVector4) {
          outputEffects[key][uname] = [
            uniform.value.x,
            uniform.value.y,
            uniform.value.z,
            uniform.value.w,
          ];
          continue;
        }
        if (uniform.value instanceof Array) {
          var arr = [];
          outputEffects[key][uname] = arr;
          for (var uekey in uniform.value) {
            var sonArr = [];
            arr.push(sonArr);
            var sonValue = uniform.value[uekey];
            if (typeof sonValue === 'number') {
              sonArr.push(sonValue);
              continue;
            }

            if (sonValue.x != undefined) {
              sonArr.push(sonValue.x);
            }
            if (sonValue.y != undefined) {
              sonArr.push(sonValue.y);
            }
            if (sonValue.z != undefined) {
              sonArr.push(sonValue.z);
            }
            if (sonValue.w != undefined) {
              sonArr.push(sonValue.w);
            }
          }
        }
      }
    }
    return outputEffects;
  }
  get composer() {
    return this.obj.composer;
  }
  // //继承
  // selfInit() {

  // }
}
function lerpDataUniformNode(target, uvalue, lerpData) {
  const uniform = target;
  this.uniform = target;
  let startValue = null;
  let endValue = null;
  const startTime = Date.now();
  this.animate = null;
  this.isCorrectInit = false;
  let isArray = false;
  let lerpTime = 0;
  if (!lerpData) {
    var value0 = uvalue[0];

    if (!(value0 instanceof Array)) {
      const sonValue = target.value;
      if (uvalue.length === 1) {
        target.value = uvalue[0];
        return;
      }
      if (uvalue.length === 2) {
        setVector2(sonValue, uvalue);
        return;
      }
      if (uvalue.length === 3) {
        setVector3(sonValue, uvalue);
        return;
      }
      if (uvalue.length === 4) {
        setVector4(sonValue, uvalue);
        return;
      }
    } else {
      var uniformArr = target.value;
      let minLen = Math.min(uniformArr.length, uvalue.length);
      for (let index = 0; index < minLen; index++) {
        const sonValue = target.value[index];
        if (sonValue.length === 1) {
          target.value[index] = uvalue[index][0];
          return;
        }
        if (sonValue.length === 2) {
          setVector2(sonValue, uvalue[index]);
          return;
        }
        if (sonValue.length === 3) {
          setVector3(sonValue, uvalue[index]);
          return;
        }
        if (sonValue.length === 4) {
          setVector4(sonValue, uvalue[index]);
          return;
        }
      }
    }
  } else {
    var value0 = uvalue[0];
    lerpTime = lerpData.lerpTime;

    //如果不是
    if (!(value0 instanceof Array)) {
      const sonValue = target.value;
      if (uvalue.length === 1) {
        if (uniform.value == uvalue[0] || uvalue[0] == undefined) return;

        startValue = [uniform.value];
        endValue = [uvalue[0]];
        this.isCorrectInit = true;
        this.animate = () => {
          const dt = (Date.now() - startTime) / 1000.0;
          var alpha = Math.min(dt / lerpTime, 1);
          var lerpData = lerpArr(startValue, endValue, alpha);
          uniform.value = lerpData[0];
          return alpha === 1;
        };
        return;
      }
      if (uvalue.length === 2) {
        var isEqual =
          (uniform.value.x === uvalue[0] || uvalue[0] == undefined) &&
          (uniform.value.y === uvalue[1] || uvalue[1] == undefined);

        if (isEqual) return;

        startValue = [uniform.value.x, uniform.value.y];
        endValue = [uvalue[0], uvalue[1]];
        this.isCorrectInit = true;
        this.animate = () => {
          const dt = (Date.now() - startTime) / 1000.0;

          var alpha = Math.min(dt / lerpTime, 1);
          var lerpData = lerpArr(startValue, endValue, alpha);
          setVector2(uniform.value, lerpData);
          return alpha === 1;
        };
        return;
      }
      if (uvalue.length === 3) {
        var isEqual =
          (uniform.value.x === uvalue[0] || uvalue[0] == undefined) &&
          (uniform.value.y === uvalue[1] || uvalue[1] == undefined) &&
          (uniform.value.z === uvalue[2] || uvalue[2] == undefined);

        if (isEqual) return;

        startValue = [uniform.value.x, uniform.value.y, uniform.value.z];
        endValue = [uvalue[0], uvalue[1], uvalue[2]];
        console.log(this.isCorrectInit);
        this.isCorrectInit = true;
        this.animate = () => {
          const dt = (Date.now() - startTime) / 1000.0;
          var alpha = Math.min(dt / lerpTime, 1);
          var lerpData = lerpArr(startValue, endValue, alpha);
          setVector3(uniform.value, lerpData);
          return alpha === 1;
        };
        return;
      }
      if (uvalue.length === 4) {
        var isEqual =
          (uniform.value.x === uvalue[0] || uvalue[0] == undefined) &&
          (uniform.value.y === uvalue[1] || uvalue[1] == undefined) &&
          (uniform.value.z === uvalue[2] || uvalue[2] == undefined) &&
          (uniform.value.w === uvalue[3] || uvalue[3] == undefined);

        if (isEqual) return;

        startValue = [uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w];
        endValue = [uvalue[0], uvalue[1], uvalue[2], uvalue[3]];
        console.log(this.isCorrectInit);
        this.isCorrectInit = true;
        this.animate = () => {
          const dt = (Date.now() - startTime) / 1000.0;
          var alpha = Math.min(dt / lerpTime, 1);
          var lerpData = lerpArr(startValue, endValue, alpha);
          setVector4(uniform.value, lerpData);
          return alpha === 1;
        };
        return;
      }
    } else {
      isArray = true;
    }
  }

  function lerpArr(aArr, bArr, alpha) {
    var outputArr = [];
    for (let index = 0; index < aArr.length; index++) {
      if (aArr[index] == undefined || bArr[index] == undefined) {
        outputArr.push(undefined);
      } else {
        outputArr.push(aArr[index] * (1 - alpha) + bArr[index] * alpha);
      }
    }
    return outputArr;
  }
  function setVector2(vec, v) {
    let x = v[0] || vec.x;
    let y = v[1] || vec.y;
    vec.set(x, y);
  }
  function setVector3(vec, v) {
    let x = v[0] || vec.x;
    let y = v[1] || vec.y;
    let z = v[2] || vec.z;
    vec.set(x, y, z);
  }
  function setVector4(vec, v) {
    let x = v[0] || vec.x;
    let y = v[1] || vec.y;
    let z = v[2] || vec.z;
    let w = v[3] || vec.w;
    vec.set(x, y, z, w);
  }
}

export default BasePPS;

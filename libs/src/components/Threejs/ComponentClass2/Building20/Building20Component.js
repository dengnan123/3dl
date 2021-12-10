import React from 'react';
import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { gui } from 'three/examples/jsm/libs/dat.gui.module';
import { GUIManager } from '../Tool/GUI/GUIManager';
import { Building20Floors } from './Building20Floors';

class PPSComponent extends React.Component {
  constructor(props) {

    super(props);
    this.localData = {
      time: new Vector2(0.1, 1.0),
      domID: props.data.domID || 'Building20Floors',
      screenSize: new Vector2(1080 / 2, 1920 / 2),
      pps: new Building20Floors(),
      isForceCloseGUI: props.data.closeGUIManager || false,

    };
    this.obj = {
      container: null,
      gui: null,
      renderer: null,
    };
    this.isDestoryAnimation = { value: false };
  }
  componentDidMount() {
    const obj = this.obj;
    const localData = this.localData;
    const isDestoryAnimation = this.isDestoryAnimation;
    this.initBaseObj(obj, localData);
    this.onScreenSize();
    localData.pps.init(obj.gui, obj.renderer, this.props);

    this.initGUI(localData, obj);

    // 挂载animate到帧计时器
    animate();

    function animate() {
      if (isDestoryAnimation.value) return;
      requestAnimationFrame(animate);
      const deltaTime = 0.01;
      let dt = deltaTime * localData.time.y;
      localData.time.x += dt;
      obj.gui.animate();
      let pps = localData.pps;
      if (pps) pps.animate(dt);
    }

    console.log(localData.pps.obj);
    // const manager = localData.pps.obj.floor.manager;


    // const floorFunc = {
    //   moveDown: manager.moveDown,
    //   moveUp: manager.moveUp,
    //   rotate: manager.Rotate,
    // }
    console.log(localData.pps.data.Event);
    this.props.callBack && this.props.callBack(localData.pps.data.Event);

  }

  componentDidUpdate(prevProps, prevStates) {
    this.onScreenSize();

    const props = this.props;
    const obj = this.obj;
    updateGUIState();
    function updateGUIState() {
      console.log(props.data);
      !props.data.isHideGUI ? obj.gui.show() : obj.gui.hide();
      !props.data.isHideStats ? obj.gui.showStats() : obj.gui.hideStats();
    }
  }

  componentWillUnmount() {
    // 关闭animation
    this.isDestoryAnimation.value = true;
  }

  onScreenSize() {
    const obj = this.obj;
    const localData = this.localData;
    const props = this.props;
    // 数据格式不正确
    if (!props.data.screenSize && props.data.screenSize.length !== 2) {
      return;
    }
    // 两次渲染数据相同
    if (
      props.data.screenSize[0] === localData.screenSize.x &&
      props.data.screenSize[1] === localData.screenSize.y
    ) {
      return;
    }
    // 调整本地数据尺寸、画布尺寸、GUI尺寸
    localData.screenSize.set(props.data.screenSize[0], props.data.screenSize[1]);
    obj.renderer.setSize(props.data.screenSize[0], props.data.screenSize[1]);
    const ppsDic = localData.PPSDic;
    for (var key in ppsDic) {
      ppsDic[key].setScreenSize();
    }
  }

  initGUI(data, obj) {
    let gui = obj.gui;
    if (data.isForceCloseGUI) {
      return;
    }
    let pps = data.pps;
    gui.clear();
    pps.initGUI(data, obj);
    // printData();
    gui.display();

    // function printData() {
    //   var settingFolder = gui.settingFolder;
    //   var printFunction = function () {
    //     let printData = {};
    //     try {
    //       for (const [key, value] of Object.entries(data.PPSDic)) {
    //         printData[key] = value.getEffects();
    //       }
    //       var jsonString = JSON.stringify(printData, null, 2);
    //       const el = document.createElement('textarea');
    //       el.value = jsonString;
    //       el.setAttribute('readonly', '');
    //       el.style.position = 'absolute';
    //       el.style.left = '-9999px';
    //       document.body.appendChild(el);
    //       el.select();
    //       document.execCommand('copy');
    //       document.body.removeChild(el);

    //       message.success('配置成功复制到剪切板');
    //     } catch (error) {
    //       message.error(error.message);
    //     }

    //     if (data.printFunction) {
    //       data.printFunction(jsonString);
    //     }
    //   };
    //   var printData = {
    //     uniform: { value: printFunction },
    //     key: '打印',
    //     info: { displayName: '打印' },
    //   };
    //   obj.gui.addValue(printData, settingFolder);
    // }
  }

  initBaseObj(obj, localData) {
    obj.container = document.getElementById(localData.domID);
    obj.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    obj.renderer.setPixelRatio(window.devicePixelRatio)
    obj.renderer.setClearColor(0xEEEEEE, 0.0);;
    obj.container.appendChild(obj.renderer.domElement);
    obj.renderer.setSize(localData.screenSize.x, localData.screenSize.y);
    obj.gui = new GUIManager(obj.container, {
      domID: localData.domID,
      isForceClose: localData.isForceCloseGUI || true,
    });
  }

  // 切换

  render() {
    return <div id={this.localData.domID} />;
  }
}
export default PPSComponent;

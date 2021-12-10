// import * as THREE from 'three';
import * as THREE from 'three';

import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createFloorMesh } from './FloorMeshCreator';
import { Building20Shader } from './Shader/Building20Shader';
import { ShaderMaterial } from 'three';
import font from './font/helvetiker_regular.typeface.json';

// import {LWOLoader} from "three/examples/fonts/optimer_bold.typeface.json";
class Building20Floors extends BasePPS {
  constructor(props) {
    props = props || {};
    props['data'] = props['data'] || {};
    props.data['time'] = props.data.time || new Vector2(0, 1);
    props.data['screenSize'] = props.data.screenSize || new Vector2(1080 / 2, 1920 / 2);
    props['isBlur'] = false;
    super(props);
  }
  initSelf(data, obj, props) {
    // console.log("Self");
    var gui = obj.gui;
    var mainPass;
    var composer = obj.composer;
    const constData = {
      xL: 1,
      yL: 0.25,
      zL: 1.35,
      floorCount: 20,
      maxFloorCount: 54,
      fontVerticalOffset: 0.07,
      fontHorizontalOffset: 0.2,
      rotationData: {
        totalTime: 2,
        rotationTime: 1,
        startDisplayTime: 0.9,
      },
    };
    data['constData'] = constData;
    const {
      xL,
      yL,
      zL,
      floorCount,
      maxFloorCount,
      fontVerticalOffset,
      fontHorizontalOffset,
      rotationData,
    } = constData;

    obj['raycaster'] = new THREE.Raycaster();
    obj['mouse'] = new Vector2(1, 1);

    //随机数据
    const lData = [];
    const rData = [];
    data['leftData'] = lData;
    data['rightData'] = rData;

    for (let index = 0; index < maxFloorCount; index++) {
      lData.push(Math.random());
      rData.push(Math.random());
    }

    // initMainPass();

    init();

    initUpdateStack();

    initEvent();

    // initGUITest();

    function init() {
      let effect, renderer, materials, scene, ambientLight, light, resolution;
      // CAMERA

      let camera = new THREE.PerspectiveCamera(15, data.screenSize.x / data.screenSize.y, 1, 10000);
      camera.position.set(15 * 1.1, 4.8 * 1.1, 13 * 1.1);
      const DegToRad = Math.PI / 180;
      camera.rotation.set(-20 * DegToRad, 48 * DegToRad, 15 * DegToRad);

      // const cameraPosScale = 12.0;
      // camera.position.set(xL*cameraPosScale,5,zL*cameraPosScale);
      obj['camera'] = camera;
      // SCENE

      scene = new THREE.Scene();
      obj['scene'] = scene;
      // LIGHTS

      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0.5, 0.5, 1);
      scene.add(light);
      obj['light'] = light;

      ambientLight = new THREE.AmbientLight(0x080808);
      scene.add(ambientLight);
      obj['ambientLight'] = ambientLight;

      // scene.add(effect);

      // RENDERER

      renderer = obj.renderer;

      // CONTROLS

      // const controls = new OrbitControls(camera, renderer.domElement);
      // controls.minDistance = 20;
      // controls.maxDistance = 50;
      // obj['controller'] = controls;

      const uniform = { value: new Vector4() };

      //Helper
      // const helper = new THREE.GridHelper( 160, 10 );
      //     scene.add( helper );

      //模型根
      const buildRoot = new THREE.Object3D();
      buildRoot.name = 'BuildRoot';
      scene.add(buildRoot);
      // console.log(buildRoot);
      //楼模型
      const buildingMesh = createMesh();
      buildRoot.add(buildingMesh);
      obj['buildingMesh'] = buildingMesh;
      obj['buildRoot'] = buildRoot;
      data['isForward'] = true;
      // buildingMesh.visible = false;
      //初始化字体
      initFont();

      buildRoot.position.set(0, (-yL * floorCount) / 2, 0);
      // console.log(buildingMesh)
      // console.log(buildRoot)
      function createMesh() {
        const graphPercent = 0.8;
        const geo = createFloorMesh(xL, yL, zL, floorCount, graphPercent);
        const mat = new ShaderMaterial(Building20Shader());
        data.EffectDic['Building'] = mat.uniforms;
        // console.log(data);
        mat.uniforms.borderWDH.value = zL / yL;
        const mesh = new THREE.Mesh(geo, mat);
        console.log('创建Mesh完成');

        return mesh;
      }

      function initFont() {
        // const fontData = {};
        // const floorLabelObjs = {};

        // const fontPath = '3dFonts/helvetiker_regular.typeface.json';
        const newFont = new THREE.Font(font);
        initFloor(newFont);
        // const loader = new THREE.FontLoader();
        // loader.load(fontPath, function(font) {
        //   console.log('-------', font);
        //   // initFloor(font);
        // });

        function initFloor(font) {
          const floorObj = {};
          console.log('floor');
          obj['floor'] = floorObj;
          //创建Mesh
          const floor = createFloorMesh(font);
          initFloorManagerSlider(floor);
          floorObj.manager.swith(5);
          function createFloorMesh(font) {
            const floorOption = {
              font,
              size: 0.1,
              height: 0.01,
              curveSegments: 1,
            };
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

            //层字体
            floorObj['font'] = font;
            //层style
            floorObj['option'] = floorOption;
            //层子对象数组
            const floors = [];

            const floors2 = [];
            //根目录
            const mainRoot = new THREE.Object3D();
            mainRoot.name = '层文本根目录';
            buildRoot.add(mainRoot);

            mainRoot.position.y = fontVerticalOffset;

            const floorRoot = new THREE.Object3D();
            floorRoot.name = '层文本根(前)';
            mainRoot.add(floorRoot);
            floorRoot.parent = mainRoot;
            floorRoot.position.z = (zL * 1.05) / 2;

            const floorRoot2 = new THREE.Object3D();
            floorRoot2.name = '层文本根(后)';
            mainRoot.add(floorRoot2);
            floorRoot2.position.z = (-zL * 1.05) / 2;
            floorRoot2.rotation.y = Math.PI;

            floorObj['mainRoot'] = mainRoot;
            floorObj['forwardRoot'] = floorRoot;
            floorObj['backwardRoot'] = floorRoot2;

            floorRoot.position.x = fontHorizontalOffset;
            floorRoot2.position.x = -fontHorizontalOffset;

            for (let index = 0; index < maxFloorCount; index++) {
              const m = addLabel(`${index + 1}F`, floorOption, textMaterial);

              floorRoot.add(m);
              floors.push(m);
              m.visible = false;

              const m2 = addLabel(`${index + 1}F`, floorOption, textMaterial);
              m2.parent = floorRoot2;
              floorRoot2.add(m2);
              floors2.push(m2);
              m2.visible = false;
            }

            //  console.log(scene);
            //  console.log(floors);
            //  console.log(floors2);
            return {
              mainRoot,
              forwardRoot: floorRoot,
              backwardRoot: floorRoot2,
              sons: floors,
              sons2: floors2,
            };
          }
          function initFloorManagerSlider(floor) {
            //  console.log(floor);
            const buildU = data.EffectDic.Building;
            console.log(buildU);
            const floorMGR = {
              sons: [],
              startIndex: 0,
              length: floorCount,
              maxIndex: maxFloorCount,
              leftObjects: floor.sons,
              rightObjects: floor.sons2,
              leftData: data['leftData'],
              rightData: data['rightData'],
              leftU: buildU.infoLeft20,
              rightU: buildU.infoRight20,
              swith: switchStart,
              moveUp,
              moveDown,
            };
            data['Event'] = data['Event'] || {};

            floorObj['manager'] = floorMGR;
            data.Event['manager'] = floorMGR;

            for (let index = 0; index < floorCount; index++) {
              const floorInfo = {
                height: yL * index,
              };
              floorMGR.sons.push(floorInfo);
            }

            function switchStart(newStartIndex) {
              if (newStartIndex < 0) newStartIndex = 0;
              if (newStartIndex + this.length > this.maxIndex)
                newStartIndex = this.maxIndex - this.length;
              //隐藏
              for (let index = 0; index < this.length; index++) {
                this.leftObjects[index + this.startIndex].visible = false;
                this.rightObjects[index + this.startIndex].visible = false;
              }
              this.startIndex = newStartIndex;
              //显示
              for (let index = 0; index < this.length; index++) {
                this.leftObjects[index + this.startIndex].visible = true;
                this.rightObjects[index + this.startIndex].visible = true;
              }
              //移动
              for (let index = 0; index < this.length; index++) {
                this.leftObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.rightObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.leftU.value[index] = this.leftData[index + this.startIndex];
                this.rightU.value[index] = this.rightData[index + this.startIndex];
              }
            }
            function moveUp() {
              if (this.startIndex + 1 + this.length === this.maxIndex) return;
              this.leftObjects[this.startIndex].visible = false;
              this.leftObjects[this.startIndex + this.length].visible = true;
              this.rightObjects[this.startIndex].visible = false;
              this.rightObjects[this.startIndex + this.length].visible = true;
              this.startIndex++;
              //移动
              for (let index = 0; index < this.length; index++) {
                this.leftObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.rightObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.leftU.value[index] = this.leftData[index + this.startIndex];
                this.rightU.value[index] = this.rightData[index + this.startIndex];
              }
            }
            function moveDown() {
              if (this.startIndex === 0) return;
              this.leftObjects[this.startIndex + this.length - 1].visible = false;
              this.leftObjects[this.startIndex - 1].visible = true;
              this.rightObjects[this.startIndex + this.length - 1].visible = false;
              this.rightObjects[this.startIndex - 1].visible = true;
              this.startIndex--;
              //移动
              for (let index = 0; index < this.length; index++) {
                this.leftObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.rightObjects[index + this.startIndex].position.y = this.sons[index].height;
                this.leftU.value[index] = this.leftData[index + this.startIndex];
                this.rightU.value[index] = this.rightData[index + this.startIndex];
              }
            }
          }
          function initFloorManager(floor) {
            const floorMGR = {
              sons: [],
              swith: function (index) {
                this.sons.forEach(element => {
                  element.swith(index);
                });
              },
            };
            floorObj['manager'] = floorMGR;
            //加入层管理者
            for (let index = 0; index < floorCount; index++) {
              const floorMGRItem = {
                forward: [],
                backward: [],
                current: -1,
                height: yL * index,
                swith: function (index) {
                  if (index === this.current || index < 0) return;
                  if (this.current !== -1) {
                    if (this.forward.length > this.current) {
                      this.forward[this.current].visible = false;
                      this.backward[this.current].visible = false;
                    }
                  }
                  if (this.forward.length > index) {
                    this.forward[index].visible = true;
                    this.backward[index].visible = true;
                  }
                  this.current = index;
                },
              };
              floorMGR.sons.push(floorMGRItem);
            }
            //将层加入层管理者
            for (var key in floor.sons) {
              const floorMGRItem = floorMGR.sons[key % floorCount];
              floorMGRItem.forward.push(floor.sons[key]);
              floorMGRItem.backward.push(floor.sons2[key]);
              floor.sons[key].position.y = floorMGRItem.height;
              floor.sons2[key].position.y = floorMGRItem.height;
            }

            console.log(floorMGR.sons);
          }
        }

        function addLabel(text, option, textMaterial, location) {
          const textGeo = new THREE.TextBufferGeometry(text, option);
          const textMesh = new THREE.Mesh(textGeo, textMaterial);
          if (location) {
            textMesh.position.copy(location);
          }
          return textMesh;
        }
      }
    }

    function initUpdateStack() {
      data['Event'] = data['Event'] || {};
      const event = data['Event'];
      event['rotate'] = function () {
        console.log('开始旋转');
        data['isForward'] = !data['isForward'];
        data.updateStack['Rotation'] = new rotationUpdateItem();
        function rotationUpdateItem() {
          const targetObj = obj['buildRoot'];
          let targetValue = data['isForward'] ? 2 : 1;
          const startValue = targetObj.rotation.y;
          const leftU = data.EffectDic.Building.valuePercentLeft;
          const rightU = data.EffectDic.Building.valuePercentRight;

          const guiItem = [obj.guiItem.build, obj.guiItem.leftP, obj.guiItem.rightP];
          if (targetValue === 1 && startValue > Math.PI / 2) {
            targetValue += 2;
          }
          const updateTime = rotationData.totalTime;
          const rotateTime = rotationData.rotationTime;
          const startDisplayTime = rotationData.startDisplayTime;
          const delta = 1 / 60;
          let duration = 0;
          //初始化偏移位置
          if (!data.isForward) {
            leftU.value = 0;
          } else {
            rightU.value = 0;
          }
          this.animate = function () {
            duration += delta;
            const rotateAlpha = Math.min(duration / rotateTime, 1);
            const displayA = Math.min(
              Math.max(duration - startDisplayTime, 0) / (updateTime - startDisplayTime),
              1,
            );
            const hideA = Math.max(1 - rotateAlpha * 2, 0);

            const value = startValue * (1 - rotateAlpha) + targetValue * Math.PI * rotateAlpha;
            //旋转
            targetObj.rotation.y = value;
            // console.log(data.isForward);
            // console.log(displayA,hideA);
            if (!data.isForward) {
              leftU.value = Math.max(leftU.value, displayA);
              rightU.value = Math.min(rightU.value, hideA);
            } else {
              rightU.value = Math.max(rightU.value, displayA);
              leftU.value = Math.min(leftU.value, hideA);
            }

            if (duration >= updateTime) {
              targetObj.rotation.y = (targetValue % 2) * Math.PI;
              if (!data.isForward) {
                leftU.value = 1;
                rightU.value = 0;
              } else {
                rightU.value = 1;
                leftU.value = 0;
              }
              for (var key in guiItem) {
                if (guiItem[key]) guiItem[key].updateGUI();
              }
              return true;
            }
            //GUI刷新
            for (var key in guiItem) {
              if (guiItem[key]) guiItem[key].updateGUI();
            }
          };
        }
      };
      event['manager'] = event['manager'];
    }

    function initEvent() {
      return;
      document.addEventListener('mousemove', onDocumentMouseMove);
      document.addEventListener('mousedown', onDocumentMouseDown);
      const buildTarget = obj.buildingMesh;
      function onDocumentMouseMove(event) {
        event.preventDefault();
        obj['mouse'].set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        );
      }
      function onDocumentMouseDown(event) {
        event.preventDefault();
        const offsetX = obj.renderer.domElement.offsetLeft;
        const offsetY = obj.renderer.domElement.offsetTop;
        const mouse = obj.mouse;
        const screenSize = data.screenSize;
        mouse.x = ((event.clientX - offsetX) / screenSize.x) * 2 - 1;
        mouse.y = -((event.clientY - offsetY) / screenSize.y) * 2 + 1;
        if (mouse.x < -1 || mouse.x > 1 || mouse.y < -1 || mouse.y > 1) return;

        console.log('点击');
        obj.raycaster.setFromCamera(obj.mouse, obj.camera);
        const intersect = obj.raycaster.intersectObject(buildTarget);
        if (intersect.length != 0) {
          const pos = intersect[0].point;
          // console.log();
          pos.applyMatrix4(buildTarget.matrixWorld.invert());
          let floorIndex = Math.ceil(pos.y / yL) + obj.floor.manager.startIndex;
          console.log(`点击了第${floorIndex}层`);
        }

        return;
      }
    }

    // console.log('初始化Building完毕');
  }
  initGUISelf(data, obj) {
    const gui = obj.gui;
    const constData = data['constData'];
    const {
      xL,
      yL,
      zL,
      floorCount,
      maxFloorCount,
      fontVerticalOffset,
      fontHorizontalOffset,
      rotationData,
    } = constData;
    initGUITest();
    function initGUITest() {
      //*************************** */

      const cameraGUIData = {
        uniform: { value: obj['camera'] },
        key: 'MainCamera',
        info: { displayName: 'MainCamera' },
      };
      gui.addValue(cameraGUIData);
      const BuildRootGUIData = {
        uniform: { value: obj['buildRoot'] },
        key: 'BuildRoot',
        info: { displayName: 'BuildRoot' },
      };
      obj['guiItem']['build'] = gui.addValue(BuildRootGUIData);
      const mainU = obj['buildingMesh'].material.uniforms;

      const floorMoveUpData = {
        uniform: {
          value: () => {
            data.Event.manager.moveUp();
          },
        },
        order: 2.5,
        key: '上移',
      };
      const floorMoveDownData = {
        uniform: {
          value: () => {
            data.Event.manager.moveDown();
          },
        },
        order: 2.5,
        key: '下移',
      };
      const floorRotateData = {
        uniform: {
          value: () => {
            data.Event.rotate();
          },
        },
        order: 2.6,
        key: '旋转',
      };
      const leftInfo20Data = {
        uniform: mainU.infoLeft20,
        key: 'InfoLeft',
        order: 3,
        displayName: '左侧面数据列表',
        info: { isSlider: true },
      };
      const rightInfo20Data = {
        uniform: mainU.infoRight20,
        key: 'InfoRight',
        order: 3,
        displayName: '右侧面数据列表',
        info: { isSlider: true },
      };
      gui.addValue(leftInfo20Data);
      gui.addValue(rightInfo20Data);

      gui.addValue(floorMoveUpData);
      gui.addValue(floorMoveDownData);
      gui.addValue(floorRotateData);
      //   console.log(data);

      //Uniforms参数
      const uniformFolder = gui.addFolder({ key: 'Uniforms参数', order: 2, isOpen: true });

      const sideColorData = { uniform: mainU.sideColor, key: '侧边颜色', type: 'color' };
      const tbColorData = { uniform: mainU.tbColor, key: '顶底颜色', type: 'color' };
      const infoBackColorData = {
        uniform: mainU.infoBackColor,
        key: '数据背景颜色',
        type: 'color',
      };
      const infoSliderBackColorData = {
        uniform: mainU.infoSliderBackColor,
        key: '数据条背景颜色',
        type: 'color',
      };
      const infoSliderColorData = {
        uniform: mainU.infoSliderColor,
        key: '数据条颜色',
        type: 'color',
      };

      gui.addValue(sideColorData, uniformFolder);
      gui.addValue(tbColorData, uniformFolder);
      gui.addValue(infoBackColorData, uniformFolder);
      gui.addValue(infoSliderBackColorData, uniformFolder);
      gui.addValue(infoSliderColorData, uniformFolder);

      const leftScanData = {
        uniform: mainU.valuePercentLeft,
        key: '左滑动(扫描式)',
        order: 1,
        info: { isSlider: true },
      };
      const rightScanData = {
        uniform: mainU.valuePercentRight,
        key: '右滑动(扫描式)',
        order: 3,
        info: { isSlider: true },
      };
      const leftScanData2 = {
        uniform: mainU.valuePercentLeft2,
        key: '左滑动(同时)',
        order: 2,
        info: { isSlider: true },
      };
      const rightScanData2 = {
        uniform: mainU.valuePercentRight2,
        key: '右滑动(同时)',
        order: 4,
        info: { isSlider: true },
      };
      obj['guiItem']['leftP'] = gui.addValue(leftScanData, uniformFolder);
      obj['guiItem']['rightP'] = gui.addValue(rightScanData, uniformFolder);
      gui.addValue(leftScanData2, uniformFolder);
      gui.addValue(rightScanData2, uniformFolder);

      //非Uniforms参数
      const nonUniformsFolder = gui.addFolder({ key: '非Uniforms参数', order: 2, isOpen: true });
      const floorWordHOffsetData = {
        uniform: { value: fontHorizontalOffset },
        key: '字体水平偏置',
        info: { isSlider: true, min: -1.5 * xL, max: 1.5 * xL, delta: 0.0001 },
        onChange: v => {
          const root = obj['floor'];
          root.forwardRoot.position.x = v;
          root.backwardRoot.position.x = -v;
        },
      };
      const floorWordVOffsetData = {
        uniform: { value: fontVerticalOffset },
        key: '字体竖直偏置',
        info: { isSlider: true, min: -yL, max: yL, delta: 0.0001 },
        onChange: v => {
          const root = obj['floor'];
          root.mainRoot.position.y = v;
        },
      };
      const totalTimeData = {
        uniform: { value: rotationData.totalTime },
        key: '旋转总时间',
        onChange: totalTimeValueChange,
      };
      const rotateData = {
        uniform: { value: rotationData.rotationTime },
        key: '旋转时间',
        onChange: rotationTimeValueChange,
      };
      const startDisplayData = {
        uniform: { value: rotationData.startDisplayTime },
        key: '显示开始时间',
        onChange: startDisplayTimeValueChange,
      };
      function totalTimeValueChange(value) {
        const maxT = Math.max(rotationData.rotationTime, rotationData.startDisplayTime);
        if (value > maxT) {
        } else {
          value = maxT;
          this.uniform.value = maxT;
          this.node.updateGUI();
        }
        rotationData.totalTime = value;
      }
      function rotationTimeValueChange(value) {
        if (value > rotationData.totalTime) {
          value = rotationData.totalTime;
          this.uniform.value = value;
          this.node.updateGUI();
        }
        rotationData.rotationTime = value;
      }
      function startDisplayTimeValueChange(value) {
        if (value > rotationData.totalTime) {
          value = rotationData.totalTime;
          this.uniform.value = value;
          this.node.updateGUI();
        }
        rotationData.startDisplayTime = value;
      }
      gui.addValue(floorWordHOffsetData, nonUniformsFolder);
      gui.addValue(floorWordVOffsetData, nonUniformsFolder);
      gui.addValue(
        { uniform: { value: printCamera }, key: '打印摄像机视角', order: 999 },
        nonUniformsFolder,
      );
      gui.addValue(totalTimeData, nonUniformsFolder);
      gui.addValue(rotateData, nonUniformsFolder);
      gui.addValue(startDisplayData, nonUniformsFolder);
      function printCamera() {
        const camera = obj['camera'];
        const cdata = {
          position: camera.position,
          scale: camera.scale,
          rotation: camera.rotation,
          rotationData,
        };
        var jsonString = JSON.stringify(cdata, null, 2);
        console.log(cdata);
      }

      //*************************** */
    }
  }
  animateSelf(data, obj, deltaTime) {
    const scene = obj.scene;
    const camera = obj.camera;
    const renderer = obj.renderer;
    // console.log(scene, camera, renderer);
    // console.log("渲染");
    renderer.render(scene, camera);
  }
}
export { Building20Floors };

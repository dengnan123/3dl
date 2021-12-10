import React from 'react';
import { layerClickEvent } from './Components/City/City';
// import { TrailLineManager } from './Components/Creator/Instance/TrailLine/TrailLineManger';
import { LoaderStore } from './Components/Loader/LoaderStore';
// import { UnityTileLoader } from './Components/Loader/UnityTileLoad';
import { InitComponentSystem } from './Components/System/SystemManager';
// import axios from 'axios';
// import trailLineJson from "./TrailLine.json";
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.infos = {
      domID: props.domID || 'ThreeEngine',
      screenSize: props.screenSize || [1920 / 2, 1080 / 2],
      baseResources: props.baseResources || undefined,
      handleEvent: props.handleEvent,
      distance: props.distance,
      isTransparent: true,
      screenScale: props.screenScale || 1,
    };
    this.systemComponent = null;
  }
  setSize(width, height) { }

  componentDidMount() {
    //初始化System
    var infos = this.infos;
    var ss = infos.screenSize;
    ss[0] /= infos.screenScale;
    ss[1] /= infos.screenScale;
    console.log("INIT DATA", this.props.initData);

    this.systemComponent = InitComponentSystem(infos, this.props.initData);
    const { eventComponent, three3D } = this.systemComponent;
    const { clickEvent, animate } = eventComponent;

    const onClickCallback = infos.handleEvent;
    //触发刷新

    this.systemComponent.eventComponent.screenSize.onSizeChange(infos.screenSize, true, infos.screenScale);



    animate.needsUpdate = true;

    //初始化事件
    initEvent();
    initTileTest();

    // loadTwoPointCurveTest();

    // var boxGeo = new BoxBufferGeometry(10, 10, 10);
    // var mesh = new Mesh(boxGeo, new MeshBasicMaterial());
    // three3D.scene.add(mesh);


    function initEvent() {
      clickEvent.clickLayer = new layerClickEvent.build(eventComponent, three3D, onClickCallback);
      clickEvent.clickLayer.targetObjects = three3D.sceneGroup.city;
      // console.log(clickEvent)
    }


    //初始化测试
    function initTileTest() {
      const { city } = three3D.sceneGroup;
      // const scene = three3D.scene;
      // const { camera } = three3D.obj;
      // let cityBuildURL = 'Resources/Model/Unity/GLTF/newCity/GLTFPaths_City.json';
      // let segmentURL = 'Resources/Model/Unity/GLTF/Segments/GLTFPaths_Segment.json';
      let buildURL = 'Resources/Model/Unity/GLTF/taikang/taikang.gltf';

      if (infos.baseResources) {
        // cityBuildURL = infos.baseResources + cityBuildURL;
        // segmentURL = infos.baseResources + segmentURL;
        buildURL = infos.baseResources + buildURL;
      }
      // loadSegment();
      LoadBuild();
      // loadTrailLine();

      async function LoadBuild() {
        const loader = LoaderStore.getLoader(false);
        loader.animate = animate;
        var result = await loader.load(buildURL);
        const { url, dic } = result;
        var builds = dic['builds'];
        for (var key in builds) {
          const b = builds[key];
          b.url = url;

          city.add(b.group);
          b.group.position.set(-10, 0, 0);
          b.group.updateMatrix();
        }
      }
      // function loadSegment() {


      //   const urls = [segmentURL, cityBuildURL];
      //   const tileCity = new UnityTileLoader(urls, camera, true, city, animate, undefined, infos.distance);
      //   tileCity.group.position.setY(4);
      //   clickEvent.clickLayer.cityBlock = tileCity;
      // }

    }
    // function loadTrailLine() {
    //   let trailLineUrl = 'Resources/Model/Unity/GLTF/TrailLine/TrailLine.json';
    //   if (infos.baseResources) {
    //     trailLineUrl = infos.baseResources + trailLineUrl;
    //   }
    //   axios.get(trailLineUrl).then(function (res) {
    //     const option = {
    //       uniforms: {
    //         _time: animate.time,
    //       },
    //       radiu: 1.5,
    //       trailLineLength: [1000 / 2, 1500 / 2],
    //       segmentNumber: 100,
    //       lineCount: 30,
    //       baseSpeed: [800, 1000],
    //       colors: [0xDC5B20, 0xDCA320, 0xDC2020],
    //       offsetYRange: [1, 4],
    //       offsetXRange: [0, 40],
    //     }
    //     option.uniforms = Object.assign(option.uniforms, three3D.sceneManager.fogUniforms);
    //     new TrailLineManager(res.data, option, three3D.scene, animate);
    //   });

    // }
    // function loadTwoPointCurveTest() {
    //   // const posZero = new Vector3(0, 0, 0);
    //   // const pos1 = new Vector3(100, 100, 100);

    //   // const pathData1 = { start: posZero, end: pos1 };
    //   // const option = {
    //   //   radius: 1.5,
    //   //   segmentNumber: 100,
    //   //   path: [pathData1],
    //   //   uniforms: {

    //   //   }
    //   // }
    //   // option.uniforms = Object.assign(option.uniforms, three3D.sceneManager.fogUniforms);
    //   // var tpc = new TwoPointCurve(option);
    //   // three3D.scene.add(tpc.group);


    //   // animate.addListener('test', (dt, t) => {
    //   //   // pos1.set(Math.sin(t * Math.PI) * 100, Math.abs((t * 20) % 200 - 100), Math.cos(t * Math.PI) * 100);
    //   //   pathData1.update();
    //   // });


    //   // console.log(pathData1);
    //   const offsets = [];
    //   const pos = [];
    //   for (let index = 0; index < 100; index++) {
    //     offsets[index] = Math.random() * 100;
    //     pos[index] = new Vector3(index % 10 * 10, 0, Math.floor(index / 10) * 10);
    //   }
    //   var elevatorMGR = new ElevatorManager(pos);
    //   three3D.scene.add(elevatorMGR.group);
    //   animate.addListener("TestElevator", (dt, t) => {
    //     for (let index = 0; index < 100; index++) {
    //       pos[index].setY(10 * Math.abs((t * 20 + offsets[index]) % 200 - 100));
    //     }
    //     elevatorMGR.update();
    //   })

    // }
  }

  componentDidUpdate(props) { }
  componentWillUnmount() {
    // 关闭animation
    const { eventComponent } = this.systemComponent;
    const { animate, clickEvent } = eventComponent;
    animate.stopAnimate = true;
    clickEvent.remove();

  }

  render() {
    return <div id={this.infos.domID}></div>;
  }
}

export default Index;

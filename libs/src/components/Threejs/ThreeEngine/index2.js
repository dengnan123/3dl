import React from 'react';
import { UnityGLTFLoader } from './Class/Loader/Unity/UnityGLTFLoader';
import { ThreeSystem } from './Class/System/ThreeSystem';

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

    this.systemComponent = new ThreeSystem({
      domID: this.infos.domID,
      eventSystem: {
        stats: {
          show: true,
        },
        screenSize: {
          x: infos.screenSize[0],
          y: infos.screenSize[1]
        }
      },
      three3D: {
        light: {
        }
      }
    });

    // const sceneManager = this.systemComponent.three3D.sceneManager;

    const unityLoader = new UnityGLTFLoader();
    const loaderInfo = UnityGLTFLoader.createData();
    loadBuild();
    function loadBuild() {
      const buildURL = 'Resources/Model/Unity/GLTF/taikang/taikang.gltf';
      loaderInfo.url = infos.baseResources + buildURL;
      loaderInfo.isDraco = false;
      loaderInfo.finished = (gltf) => {
        console.log(gltf);
      }
      unityLoader.loader(loaderInfo);
    }

    // const sphereGeo = new SphereBufferGeometry(10, 10, 10);
    // const mesh = new Mesh(sphereGeo, new MeshBasicMaterial());
    // const mesh2 = new Mesh(sphereGeo, new MeshBasicMaterial());
    // mesh.position.set(0, 20, 0);
    // mesh2.position.set(20, 20, 20);
    // sceneManager.scene.add(mesh);
    // sceneManager.scene.add(mesh2);
    // sceneManager.scene
  }

  componentDidUpdate(props) { }
  componentWillUnmount() {
    console.log('***********************************');

    try {
      this.systemComponent.dispose();
    } catch (error) {

    }



    console.log('***********************************');

  }

  render() {
    return <div id={this.infos.domID}></div>;
  }
}

export default Index;

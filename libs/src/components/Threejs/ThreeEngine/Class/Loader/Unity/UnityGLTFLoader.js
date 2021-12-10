import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "../GLTFLoader/GLTFLoader";

class UnityGLTFLoader {
  // constructor() {


  // }
  isDracoFromRemote = true;
  #gltfLoader;
  #gltfDracoLoader;

  loader(data = UnityGLTFLoader.createData()) {
    let loader;
    if (data.isDraco) {
      if (this.#gltfDracoLoader) {
        loader = this.#gltfDracoLoader;
      }
      else {
        loader = new GLTFLoader();
        const draco = new DRACOLoader();
        if (this.isDracoFromRemote) {
          draco.setDecoderPath("https://3dl.dfocus.top/api/static/Resources/draco/");
        }
        else {
          draco.setDecoderPath("draco/");
        }
        loader.setDRACOLoader(draco);
      }
    }
    else {
      if (this.#gltfLoader) {
        loader = this.#gltfLoader;
      }
      else {
        loader = new GLTFLoader();
        this.#gltfLoader = loader;
      }
    }
    const mats = {
      "AAA": "AAA"
    }
    loader.load(data.url, data.finished, null, null, mats);

  }

  static createData() {
    return {
      isDraco: false,
      url: undefined,
      finished: (gltf) => { },
    }
  }
}



export { UnityGLTFLoader }
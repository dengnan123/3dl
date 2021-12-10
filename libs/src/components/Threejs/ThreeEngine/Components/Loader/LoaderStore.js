import { UnityGLTFLoader } from "./UnityLoader";

var LoaderStore = {
    _gltf:undefined,
    _gltfDraco:undefined,

    getLoader:function(isDraco){
        let loader;
        if (isDraco) {
            if (!this._gltfDraco) {
                this._gltfDraco = new UnityGLTFLoader(true);
            }
            loader = this._gltfDraco;
        }
        else {
            if (!this._gltf) {
                this._gltf = new UnityGLTFLoader();
            }
            loader = this._gltf;
        }
        return loader;
    }
}

export {LoaderStore};
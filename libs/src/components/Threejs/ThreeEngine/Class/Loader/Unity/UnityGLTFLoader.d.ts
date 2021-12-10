import { GLTF } from "../GLTFLoader/GLTFLoader";

interface UNITYGLTF_DATA {
  /**是否 Draco压缩 */
  isDraco: Boolean;
  /** 地址*/
  url: String;

  finished(gltf: GLTF): void;
}
class UnityGLTFLoader {
  /** draco代码文件是否从服务器加载 */
  isDracoFromRemote: Boolean;

  loader(data: UNITYGLTF_DATA): void;

  static createData(): UNITYGLTF_DATA;
}


export { UnityGLTFLoader, UNITYGLTF_DATA }
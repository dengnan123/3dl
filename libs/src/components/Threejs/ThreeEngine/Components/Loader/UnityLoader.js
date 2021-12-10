import { MeshStandardMaterial } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Three3DTool } from "../../Tool/Tools";
import { BuildObject } from "../City/CityLayer/Object/BuildObject";
import { FloorObject } from '../City/CityLayer/Object/FloorObject';
const GLTF_OBJECT_TYPE = {
    BUILD: 'BUILD',
    FLOOR: "FLOOR",
    CITY: "CITYBUILD",
    SEGMENT: "SEGMENT",
}
const boxColliderMaterial = new MeshStandardMaterial({ visible: false });

const isFromMote = true;

var UnityGLTFLoader = function (isDracoy) {


    let animate;

    var loader = new GLTFLoader();
    if (isDracoy) {
        const dracoLoader = new DRACOLoader();
        if (!isFromMote) {
            dracoLoader.setDecoderPath("draco/");
        }
        else {
            dracoLoader.setDecoderPath("https://3dl.dfocus.top/api/static/Resources/draco/");
        }
        loader.setDRACOLoader(dracoLoader);
    }

    this.load = function (url) {
        url = url || 'Resources/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf';
        return new Promise(resolve => {
            loader.load(url, function (gltf, isSeperate = true) {
                const dic = {};
                if (isSeperate) {
                    const builds = [];
                    const floors = [];
                    const cityBuilds = [];
                    const segments = [];
                    dic['builds'] = builds;
                    dic['floors'] = floors;
                    dic['cityBuilds'] = cityBuilds;
                    dic['segments'] = segments;
                    dic['colliderMaterial'] = boxColliderMaterial;
                    var func = (son, node) => {
                        var objType = getObjType(son.name);
                        if (objType != undefined) {
                            switch (objType.toUpperCase()) {
                                case GLTF_OBJECT_TYPE.BUILD:
                                    builds.push(new BuildObject(son, boxColliderMaterial, animate));
                                    return true;
                                case GLTF_OBJECT_TYPE.FLOOR:
                                    floors.push(son);
                                    return true;
                                case GLTF_OBJECT_TYPE.CITY:
                                    cityBuilds.push(son);
                                    return true;
                                case GLTF_OBJECT_TYPE.SEGMENT:
                                    segments.push(son);
                                    return true;
                                default:
                                    break;
                            }
                        }

                    }
                    const tree = [];
                    gltf.scenes.forEach(element => {
                        Three3DTool.getObject3DChildrenTree(element, tree, func);
                    });
                }
                // onFinish(url,gltf,dic);
                resolve({ url, gltf, dic })

            });
        })
    }



    function getObjType(name) {
        const names = name.split("##");
        if (names.length == 3) {
            return names[1];
        }
    }

    Object.defineProperty(this, "animate", {
        get: function () { return animate },
        set: function (val) { animate = val }
    })


}


export { UnityGLTFLoader }
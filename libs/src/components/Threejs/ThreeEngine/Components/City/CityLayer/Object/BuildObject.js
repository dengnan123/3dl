import { DoubleSide, Group, MeshStandardMaterial, Vector3, Vector4 } from "three";
import { MeshStandardBuildSplitPatch } from "../../../../Shader/Patch/MeshStandardBuildSplitPatch";
import { PathTool } from "../../../../Tool/PathTool";
import { Three3DTool } from "../../../../Tool/Three3DTool";
import { LoaderStore } from "../../../Loader/LoaderStore";
import { cityLayer } from "../../CityInfo";
import { FloorObject } from "./FloorObject";
const buildLayer = cityLayer.BUILD;
function BuildObject(obj, boxColliderMaterial, animate) {
    this.isError = true;
    const buildObj = this;

    if (obj.children.length !== 3) {
        return;
    }
    let meshes;
    let outlineGroup;
    let boxCollider;
    let _floorGroup;

    let _itemInstanceGroup = new Group();
    _itemInstanceGroup.name = "ItemInstance";
    obj.add(_itemInstanceGroup);


    let outlines = {};
    //key materialName value material
    let maxFloorIndex = 0;
    let floorData = new Vector4(50, 25, 500, 0);
    let defaultMat = new MeshStandardMaterial({ name: "ground" });
    let materials = { "ground": defaultMat };
    let uniforms = {
        floorData: { value: floorData },
    }

    let _url;
    let _urlFolder;
    let currentIndex = 0;

    let isSelectNearExistFloor = true;
    let existFloor = [7, 12, 32];

    const floorAche = {};
    if (init()) {
        return;
    }
    this.isError = false;
    function init() {
        // console.log(obj);
        obj.children.forEach(element => {
            const cn = element.name.toLowerCase();
            // console.log(cn);
            if (cn.includes("combine")) {
                meshes = element;
                return;
            }
            if (cn.includes("outline")) {
                outlineGroup = element;
            }
            if (cn.includes("collider")) {
                boxCollider = element;
            }
        });


        if (meshes === undefined || boxCollider === undefined || outlineGroup === undefined) {
            console.log(`Build ${obj.name} 格式错误}`)
            return true
        }

        _floorGroup = new Group();
        _floorGroup.name = "Floor";
        obj.add(_floorGroup);
        _floorGroup.updateMatrix();
        // console.log(c1,c2);
        // console.log(meshes,outline)
        treatOutline();

        treatCombine();

        treatCollider();

        function treatOutline() {
            // console.log(outlineGroup.children);
            outlineGroup.children.forEach(element => {
                let names = element.name.split("_");
                if (names.length < 2) return;
                var name = names[1].toLowerCase();
                if (name.endsWith("f")) {
                    var indexN = name.slice(0, name.length - 1);
                    var index = Number(indexN);
                    if (index > maxFloorIndex) {
                        maxFloorIndex = index;
                    }
                    if (outlines[index]) {
                        console.log(`建筑物${obj.name}的${index}层已存在`)
                    }
                    else {
                        outlines[index] = element;
                    }
                }

                return;
            });
            var arr = Three3DTool.getObjectsWithType(outlineGroup, 'isMesh');
            arr.forEach(element => {
                // element.material = boxColliderMaterial;
                element.visible = false;
                // element.material = clipMaterial;
            })
        }
        function treatCombine() {
            // console.log(meshes.children);
            var arr = Three3DTool.getObjectsWithType(meshes, 'isMesh');
            floorData.setX(maxFloorIndex);
            // console.log(arr,maxFloorIndex);
            defaultMat.side = DoubleSide;
            arr.forEach(element => {

                const oldMat = element.material;
                if (element.parent.name.includes("groundMaterial") || element.parent.name.includes("Standard")) {
                    element.material = defaultMat;
                    oldMat.dispose();
                    return;
                }
                if (materials[oldMat.name]) {
                    element.material = materials[oldMat.name];
                    oldMat.dispose();
                    return;
                }
                materials[oldMat.name] = oldMat;
                oldMat.emissiveMap = oldMat.map;
            });
            const standardPatch = new MeshStandardBuildSplitPatch(uniforms);
            for (var key in materials) {
                const mat = materials[key];
                mat.onBeforeCompile = standardPatch.patch;
            }

        }
        function treatCollider() {
            var arr = Three3DTool.getObjectsWithType(boxCollider, 'isMesh');
            arr.forEach(element => {
                element.material = boxColliderMaterial;
                element.layers.set(buildLayer);
                element['layerRoot'] = obj;
                element['layerObj'] = buildObj;
            })
        }


    }
    this.setUniform = function (key, value) {
        // if (typeof (value) === "Number") {
        //     materials.forEach(mat => {
        //         mat.uniforms[key].value = value;
        //     });
        // }
        // else {
        //     materials.forEach(mat => {

        //     });
        // }
    }

    this.drawGUI = function (gui) {
        gui.addValue({
            uniform: { value: floorData }, key: "FloorData", infos: [
                { isPass: true },
                { name: "层", isSlider: true, max: floorData.x, delta: 1 },
                { name: "最大高度" },
                { name: "高度百分比", isSlider: true },
            ]
        });
        const matFolder = gui.addFolder({ key: "material", name: "材质" });
        matFolder.addValue({
            uniform: uniforms.diffuse, key: "diffuse", name: "漫反射颜色", isNeedVector: true, onChange: () => {
                materials["ground"].emissive.set(0.1, 0.1, 0.1);
                console.log(uniforms.emissive.value)
            }
        });
    }
    this.getOutline = function (index) {
        return outlines[index];
    }

    this.getFloor = function (posY) {
        let lastKey;
        for (var key in outlines) {
            if (outlines[key].position.y > posY) {
                break;
            }
            lastKey = key;
        }
        currentIndex = Number(lastKey)
        if (isSelectNearExistFloor) {
            let offset = 9999999;
            let lastIndex = -1;
            existFloor.forEach(element => {
                const off = Math.abs(currentIndex - element);
                if (off < offset) {
                    offset = off;
                    lastIndex = element;
                }
            });
            currentIndex = lastIndex;

        }
        return { index: currentIndex, outlineObj: outlines[currentIndex] };
    }
    this.getCurrentFloor = function () {
        if (floorAche[currentIndex]) {
            if (floorAche[currentIndex].isShow) {
                return floorAche[currentIndex].instance;
            }
        }
        return undefined;
    }
    this.setFloorIndex = function (index) {
        floorData.setY(index + 1);
        // console.log(floorData);
    }
    this.showFloor = function (index) {
        const newIndex = index || currentIndex;
        //隐藏老的
        if (currentIndex !== newIndex) {
            if (!currentIndex) {
                this.hideFloor(currentIndex);
            }
        }
        //如果没有加载过
        if (!floorAche[index]) {
            const url = _urlFolder + `/Floor/${index}F/${index}F.gltf`;
            const loader = {
                url,
                index,
                instance: undefined,
                isShow: true,
                isComplete: false,
                onLoad: onFloorLoader,
            }
            floorAche[index] = loader;


            loadFloorAsync();

            async function loadFloorAsync() {
                const gltfLoader = LoaderStore.getLoader(false);
                const { dic } = await gltfLoader.load(url);
                const { floors, colliderMaterial } = dic;
                loader.isComplete = true;
                if (loader.onLoad) {
                    loader.onLoad(loader, floors[0], colliderMaterial);
                }
            }
        }
        else {
            //如果加载过
            const loader = floorAche[index];
            loader.isShow = true;
            if (loader.isComplete) {
                onFloorLoader(loader, loader.obj, loader.colliderMaterial);
            }

        }

        return floorAche[index];


        function onFloorLoader(loader, obj, colliderMaterial) {
            if (animate) {
                animate.needsUpdate = true;
            }
            const { index } = loader;
            let instance = loader.instance;
            if (!instance) {
                instance = new FloorObject(obj, colliderMaterial)
                loader.instance = instance;
                loader.obj = obj;
                loader.colliderMaterial = colliderMaterial;
                _floorGroup.add(instance.roomWallRoot);
                var pos = new Vector3();
                outlines[index].getWorldPosition(pos);
                pos.applyMatrix4(_floorGroup.matrixWorld.invert());
                console.log(pos);
                instance.roomWallRoot.position.setY(pos.y + 0.1);
                instance.roomWallRoot.updateWorldMatrix(false, true);
                if (true) {
                    instance.roomWallRoot.position.setX(-3.4);
                    // instance.floorRoot.position.setZ(-28);
                    instance.roomWallRoot.position.setZ(3.2);
                }
                instance.roomWallRoot.scale.set(1.1, 1.0, 1.1);
                instance.roomWallRoot.updateMatrix();
                instance.roomWallRoot.add(instance.itemRoot);
                _itemInstanceGroup.attach(instance.itemRoot);

            }
            else {
                _floorGroup.add(instance.roomWallRoot);
                _itemInstanceGroup.add(instance.itemRoot);
            }
            // console.log("显示楼层数",_floorGroup.children.length);
        }
    }
    this.hideFloor = function (index) {
        index = index !== undefined ? index : currentIndex;
        console.log(index);
        console.log(floorAche);
        const loader = floorAche[index];
        if (!loader) return;
        loader.isShow = false;
        console.log(loader);
        //如果加载完成
        if (loader.isComplete) {
            // console.log(_floorGroup);
            _floorGroup.remove(loader.instance.roomWallRoot);
            _itemInstanceGroup.remove(loader.instance.itemRoot);
            // console.log(_floorGroup)
            return;
        }
    }

    this.getInfo = function () {
        const info = {};
        info['url'] = _url;
        info['isBuild'] = true;
        info['buildName'] = PathTool.getFileNameWithoutExt(_url);
        return info;
    }


    Object.defineProperty(this, "group", {
        get: function () { return obj },
    })
    Object.defineProperty(this, "currentIndex", {
        get: function () { return currentIndex },
    })
    Object.defineProperty(this, "meshGroup", {
        get: function () { return meshes },
    })
    Object.defineProperty(this, "outlineGroup", {
        get: function () { return outlineGroup },
    })
    Object.defineProperty(this, "maxFloorIndex", {
        get: function () { return maxFloorIndex },
    })
    Object.defineProperty(this, "url", {
        get: function () { return _url },
        set: function (val) {
            _url = val;
            _urlFolder = val.slice(0, _url.lastIndexOf('/'));
        }
    })
    Object.defineProperty(this, "isBuildLayer", {
        get: function () { return true },
    })
    Object.defineProperty(this, "heightPercent", {
        get: function () { return floorData.w },
        set: function (val) { floorData.setW(val) }
    })


    // DebugTool.logObject3DChildren(obj);

}
export { BuildObject };


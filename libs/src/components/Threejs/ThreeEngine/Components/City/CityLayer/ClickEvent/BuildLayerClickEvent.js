import { Vector3 } from "three";
import { DebugTool } from "../../../../Tool/DebugTool";
import { cityLayer } from "../../CityInfo";
import { FloorLayerClickEvent } from "./FloorLayerClickEvent";

// const isLog = true;
const buildLayer = cityLayer.BUILD;

function BuildLayerClickEvent(eventComp, three3D, onClickCallback) {
    let _targetObjects = undefined;
    let selectTarget = undefined;

    let worldCameraPos = new Vector3();
    let worldCameraDis = 0;
    const buildCameraDis = 400;
    let cityBlock = undefined;
    const { animate } = eventComp;




    const floorLayerCE = new FloorLayerClickEvent(eventComp, three3D, this, onClickCallback);
    let isCheckBySon = false;
    this.onClick = function (raycaster, pos, e) {
        // console.log("IsCheckBySon", isCheckBySon)
        if (isCheckBySon) {
            return floorLayerCE.onClick(raycaster, pos, e);
        }

        raycaster.layers.set(buildLayer);
        const ios = raycaster.intersectObject(_targetObjects, true);
        if (ios.length > 0) {
            const io = ios[0];
            const { object } = io;

            const buildRoot = object.layerRoot;
            const buildObj = object.layerObj;
            // console.log(object);
            if (!buildRoot) {
                console.log(`物体${DebugTool.logObjectParentPath(object)}不存在buildRoot`);
            }
            if (!buildObj || !buildObj.isBuildLayer) return;
            if (e.altKey) {
                three3D.selection.setSelection(object.layerRoot, buildObj);
            }
            return object;
        }
    }

    this.onClickChecked = function (object, e) {
        if (isCheckBySon) {
            floorLayerCE.onClickChecked(object, e);
            return;
        }


        if (object) {
            // const buildRoot = object.layerRoot;
            // const buildObj = object.layerObj;
            // console.log("进入Build")
            forwardToHere(object);
        }
        else {
            if (!selectTarget) return;
            back(e);
        }
    }


    function forwardToHere(object) {
        const cameraManager = three3D.cameraManager;
        worldCameraPos.copy(three3D.cameraManager.controlTarget);
        worldCameraDis = cameraManager.getDistance();
        selectTarget = object;
        toHere(worldCameraDis, buildCameraDis);
        outputMessage(object);
    }



    this.backToHere = (isEnd) => {
        if (isEnd) {
            isCheckBySon = false;
            back();
            return;
        }
        let startDis = three3D.cameraManager.getDistance();
        toHere(startDis, buildCameraDis);
    }


    function toHere(start, end) {
        const { outlinePass, cameraManager } = three3D;
        const buildObj = selectTarget.layerObj;
        outlinePass.selectedObjects = [buildObj.meshGroup];
        outlinePass.forceInvisibleObjects = [];
        animate.needsUpdate = true;
        var func = () => { isCheckBySon = true };
        cameraManager.setTarget(selectTarget.position, start, end, func);
    }
    function back(e) {
        three3D.cameraManager.setTarget(worldCameraPos, buildCameraDis, worldCameraDis);
        selectTarget = undefined;
        const outlinePass = three3D.outlinePass;
        outlinePass.selectedObjects = [];
        outlinePass.forceInvisibleObjects = [];
        animate.needsUpdate = true;
        if (!cityBlock) return;
        // if (e) {
        //     if (e.altKey) {
        //         three3D.selection.setSelection(cityBlock.group, cityBlock, true);
        //     }
        // }

    }

    function outputMessage(object) {
        const info = object.layerObj.getInfo();
        if (onClickCallback) {
            onClickCallback(info);
        }
    }
    Object.defineProperty(this, "targetObjects", {
        get: function () { return _targetObjects },
        set: function (val) {
            _targetObjects = val;
            floorLayerCE.targetObjects = val;
        },
    })
    Object.defineProperty(this, "selectTarget", {
        get: function () { return selectTarget },
    })
    Object.defineProperty(this, "buildCameraDis", {
        get: function () { return buildCameraDis },
    })
    Object.defineProperty(this, "cityBlock", {
        get: function () { return cityBlock },
        set: function (val) { cityBlock = val }
    })

}

export { BuildLayerClickEvent }
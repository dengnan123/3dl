import { Vector3 } from "three";
import { PathTool } from "../../../../Tool/PathTool";
import { cityLayer } from "../../CityInfo";
import { RoomLayerClickEvent } from "./RoomLayerClickEvent";

const buildLayer = cityLayer.BUILD;

function FloorLayerClickEvent(eventComp, three3D, build, onClickCallback) {
    var _parent = build;
    let _targetObjects = undefined;
    let _selectionObj = undefined;
    let _selectIndex = undefined;
    let _lastFloorData = undefined;
    let _currentFloorData = undefined;
    let upAnimate;
    let downAnimate;

    // let isShowGUI = false;
    let isCheckBySon = false;

    const { animate } = eventComp;
    const roomLayerCE = new RoomLayerClickEvent(eventComp, three3D, this, onClickCallback)
    const worldPos = new Vector3();

    let worldCameraDis = 0;
    let isReturning = false;
    const floorCameraDis = 200;

    this.getSelectionInfo = function () {
        const outputData = {};
        outputData['url'] = _selectionObj.url;
        outputData['isFloor'] = true;
        outputData['floorName'] = PathTool.getFileNameWithoutExt(outputData.url);
        if (outputData.floorName) {
            outputData['floorIndex'] = Number(outputData.floorName.replace("F", ""));
        }
        let buildName = PathTool.getParentFolderName(outputData.url);
        buildName = PathTool.getParentFolderName(buildName);
        buildName = PathTool.getParentFolderName(buildName);
        buildName = PathTool.getFileName(buildName);

        outputData['buildName'] = buildName;

        return outputData;
    }
    const getSelectionInfo = this.getSelectionInfo;
    this.onClick = function (raycaster, pos, e) {
        if (isReturning) {
            return;
        }
        if (isCheckBySon) {
            return roomLayerCE.onClick(raycaster, pos, e, _parent.selectTarget.layerObj);
        }

        // if (isShowGUI) {
        //     if (e.altKey) {
        //         isShowGUI = false;
        //         three3D.selection.setSelection();
        //     }
        //     else {
        //         return;
        //     }
        // }

        const parentTarget = _parent.selectTarget;
        raycaster.layers.set(buildLayer);
        const ios = raycaster.intersectObject(_targetObjects, true);
        if (ios.length > 0) {
            const io = ios[0];
            const { point, object } = io;
            if (object !== parentTarget) {
                console.log("return to parent")
                return parentTarget;
            }
            const buildRoot = object.layerRoot;
            const buildObj = object.layerObj;
            point.applyMatrix4(buildRoot.matrixWorld.invert());
            const floorData = buildObj.getFloor(point.y);
            _lastFloorData = floorData;

            // console.log("floorData", floorData);
            return floorData.index;


        }
        else {
            // backToParent();
            return parentTarget;
        }


        // if (e.altKey) {
        //     // three3D.selection.setSelection(obj)
        //     three3D.selection.setSelection(floor.floorRoot, floor);
        //     isShowGUI = true;
        // }
        //     const buildRoot = object.layerRoot;
        //     const buildObj = object.layerObj;

        //     if (!e.altKey) {
        //         if (isCheckBySon) {
        //             roomLayerCE.onClick(raycaster, pos, e, buildObj)
        //             return;
        //         }
        //     }

        //    


        //     buildObj.setFloorIndex(floorData.index);
        //     // floorData.outlineObj.visible = true;
        //     const outlinePass = three3D.outlinePass;
        //     _selectIndex = floorData.index;

        //     outlinePass.selectedObjects = [floorData.outlineObj];
        //     outlinePass.forceInvisibleObjects = [buildObj.meshGroup];
        //     animate.needsUpdate = true;

        //     if (e.altKey) {
        //         // three3D.selection.setSelection(obj)
        //         const floor = buildObj.getCurrentFloor();
        //         three3D.selection.setSelection(floor.floorRoot, floor);
        //         isShowGUI = true;
        //     }
        //     //动画
        //     if (!upAnimate) {
        //         let downA = 1;
        //         if (downAnimate) {
        //             downAnimate.isForceEnd = true;
        //             downA = downAnimate.alpha;
        //             downAnimate = undefined;
        //         }
        //         const key = `Build-${parentTarget.layerRoot.name}-BuildSplitUp`;
        //         const moveUpAnim = (alpha) => {
        //             buildObj.heightPercent = alpha;
        //         }
        //         const time = 2;
        //         upAnimate = animate.addAnimateStack(key, moveUpAnim, (1 - downA) * time, time);
        //     }
        //     if (_selectIndex !== undefined) {
        //         _selectionObj = buildObj.showFloor(_selectIndex);
        //         outputMessage();
        //         isCheckBySon = true;
        //     }



        // }
        // else {
        //     backToParent();

        // }


    }

    this.onClickChecked = function (object, e) {
        if (isReturning) {
            return;
        }
        // if (isCheckBySon) {
        //     roomLayerCE.onClickChecked(object, e);
        //     return;
        // }

        if (object && object !== _parent.selectTarget) {
            if (_selectIndex) return;
            const buildObj = _parent.selectTarget.layerObj;
            const floorData = _lastFloorData;
            _currentFloorData = _lastFloorData;
            cameraToNewFloor(floorData);
            showOutline(floorData, buildObj);
            animateToFloor(buildObj);
            return;
        }
        backToParent();

    }

    function backToParent() {
        if (isCheckBySon) {
            isCheckBySon = false;
            roomLayerCE.forceBack();
            //启动返回标志
            isReturning = true;
            const parentTarget = _parent.selectTarget;
            const buildObj = parentTarget.layerObj;
            //移动摄像机
            _currentFloorData.outlineObj.getWorldPosition(worldPos);
            worldCameraDis = three3D.cameraManager.getDistance();
            three3D.cameraManager.setTarget(worldPos, worldCameraDis, _parent.buildCameraDis);
            showOutline(_currentFloorData, buildObj);
            //动画
            if (upAnimate) {

                upAnimate.isForceEnd = true;
                const upA = upAnimate.alpha;
                upAnimate = undefined;
                const key = `Build-${parentTarget.layerRoot.name}-BuildSplitDown`;

                const moveDownAnim = (alpha) => {
                    buildObj.heightPercent = 1 - alpha;
                }
                const moveDownFinish = () => {
                    console.log("Finish");
                    isReturning = false;
                    buildObj.hideFloor(_selectIndex);
                    _selectIndex = undefined;
                    _selectionObj = undefined;
                }
                const time = 2;
                downAnimate = animate.addAnimateStack(key, moveDownAnim, (1 - upA) * time, time, moveDownFinish);

            }

        }
        else {
            _parent.backToHere(true);
            _currentFloorData = undefined;

        }



    }
    function cameraToNewFloor(floorData) {
        floorData.outlineObj.getWorldPosition(worldPos);
        worldCameraDis = three3D.cameraManager.getDistance();
        three3D.cameraManager.setTarget(worldPos, worldCameraDis, floorCameraDis);
    }
    function showOutline(floorData, buildObj) {
        buildObj.setFloorIndex(floorData.index);
        const outlinePass = three3D.outlinePass;
        _selectIndex = floorData.index;
        outlinePass.selectedObjects = [floorData.outlineObj];
        outlinePass.forceInvisibleObjects = [buildObj.meshGroup];
        animate.needsUpdate = true;
    }
    function animateToFloor(buildObj) {
        if (!upAnimate) {
            let downA = 1;
            if (downAnimate) {
                downAnimate.isForceEnd = true;
                downA = downAnimate.alpha;
                downAnimate = undefined;
            }
            const key = `Build-${_parent.selectTarget.layerRoot.name}-BuildSplitUp`;
            const moveUpAnim = (alpha) => {
                buildObj.heightPercent = alpha;
            }
            const time = 2;
            upAnimate = animate.addAnimateStack(key, moveUpAnim, (1 - downA) * time, time);
        }
        if (_selectIndex !== undefined) {
            _selectionObj = buildObj.showFloor(_selectIndex);
            outputMessage();
            isCheckBySon = true;
        }
    }
    function outputMessage() {
        const outputData = getSelectionInfo();
        // outputData['buildName']
        if (onClickCallback) {
            onClickCallback(outputData);
        }
    }

    // function toNewFloor(floorData) {
    //     floorData.outlineObj.getWorldPosition(worldPos);
    //     worldCameraDis = three3D.cameraManager.getDistance();
    //     three3D.cameraManager.setTarget(worldPos, worldCameraDis, floorCameraDis);
    // }


    Object.defineProperty(this, "targetObjects", {
        get: function () { return _targetObjects },
        set: function (val) {
            _targetObjects = val;
        },
    })
}
export { FloorLayerClickEvent }
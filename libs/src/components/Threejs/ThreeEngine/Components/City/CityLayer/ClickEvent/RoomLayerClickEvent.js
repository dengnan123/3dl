import { Three3DTool } from "../../../../Tool/Three3DTool";
import { cityLayer } from "../../CityInfo";


function RoomLayerClickEvent(eventComp, three3D, floor, onClickCallback) {
    let _parent = floor;
    // let isShowGUI = false;
    let selectRoom = undefined;
    // const worldPos = new Vector3();
    const { animate } = eventComp;
    this.onClick = function (raycaster, pos, e, build) {
        // if (isShowGUI) {
        //     if (e.shiftKey) {
        //         isShowGUI = false;
        //         three3D.selection.setSelection();
        //     }
        //     else {
        //         return;
        //     }
        // }
        var floor = build.getCurrentFloor();
        if (!floor) return;
        var root = floor.floorRoot;
        var meshes = Three3DTool.getObjectsWithType(root, "isMesh");
        var materials = {};
        for (var key in meshes) {
            materials[meshes[key].material.uuid] = meshes[key].material;
        }
        // console.log(materials);

        // console.log(floor);
        raycaster.layers.set(cityLayer.ROOM);
        const ios = raycaster.intersectObject(floor.floorRoot, true);
        if (ios.length > 0) {

            const io = ios[0];
            const { object } = io;
            // const roomName = StringTake.takeGLTFNodeName(object.name);

            const roomObj = object.layerObj;
            if (roomObj) {
                if (roomObj !== selectRoom) {
                    toNewRoom(roomObj);
                    // console.log(roomName);

                }
                else {
                    const outlinePass = three3D.outlinePass;
                    outlinePass.selectedObjects = [roomObj.wall];
                    animate.needsUpdate = true;
                }
            }
            return roomObj;

        }
    }

    this.onClickChecked = function (object, e) {

    }
    this.forceBack = function () {
        back();
    }
    function toNewRoom(roomObj) {
        const outlinePass = three3D.outlinePass;
        outlinePass.selectedObjects = [roomObj.wall];
        animate.needsUpdate = true;
        selectRoom = roomObj;
        // roomObj.wall.getWorldPosition(worldPos);
        // three3D.cameraManager.setTarget(worldPos);
        outputMessage();
        // three3D.cameraManager.set
    }
    function back() {
        selectRoom = undefined;
    }
    function outputMessage() {
        const outputData = {};
        outputData['floor'] = _parent.getSelectionInfo();
        outputData['roomName'] = selectRoom.root.name;
        outputData['isRoom'] = true;

        if (onClickCallback) {
            onClickCallback(outputData);
        }
    }

}

export { RoomLayerClickEvent }
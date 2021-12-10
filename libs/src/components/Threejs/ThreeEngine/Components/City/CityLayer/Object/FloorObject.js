import { BoxBufferGeometry, Group, Mesh, MeshBasicMaterial } from "three";
import { StringTake } from "../../../../Tool/StringTake";
import { Three3DTool } from "../../../../Tool/Three3DTool";
import { InstanceObject3D } from "../../../System/Three3D/Instance/InstanceObject3D";
import { cityLayer } from "../../CityInfo";
import { ItemObject } from "./ItemObject";
const floorLayer = cityLayer.ROOM;
function FloorObject(obj, boxColliderMaterial, isUnlit = true) {


    this.isError = true;
    let currectIndex = 0;
    const floorObj = this;
    if (!obj) return;


    //Item Instance
    let _itemRoot;
    let _itemDic = {};
    let rooms = [];


    //Room Wall
    let _roomWall;
    let floorRoot = obj;


    const lodSetting = {
        distance: [50, 100],
        onSettingChange: []
    }
    //
    const materials = {};

    this.drawGUI = function (gui) {
        // console.log("Draw Floor");
        const objData = { uniform: { value: floorRoot }, key: "Transform" };
        gui.addValue(objData);
    }





    init();

    function init() {
        const sons = {};
        obj.children.forEach(element => {
            const cn = element.name.toLowerCase();
            if (cn.includes("floor")) {
                sons['floor'] = element;
                return;
            }
            if (cn.includes("item")) {
                sons['item'] = element;
                return;
            }
            console.log(element.name);

        });


        if (sons["floor"] && sons['item']) {

            dealItemInstance(sons['item']);

            dealFloor(sons["floor"]);

            for (var key in _itemDic) {
                _itemDic[key].show();
            }
        }
        else {
            console.log("file error");
        }


        dealMaterial();

        function dealItemInstance(itemRoot) {
            let objName = StringTake.takeGLTFNodeName(obj.name);
            _itemRoot = new Group();
            _itemRoot.name = objName;
            itemRoot.children.forEach(element => {
                let childName = StringTake.takeGLTFNodeName(element.name);
                const itemDicKey = childName.substring(0, childName.lastIndexOf("#") + 1);
                if (_itemDic[itemDicKey]) {
                    console.error("家具名称重复");
                    console.log(childName);
                    console.log(itemDicKey);
                    return;
                }
                element.name = childName;
                _itemDic[itemDicKey] = new ItemObject(element, _itemRoot);
            });


            itemRoot.parent.remove(itemRoot);


            // _itemRoot = itemRoot;
            // itemRoot.children.forEach(element => {
            //     element.updateWorldMatrix(false, true);
            //     var childName = StringTake.takeGLTFNodeName(element.name);
            //     if (_itemDic[childName]) {
            //         console.error("家具名称重复");
            //         return;
            //     }
            //     _itemDic[childName] = new ItemObject(childName, element, lodSetting);
            //     element.name = childName;
            // });
            // console.log(_itemDic);
            // currectIndex++;
        }

        function dealFloor(floorRoot) {
            _roomWall = floorRoot;
            floorRoot.children.forEach((element, index) => {
                element.name = StringTake.takeGLTFNodeName(element.name);

                const room = new RoomObject(element, floorObj, _itemDic, boxColliderMaterial, index);
                rooms.push(room);

            });



            currectIndex++;

        }
        function dealMaterial() {
            if (!isUnlit) return;
            const meshes = Three3DTool.getObjectsWithType(obj, "isMesh");
            meshes.forEach(element => {
                let material = element.material;
                let mat = materials[material.name];
                if (!mat) {
                    mat = new MeshBasicMaterial({ name: material.name });
                    mat.color.copy(element.material.color).multiplyScalar(0.3);
                    mat.map = material.map;
                    mat.opacity = 0.5;
                    materials[material.name] = mat;
                    // console.log(material);

                }
                material.dispose();
                element.material = mat;

                // let material = element.material;
                // materials[material.name] = material;
            });
            // console.log(materials);
        }
    }

    // this.showItemInstance = function () {
    //     for (var key in _itemDic) {
    //         _itemDic[key].show();
    //     }
    // }
    if (currectIndex === 2) {
        this.isError = false;
    }

    Object.defineProperty(this, "items", {
        get: function () { return _itemDic },
    })
    // Object.defineProperty(this, "roomWallRoot", {
    //     get: function () { return _roomWall },
    // })
    Object.defineProperty(this, "roomWallRoot", {
        get: function () { return obj },
    })

    Object.defineProperty(this, "floorRoot", {
        get: function () { return floorRoot },
    })

    Object.defineProperty(this, "itemRoot", {
        get: function () { return _itemRoot },
    })
}

function RoomObject(obj, floorObj, itemDic, boxColliderMaterial, index) {
    //CombineWall
    let _combineWall;
    let roomName;
    const roomObj = this;
    let colliderRoot;
    init();
    function init() {
        roomName = obj.name;

        obj.children.forEach(element => {
            element.name = StringTake.takeGLTFNodeName(element.name);
            if (element.name === "Item") {
                treatItems(element);
                return;
            }
            if (element.name === "Collider") {
                colliderRoot = element;
                treatCollider(element);
                return;
            }
            if (element.name === "Wall") {
                treatCombineWall(element);
                return;
            }

            function treatCollider(collider) {
                var arr = Three3DTool.getObjectsWithType(collider, 'isMesh');
                arr.forEach(element => {
                    element.material = boxColliderMaterial;
                    element.layers.set(floorLayer);
                    element['layerRoot'] = obj;
                    element['layerObj'] = roomObj;
                })
            }
            function treatCombineWall(wall) {
                _combineWall = wall;
            }
            function treatItems(items) {
                // console.log(itemDic)
                element.children.forEach(item => {
                    var itemName = StringTake.takeGLTFNodeName(item.name);
                    var itemIns = itemDic[itemName];
                    if (!itemIns) {
                        // console.log(`Item:${itemName} not exist`)
                        return;
                    }
                    if (itemIns.itemGroups[roomName]) {
                        console.log(`key ${roomName} already exist`);
                        console.log(roomName);
                        return;
                    }
                    itemIns.itemGroups[roomName] = item;

                });
            }
        });
    }

    Object.defineProperty(this, "root", {
        get: function () { return obj },
    })
    Object.defineProperty(this, "wall", {
        get: function () { return _combineWall },
    })

}

export { FloorObject }
import { BoxBufferGeometry, Group, LOD, Matrix4, Mesh, MeshBasicMaterial, Object3D, Vector3 } from "three";
import { StringTake } from "../../../../Tool/StringTake";
import { Three3DTool } from "../../../../Tool/Three3DTool";
import { InstanceItem } from "../../../Object/InstanceItem";

function ItemObject(obj, parent) {
    const itemRoot = new Group();

    const itemName = obj.name;
    const matrix = new Matrix4();
    const itemGroups = {};
    const object3D = new Object3D();
    let instance;
    init();
    this.show = function () {
        let index = 0;
        for (var key in itemGroups) {
            //遍历房间中的每个Item
            itemGroups[key].children.forEach(element => {
                instance.set(element, index);
                index++;
            });
        }
    }
    function init() {
        //初始化根
        itemRoot.name = obj.name;
        const nameSplit = obj.name.split("##");
        let instanceCount = Number(nameSplit[1]);
        instance = new InstanceItem(obj, instanceCount);
        parent.add(instance.root);
    }
    // this.show = function () {
    //     let count = 0;
    //     for (var key in itemGroups) {
    //         count += itemGroups[key].children.length;
    //     }
    //     const sonName = StringTake.takeGLTFNodeName(obj.children[0].name);
    //     obj.children[0].name = sonName;

    //     const lod0 = Three3DTool.replaceMeshWithInstanceMesh(obj.children[0], count, itemRoot);
    //     if (obj.parent) {
    //         obj.parent.remove(obj);
    //     }
    //     count = 0;
    //     if (itemName === "&&_Work_station_L_shape_1400-1400_1_##") {
    //     }
    //     return lod0;
    //     //遍历房间
    //     for (var key in itemGroups) {
    //         //遍历房间中的每个Item
    //         itemGroups[key].children.forEach(element => {

    //             lod0.children.forEach(insMesh => {
    //                 if (!insMesh.isInstancedMesh) return;

    //                 //先将object移到Element下
    //                 Three3DTool.clearTransform(object3D);
    //                 element.add(object3D);

    //                 //转移到父空间
    //                 insMesh.parent.attach(object3D);

    //                 object3D.position.add(insMesh.position);
    //                 object3D.quaternion.multiply(insMesh.quaternion);
    //                 object3D.scale.multiply(insMesh.scale);
    //                 object3D.updateMatrix();
    //                 // object3D.updateMatrix();
    //                 insMesh.setMatrixAt(count, object3D.matrix);

    //             });

    //             if (object3D.parent) {
    //                 object3D.parent.remove(object3D);
    //             }


    //             count++;
    //         });
    //     }
    // }
    // function onSettingChange() {

    // }


    Object.defineProperty(this, "itemGroups", {
        get: function () { return itemGroups },
    })

}

export { ItemObject };


// function ItemObject(name,obj,lodSetting){
//     const itemRoot = obj;
//     const itemName = name;
//     const lodRoot = new LOD();
//     const matrix = new Matrix4();
//     const itemGroups = [];
//     init();
//     function init(){


//         //chuli mesh
//         //Lod1


//         // lodRoot.addLevel(levels[0],lodSetting.distance[0]);
//         // lodRoot.addLevel(levels[1],lodSetting.distance[1]);
//         // // console.log(itemRoot.children);
//         // lodSetting.onSettingChange.push(onSettingChange);
//         // if(lodSetting.onSettingChange)
//     }
//     this.show = function(){
//         let count = 0;
//         for(var key in itemGroups){
//             count+= itemGroups[key].children.length;
//         }

//         const levels = [undefined,undefined]
//         itemRoot.children.forEach(element => {
//             const sonName = StringTake.takeGLTFNodeName(element.name);
//             if(sonName.toUpperCase() ==="LOD0"){
//                 levels[0] = element;
//             }
//             if(sonName.toUpperCase() ==="LOD1"){
//                 levels[1] = element;
//             }
//         });
//         if(!(levels[0]&&levels[1])){
//             console.log(`Item ${itemName} lod lose`);
//             return;
//         }
//         levels[0] = Three3DTool.replaceMeshWithInstanceMesh(levels[0],count);
//         levels[1] = Three3DTool.replaceMeshWithInstanceMesh(levels[1],count);
//         levels[1].visible = false;
//         //Apply
//         count = 0;
//         const object3D = new Object3D();
//         //遍历房间
//         for(var key in itemGroups){
//             //遍历房间中的每个Item
//             itemGroups[key].children.forEach(element => {


//                 levels.forEach(level => {
//                     level.children.forEach(insMesh => {
//                         if(!insMesh.isInstancedMesh)return;

//                         //先将object移到Element下
//                         Three3DTool.clearTransform(object3D);
//                         element.add(object3D);

//                         //转移到父空间
//                         insMesh.parent.attach(object3D);

//                         object3D.position.add(insMesh.position);
//                         object3D.quaternion.multiply(insMesh.quaternion);
//                         object3D.scale.multiply(insMesh.scale);
//                         object3D.updateMatrix();
//                         // object3D.updateMatrix();
//                         insMesh.setMatrixAt(count,object3D.matrix);
//                     });
//                 });
//                 object3D.parent.remove(object3D);


//                 count++;
//             });
//         }
//     }
//     function onSettingChange(){

//     }


//     Object.defineProperty(this, "lodRoot", {
//         get: function () { return lodRoot },
//     })
//     Object.defineProperty(this, "itemGroups", {
//         get: function () { return itemGroups },
//     })

// }
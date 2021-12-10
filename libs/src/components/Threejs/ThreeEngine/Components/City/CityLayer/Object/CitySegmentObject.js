import { Group } from "three";
import { StringTake } from "../../../../Tool/StringTake";
import { Three3DTool } from "../../../../Tool/Three3DTool";

function CitySegmentObject() {

    const heights = [2, 1, 0];
    let materials = [undefined, undefined, undefined]
    const group = new Group();
    this.drawGUI = function (folder) {
        const segFolder = folder.addFolder({ key: "Segment", name: "道路", isOpen: true });
        for (var key in materials) {
            segFolder.addValue({ uniform: { value: materials[key] }, key: `Material_Level_${key}` });
        }
    }
    this.add = function (son) {
        const oldMaterial = [];
        const meshes = Three3DTool.getObjectsWithType(son, "isMesh");
        meshes.forEach(mesh => {
            const material = mesh.material;
            StringTake.removeNameClone(material);
            const names = material.name.split("_");
            const matIndex = Number(names[1]);
            if (!matIndex) {
                console.log(material.name);
                console.log(material)
                return;
            }

            if (!materials[matIndex - 1]) {
                materials[matIndex - 1] = material;
            }
            else {
                if (materials[matIndex - 1].uuid !== material.uuid) {
                    oldMaterial.push(material);
                    mesh.material = materials[matIndex - 1];
                }
            }

            mesh.position.setY(heights[matIndex - 1]);
            mesh.updateWorldMatrix();


        });
        for (let key in materials) {
            console.log(key, materials[key].color);
        }
        for (let key in oldMaterial) {
            oldMaterial[key].dispose();
        }
        group.add(son);
    }

    Object.defineProperty(this, "group", {
        get: function () { return group },
    })

    // init();
    // function init(){
    //     const meshes = Three3DTool.getObjectsWithType(obj,'isMesh');
    //     for(var index in meshes){
    //         const material = meshes[index].material;
    //         StringTake.removeNameClone(material);
    //         const names = material.name.split("_");
    //         const matIndex = Number(names[1]);
    //         if(!matIndex){
    //             console.log(material.name);
    //             console.log(material)
    //             continue;
    //         }

    //         if(!materials[matIndex-1]){
    //             materials[matIndex-1] = material;
    //         }
    //         else{
    //             if(materials[matIndex-1].uuid!==material.uuid){
    //                 console.log(index-1,material);
    //             }
    //         }
    //     }

    // }
}



export { CitySegmentObject }
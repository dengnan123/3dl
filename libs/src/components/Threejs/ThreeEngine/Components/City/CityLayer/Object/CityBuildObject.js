import { Group } from "three";
import { SkyScraperBuild } from "../../../../Class/Object/City/SkyScraper/SkyScraperBuild";
import { StringTake } from "../../../../Tool/StringTake";
import { Three3DTool } from "../../../../Tool/Three3DTool";
import { LoaderStore } from "../../../Loader/LoaderStore";

function CityBuildObject() {

    const buildMaterials = {};
    const group = new Group({ name: "CityBuilds" });
    let skyScraperBuild = new SkyScraperBuild();
    group.add(skyScraperBuild.group);
    init();


    this.add = function (son) {
        const oldMaterial = [];

        // let combine;
        // let high;
        group.attach(son);
        son.updateWorldMatrix(false, true);
        const height = [];
        son.children.forEach(element => {
            var name = "";
            name = StringTake.takeGLTFNodeName(element.name);
            if (name === "Combine") {
                dealCombine(element);
                return;
            }
            if (name === "High") {
                dealHigh(element);
                height.push(element);
                return;
            }
        });

        return;


        function dealCombine(combine) {
            const meshes = Three3DTool.getObjectsWithType(combine, "isMesh");
            meshes.forEach(mesh => {
                const material = mesh.material;
                StringTake.removeNameClone(material);
                const mat = buildMaterials[material.name];
                // if (material.name === "Building2") {
                //     mesh.scale.setY(0.9955);
                //     mesh.updateMatrix();
                //     mesh.updateMatrixWorld();
                //     material.color.setRGB(0.15, 0.2317, 0.4474);
                // }
                if (mat) {
                    oldMaterial[material.uuid] = material;
                    mesh.material = mat;
                }
                else {
                    buildMaterials[material.name] = material;
                    treatMaterial(material);
                }
            });
            for (var key in oldMaterial) {
                oldMaterial[key].dispose();
            }
        }

        function dealHigh(high) {
            for (let index = 0; index < high.children.length; index++) {
                const element = high.children[index];
                skyScraperBuild.add(element, element.scale.y);
            }
            skyScraperBuild.update();
        }
    }

    this.drawGUI = function (folder, index) {
        const buildFolder = folder.addFolder({ key: "Build", name: "建筑", isOpen: true });
        for (var key in buildMaterials) {
            buildFolder.addValue({ uniform: { value: buildMaterials[key] }, key: buildMaterials[key].name });
        }
    }
    this.loadFinish = function () {
        skyScraperBuild.update();
    }
    function init() {
        loadSSB();

        async function loadSSB() {
            const loader = LoaderStore._gltfDraco;
            const data = await loader.load("https://3dl.dfocus.top/api/static/Resources/Model/Unity/GLTF/SkyScrapers/gltfDraco/GLTF_TB_CITY_Skysc_G_Blue.gltf");
            skyScraperBuild.load(data.gltf.scene.children[0].children[0]);
        }
    }
    function treatMaterial(mat) {
        if (mat.map) {
            mat.map.repeat.setY(0.6);
            mat.map.needsUpdate = true;
        }
    }




    Object.defineProperty(this, "group", {
        get: function () { return group },
    })

    // init();
    // function init(){
    //     const meshes = Three3DTool.getObjectsWithType(obj,'isMesh');
    //     for(var index in meshes){
    //         const material = meshes[index].material;
    //         if(!buildMaterials[material.uuid]){
    //             buildMaterials[material.uuid] = material;
    //             material.emissive.copy(material.color);
    //             material.color.set(0.5,0.5,0.5);
    //             material.emissiveMap = material.map;
    //         }
    //     }
    // }
}



export { CityBuildObject }

// function CityBuildObject() {

//     const buildMaterials = {};
//     const group = new Group({ name: "CityBuilds" });
//     this.add = function (son) {
//         const oldMaterial = [];
//         const meshes = Three3DTool.getObjectsWithType(son, "isMesh");
//         meshes.forEach(mesh => {
//             const material = mesh.material;
//             StringTake.removeNameClone(material);
//             const mat = buildMaterials[material.name];
//             // if (material.name === "Building2") {
//             //     mesh.scale.setY(0.9955);
//             //     mesh.updateMatrix();
//             //     mesh.updateMatrixWorld();
//             //     material.color.setRGB(0.15, 0.2317, 0.4474);
//             // }
//             if (mat) {
//                 oldMaterial[material.uuid] = material;
//                 mesh.material = mat;
//             }
//             else {
//                 buildMaterials[material.name] = material;
//                 treatMaterial(material);
//             }
//         });
//         for (var key in oldMaterial) {
//             oldMaterial[key].dispose();
//         }
//         group.add(son);
//     }

//     this.drawGUI = function (folder, index) {
//         const buildFolder = folder.addFolder({ key: "Build", name: "建筑", isOpen: true });
//         for (var key in buildMaterials) {
//             buildFolder.addValue({ uniform: { value: buildMaterials[key] }, key: buildMaterials[key].name });
//         }
//     }

//     function treatMaterial(mat) {
//         if (mat.map) {
//             mat.map.repeat.setY(0.6);
//             mat.map.needsUpdate = true;
//         }
//     }

//     Object.defineProperty(this, "group", {
//         get: function () { return group },
//     })

//     // init();
//     // function init(){
//     //     const meshes = Three3DTool.getObjectsWithType(obj,'isMesh');
//     //     for(var index in meshes){
//     //         const material = meshes[index].material;
//     //         if(!buildMaterials[material.uuid]){
//     //             buildMaterials[material.uuid] = material;
//     //             material.emissive.copy(material.color);
//     //             material.color.set(0.5,0.5,0.5);
//     //             material.emissiveMap = material.map;
//     //         }
//     //     }
//     // }
// }
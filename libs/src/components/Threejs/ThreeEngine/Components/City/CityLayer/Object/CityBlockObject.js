import { Group } from "three";
import { UnityGLTFLoader } from "../../../Loader/UnityLoader";

function CityBlockObject(build, segment) {
    let cityArr;
    let segmentArr;
    let group = new Group();

    

    this.drawGUI = function(folder){
        if(!cityArr||!segmentArr) return;
        const cityFolder = folder.addFolder({key:"CityBlock",name:"区域设置",isOpen:true});
        for (var key in cityArr) {
            cityArr[key].drawGUI(cityFolder,key);
        }
        for (var key in segmentArr) {
            segmentArr[key].drawGUI(cityFolder,key);
        }
    }
    Object.defineProperty(this, "group", {
        get: function () { return group },
    })
}


export { CityBlockObject };
import { ColorRGBType } from "../../ColorType/ColorRGB";
import { folderType } from "../../OthreType";
import { NumberType } from "../../ValueType/NumberType";

function AmbientLightType(data) {
    const obj = data.uniform.value;
    const info = data.info;
    const key = data.key;
    const sonNode = {};
    const guiItems = {};
    let folderNode;
    const nodeItem = {};
    const nodeGUI = {};
    initSon();
    function initSon() {
        folderNode = new folderType({ key, name: data.name });
        const colorData = new ColorRGBType({ uniform: { value: obj.color }, key: "color", name: "颜色", isShowVector: true });
        sonNode['color'] = colorData;

        const intensityData = new NumberType({ uniform: { value: obj.intensity }, key: "intensity", name: "强度", info: { isSlider: true, max: 2 }, onChange: (val) => { obj.intensity = val } });
        sonNode["intensity"] = intensityData;


    }
    this.updateGUI = function () {
        for (var key in sonNode) {
            sonNode[key].updateGUI();
        }
        onValueFinish();
    }

    this.drawGUI = function (folder, style) {
        style = data.style || style || {};
        folder = folderNode.drawGUI(folder, style);
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder, style);
        }
        return guiItems;
    }
    function onValueChange(value) {
        if (data['onChange']) {
            data['onChange']();
        }
    }
    function onValueFinish(value) {
        if (data['onFinish']) {
            data['onFinish']();
        }

    }

    this.getData = function () {
        const data = {};
        for (var key in sonNode) {
            data[key] = sonNode[key].getData();
        }
        return data;
    }
    this.setData = function (data) {
        if (!data) return;
        for (var key in data) {
            if (sonNode[key]) {
                sonNode[key].setData(data[key]);
            }
        }
    }
}



export { AmbientLightType };
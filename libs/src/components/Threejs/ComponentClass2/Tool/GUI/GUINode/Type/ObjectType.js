import { Color } from 'three';
import { numberType } from './ValueType';
import { colorStyle } from '../Style';
import CustomStyle from './CustomStyle';
import { Vector3Type } from './VectorType';
import { folderType, funcType } from './OtherType';


function object3DType(data) {
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

        folderNode = new folderType({ displayName: "Tranform", isOpen: data.isOpen });

        const positionData =
        {
            uniform: { value: obj.position },
            key: key + "(position)",
            infos: [
                { displayName: "位置X" },
                { displayName: "位置Y" },
                { displayName: "位置Z" },
            ],
            style: CustomStyle.red,
            onChange: onValueChange,
            onFinish: onValueFinish,
        }
        const rotationPtoU = (p) => {
            return p / 180 * Math.PI;
        }
        const rotationUtoP = (u) => {
            return u * 180 / Math.PI;
        }
        const rotationData =
        {
            uniform: { value: obj.rotation },
            key: key + "(rotation)",
            infos: [
                { displayName: "旋转X", PtoU: rotationPtoU, UtoP: rotationUtoP },
                { displayName: "旋转Y", PtoU: rotationPtoU, UtoP: rotationUtoP },
                { displayName: "旋转Z", PtoU: rotationPtoU, UtoP: rotationUtoP },
            ],
            style: CustomStyle.green,
            onChange: onValueChange,
            onFinish: onValueFinish,
        }
        // const rotationData=
        // {
        //     uniform:{value:obj.rotation},
        //     key:key+"(rotation)",
        //     infos:[
        //         {displayName:"旋转X"},
        //         {displayName:"旋转Y"},
        //         {displayName:"旋转Z"},
        //     ],
        //     style:CustomStyle.green,
        //     onChange:onValueChange,
        //     onFinish:onValueFinish,
        // }
        const scaleData =
        {
            uniform: { value: obj.scale },
            key: key + "(rotation)",
            infos: [
                { displayName: "缩放X" },
                { displayName: "缩放Y" },
                { displayName: "缩放Z" },
            ],
            style: CustomStyle.blue,
            onChange: onValueChange,
            onFinish: onValueFinish,
        }
        sonNode['position'] = new Vector3Type(positionData);
        sonNode['rotation'] = new Vector3Type(rotationData);
        sonNode['scale'] = new Vector3Type(scaleData);

    }
    this.updateGUI = function () {
        for (var key in sonNode) {
            sonNode[key].updateGUI();
        }
    }

    this.drawGUI = function (folder) {
        folder = folderNode.drawGUI(folder);
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder);
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
}

function perspectiveCameraType(data) {
    const obj = data.uniform.value;
    const info = data.info;
    const key = data.key;
    const sonNode = {};
    const guiItems = {};
    let folderNode;
    const nodeItem = {};
    const nodeGUI = {};

    initSon();

    this.updateGUI = function () {
        for (var key in sonNode) {
            sonNode[key].updateGUI();
        }
    }
    const updateGUI = this.updateGUI;

    function initSon() {
        folderNode = new folderType({ displayName: "Camera", isOpen: data.isOpen });
        const objData =
        {
            uniform: { value: obj },
            key: key + "(Obj)",
            onChange: onValueChange,
            onFinish: onValueFinish,
        }
        sonNode['obj'] = new object3DType(objData);

        const fovData = { uniform: { value: obj }, key: "Fov", onChange: () => { obj.updateProjectionMatrix() }, info: { displayName: "FOV", min: 0, max: 90, isSlider: true, delta: 0.001 } };
        sonNode['fov'] = new numberType(fovData, 'fov');

        sonNode['refresh'] = new funcType({ uniform: { value: () => { updateGUI() } }, key: "刷新", info: { displayName: "刷新" } });
        // console.log(obj);
        // const guiItem = gui.addValue({
        //     uniform:{value:meshBox},key:"mesh",type:'obj',
        //     info:{displayName:"Mesh"},
        //   })

    }


    this.drawGUI = function (folder) {
        folder = folderNode.drawGUI(folder);
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder);
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
}
export { object3DType, perspectiveCameraType }
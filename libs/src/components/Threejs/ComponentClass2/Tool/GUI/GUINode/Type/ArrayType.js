import { Color } from 'three';
import { numberType } from './ValueType';
import { colorStyle } from '../Style';
import CustomStyle from './CustomStyle';
import { Vector3Type } from './VectorType';
import { folderType, funcType } from './OtherType';

function arrayType(data) {
    const obj = data.uniform.value;
    const info = data.info;
    const key = data.key || data.displayName;
    const folderName = data.displayName || data.key;
    const sonNode = {};
    const guiItems = {};

    let folderNode;
    const nodeItem = {};
    const nodeGUI = {};
    initSon();

    function initSon() {
        if (obj.length == 0) return;
        const vt = typeof (obj[0]);
        for (var key in obj) {
            if (typeof (obj[key]) !== vt) {
                console.log("数组的数据类型不统一:", obj);
                return;
            }
        }
        folderNode = new folderType({ displayName: data.displayName, isOpen: data.isOpen });

        // console.log(obj);
        if (vt === 'number') {
            for (var key in obj) {
                const index = key;
                const itemData = { uniform: { value: obj[key] }, key: key + `第${key}个`, info: { displayName: `第${key}个`, ...info }, onChange: (value) => { obj[index] = value } };
                sonNode[itemData.key] = new numberType(itemData);
            }
        }

        // const positionData=
        // {
        //     uniform:{value:obj.position},
        //     key:key+"(position)",
        //     infos:[
        //         {displayName:"位置X"},
        //         {displayName:"位置Y"},
        //         {displayName:"位置Z"},
        //     ],
        //     style:CustomStyle.red,
        //     onChange:onValueChange,
        //     onFinish:onValueFinish,
        // }
        // const rotationPtoU = (p)=>
        // {
        //     return p/180*Math.PI;
        // }
        // const rotationUtoP = (u)=>
        // {
        //     return u*180/Math.PI;
        // }
        // const rotationData=
        // {
        //     uniform:{value:obj.rotation},
        //     key:key+"(rotation)",
        //     infos:[
        //         {displayName:"旋转X",PtoU:rotationPtoU,UtoP:rotationUtoP},
        //         {displayName:"旋转Y",PtoU:rotationPtoU,UtoP:rotationUtoP},
        //         {displayName:"旋转Z",PtoU:rotationPtoU,UtoP:rotationUtoP},
        //     ],
        //     style:CustomStyle.green,
        //     onChange:onValueChange,
        //     onFinish:onValueFinish,
        // }
        // // const rotationData=
        // // {
        // //     uniform:{value:obj.rotation},
        // //     key:key+"(rotation)",
        // //     infos:[
        // //         {displayName:"旋转X"},
        // //         {displayName:"旋转Y"},
        // //         {displayName:"旋转Z"},
        // //     ],
        // //     style:CustomStyle.green,
        // //     onChange:onValueChange,
        // //     onFinish:onValueFinish,
        // // }
        // const scaleData=
        // {
        //     uniform:{value:obj.scale},
        //     key:key+"(rotation)",
        //     infos:[
        //         {displayName:"缩放X"},
        //         {displayName:"缩放Y"},
        //         {displayName:"缩放Z"},
        //     ],
        //     style:CustomStyle.blue,
        //     onChange:onValueChange,
        //     onFinish:onValueFinish,
        // }
        // sonNode['position'] = new Vector3Type(positionData);
        // sonNode['rotation'] = new Vector3Type(rotationData);
        // sonNode['scale'] = new Vector3Type(scaleData);

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

export { arrayType };
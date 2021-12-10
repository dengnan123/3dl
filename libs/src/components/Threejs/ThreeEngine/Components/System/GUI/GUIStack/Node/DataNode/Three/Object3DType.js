import { folderType } from "../OthreType";
import CustomStyle from "../../CustomStyle";
import { Vector3Type } from "../VectorType/Vector3Type";

function Object3DType(data){
    const obj = data.uniform.value;
    const info = data.info;
    const key = data.key;
    const sonNode = {};
    const guiItems = {};
    let folderNode;
    const nodeItem = {};
    const nodeGUI = {};
    initSon();
    function initSon()
    {
        
        folderNode = new folderType({name:"Tranform",isOpen:data.isOpen});

        const positionData=
        {
            uniform:{value:obj.position},
            key:key+"(position)",
            infos:[
                {name:"位置X"},
                {name:"位置Y"},
                {name:"位置Z"},
            ],
            style:CustomStyle.red,
            onChange:onValueChange,
            onFinish:onValueFinish,
        }
        const rotationPtoU = (p)=>
        {
            return p/180*Math.PI;
        }
        const rotationUtoP = (u)=>
        {
            return u*180/Math.PI;
        }
        const rotationData=
        {
            uniform:{value:obj.rotation},
            key:key+"(rotation)",
            infos:[
                {name:"旋转X",PtoU:rotationPtoU,UtoP:rotationUtoP},
                {name:"旋转Y",PtoU:rotationPtoU,UtoP:rotationUtoP},
                {name:"旋转Z",PtoU:rotationPtoU,UtoP:rotationUtoP},
            ],
            style:CustomStyle.green,
            onChange:onValueChange,
            onFinish:onValueFinish,
        }
        const scaleData=
        {
            uniform:{value:obj.scale},
            key:key+"(rotation)",
            infos:[
                {name:"缩放X"},
                {name:"缩放Y"},
                {name:"缩放Z"},
            ],
            style:CustomStyle.blue,
            onChange:onValueChange,
            onFinish:onValueFinish,
        }
        sonNode['position'] = new Vector3Type(positionData);
        sonNode['rotation'] = new Vector3Type(rotationData);
        sonNode['scale'] = new Vector3Type(scaleData);

    }
    this.updateGUI = function()
    {
        for(var key in sonNode)
        {
            sonNode[key].updateGUI();
        }
        onValueFinish();
    }

    this.drawGUI = function(folder,style)
    {
        style = data.style||style||{};
        folder = folderNode.drawGUI(folder,style);
        for(var key in sonNode)
        {
            guiItems[key] = sonNode[key].drawGUI(folder,style);
        }
        return guiItems;
    }
    function onValueChange(value)
    {
        if(data['onChange'])
        {
            data['onChange']();
        }
    }
    function onValueFinish(value)
    {
        if(data['onFinish'])
        {
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


export {Object3DType};
import { Vector3 } from "three";
import { Vector3Type } from "../VectorType/Vector3Type";
import { colorStyle } from "./Color3Type";

function ColorRGBType(data)
{
    const info = data.info||{};
    const uniform = data.uniform;
    const params = {hex:null,v3:new Vector3()};

    const name = info.name||data.key;
    const isShowVector = data.isShowVector||false;
    let guiItem = null;
    let v3Node = null;
    let v3GUIItem = null;
    // console.log(uniform);

    UtoP();
    UtoPV3();
    initV3();
    

    function UtoP()
    {
        params['hex'] =uniform.value.getHex();

    }
    function PtoU()
    {
        uniform.value.setHex(params['hex']);

    }

    function UtoPV3(){
        params['v3'].set(uniform.value.r,uniform.value.g,uniform.value.b);
    }
    function PtoUV3(){
        uniform.value.r = params.v3.x;
        uniform.value.g = params.v3.y;
        uniform.value.b = params.v3.z;
    }
    

    
    
    this.updateGUI = function()
    {
        UtoP();
        UtoPV3();
        guiItem&&guiItem.updateDisplay();
        v3Node&&v3Node.updateGUI();
        onValueChange(uniform);
    }
    this.getData=function(){
        return [uniform.value.r,
        uniform.value.g,
        uniform.value.b];
    }
    this.setData=function(data){
        uniform.value.r = data[0];
        uniform.value.g = data[1];
        uniform.value.b = data[2];
        this.updateGUI();
    }
    function onValueChange(value)
    {
        PtoU();
        UtoPV3();
        if(data['onChange'])
        {
            data['onChange'](uniform.value);
        }
        v3Node&&v3Node.updateGUI();
    }
    function onValueFinish(value)
    {
        // console.log(value);
        PtoU();
        UtoPV3();
        if(data['onFinish'])
        {
            data['onFinish'](uniform.value);
        }
        v3Node&&v3Node.updateGUI();
    }
    function onValueChangeV3(value)
    {
        PtoUV3();
        UtoP();
        if(data['onChange'])
        {
            data['onChange'](uniform.value);
        }
        guiItem&&guiItem.updateDisplay();
    }
    function onValueFinishV3(value)
    {
        PtoUV3();
        UtoP();
        if(data['onFinish'])
        {
            data['onFinish'](uniform.value);
        }
        guiItem&&guiItem.updateDisplay();
    }
    function initV3()
    {
        if(!isShowVector)return;
        
        const rgbData=
        {
            uniform:{value:params.v3},
            key:data.key,
            infos:[
                {name:"R(0-1)",isSlider:true,delta:0.0001},
                {name:"G(0-1)",isSlider:true,delta:0.0001},
                {name:"B(0-1)",isSlider:true,delta:0.0001},
            ],
            headName:`${data.key}_RGB`,

            onChange:onValueChangeV3,
            onFinish:onValueFinishV3,
        }
        v3Node = new Vector3Type(rgbData);
    }
    this.drawGUI = function(folder,style)
    {
        // console.log(params);
        // console.log("Color已经绘制");

        guiItem = folder.addColor(params,'hex').name(name).onChange(onValueChange).onFinishChange(onValueFinish);
        colorStyle(guiItem,style);
        if(isShowVector)
        {
            v3GUIItem = v3Node.drawGUI(folder,style);
        }
        
        
        return guiItem;
    }
    
}
export {ColorRGBType};
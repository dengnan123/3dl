import { ColorRGBType } from "../../ColorType/ColorRGB";
import { folderType } from "../../OthreType";
import { BooleanType } from "../../ValueType/BooleanType";
import { NumberType } from "../../ValueType/NumberType";


function MeshStandardMaterialType(data){
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
        folderNode = new folderType({key,name:data.name});
        const colorData = new ColorRGBType({uniform:{value:obj.color},key:"color",name:"颜色",isShowVector:true});
        sonNode['color'] = colorData;

        const emissiveData = new ColorRGBType({uniform:{value:obj.emissive},key:"emissive",name:"发光色",isShowVector:true});
        sonNode['emissive'] = emissiveData;
        const emissiveIntensityData = new NumberType({uniform:{value:obj.emissiveIntensity},key:"emissiveIntensity",name:"发光强度",info:{isSlider:true,max:10},onChange:(val)=>{obj.emissiveIntensity = val}});
        sonNode["emissiveIntensity"] = emissiveIntensityData;
        
        const metalnessData = new NumberType({uniform:{value:obj.metalness},key:"metalness",name:"金属度",info:{isSlider:true,max:10},onChange:(val)=>{obj.metalness = val}});
        const roughnessData = new NumberType({uniform:{value:obj.roughness},key:"roughness",name:"粗糙度",info:{isSlider:true,max:10},onChange:(val)=>{obj.roughness = val}});
        sonNode['metalness'] = metalnessData;
        sonNode['roughness'] = roughnessData;

        
        const transparentData = new BooleanType({uniform:{value:obj.transparent},key:"transparent",name:"是否透明",onChange:(val)=>{obj.transparent = val}});
        sonNode['transparent'] = transparentData;
        const opacityData = new NumberType({uniform:{value:obj.opacity},key:"opacity",name:"透明度",info:{isSlider:true},onChange:(val)=>{obj.opacity = val}});
        sonNode['opacity'] = opacityData;
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
        folder = folderNode.drawGUI(folder);
        style = data.style||style||{};
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

    this.getData=function(){
        return [];
    }
    this.setData=function(data){
    }
}


export {MeshStandardMaterialType};
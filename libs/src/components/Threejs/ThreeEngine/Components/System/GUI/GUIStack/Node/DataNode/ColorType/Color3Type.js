import { Color } from "three";
import { Vector3Type } from "../VectorType/Vector3Type";

function Color3Type(data)
{
    const info = data.info||{};
    const uniform = data.uniform;
    const params = {hex:null};
    const name = info.name||data.key;
    const isShowVector = data.isShowVector||false;
    let guiItem = null;
    let v3Node = null;
    let v3GUIItem = null;
    initV3();

    const UtoP = ()=>
    {
        params['color'] = new Color(uniform.value.x,uniform.value.y,uniform.value.z);
        params['hex'] =params['color'].getHex();
    }
    const PtoU = ()=>
    {
        params['color'].setHex(params['hex']);
        const col = params['color'];
        uniform.value.set(col.r,col.g,col.b);
    }
    

  
    UtoP();
    this.updateGUI = function()
    {
        UtoP();
        // console.log(guiItem);
        guiItem&&guiItem.updateDisplay();
        v3Node&&v3Node.updateGUI();
        onValueChange(uniform.value);
    }
    this.getData=function(){
        return [uniform.value.x,
        uniform.value.y,
        uniform.value.z];
    }
    this.setData=function(data){
        uniform.value.x = data[0];
        uniform.value.y = data[1];
        uniform.value.z = data[2];
        this.updateGUI();
    }
    function onValueChange(value)
    {
        // console.log(value);
        PtoU();
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
        if(data['onFinish'])
        {
            data['onFinish'](uniform.value);
        }
        v3Node&&v3Node.updateGUI();
    }
    function onValueChangeV3(value)
    {

        UtoP();
        if(data['onChange'])
        {
            data['onChange'](uniform.value);
        }
        guiItem.updateDisplay();
    }
    function onValueFinishV3(value)
    {

        if(data['onFinish'])
        {
            data['onFinish'](uniform.value);
        }
        guiItem.updateDisplay();
    }
    function initV3()
    {
        if(!isShowVector)return;
        const rgbData=
        {
            uniform:uniform,
            key:data.key,
            infos:[
                {name:"R(0-1)",isSlider:true,delta:0.0001},
                {name:"G(0-1)",isSlider:true,delta:0.0001},
                {name:"B(0-1)",isSlider:true,delta:0.0001},
            ],
            headName:name,
            onChange:onValueChangeV3,
            onFinish:onValueFinishV3,
        }
        v3Node = new Vector3Type(rgbData);
    }
    this.drawGUI = function(folder,style)
    {
        // console.log(params);

        guiItem = folder.addColor(params,'hex').name(name).onChange(onValueChange).onFinishChange(onValueFinish);
        colorStyle(guiItem,style);
        if(isShowVector)
        {
            v3GUIItem = v3Node.drawGUI(folder,style);
        }
        
        
        return guiItem;
    }
    
}

function colorStyle(item,style)
{
    const inputStyle = item.domElement.querySelector('div > input[type="text"]').style;
    inputStyle.height = '20px';
    if(JSON.stringify(style)=='{}')return;
    // if(style.padding){
    //     // console.log(item.__li.style);
    //     item.__li.style.marginLeft = `${style.padding}px`;
    // }
    if(style.fontColor)
    {
        item.__li.style.color = style.fontColor;
        item.__li.style.textShadow = "none";
        item.__li.style.borderLeftColor = style.fontColor;
    }
    if(style.backColor)
    {
        item.__li.style.backgroundColor = style.backColor;
    }
}

export {Color3Type,colorStyle}
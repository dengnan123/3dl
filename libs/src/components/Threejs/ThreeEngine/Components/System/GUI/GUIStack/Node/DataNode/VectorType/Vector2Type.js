import { Color } from "three";
import { NumberType } from "../ValueType/NumberType";
import {folderStyle} from "../OthreType";
function Vector2Type(data)
{

    const infos = data.infos||[];
    if(infos.length<2)
    {
        console.log("Infos数目不够");
        throw "111";
    }
    const headName = data.headName;
    const uniform = data.uniform;
    const sonNode = {};
    const guiItems = {};
    this.updateGUI = function()
    {
        for(var key in sonNode)
        {
            // console.log(key,sonNode[key]);
            sonNode[key].updateGUI();
        }
        onSonChange(uniform);
    }
    this.getData=function(){
        return [infos[0].isPass?undefined:uniform.value.x,
        infos[1].isPass?undefined:uniform.value.y];
    }
    this.setData=function(data){
        data[0]!==undefined&&(uniform.value.x = data[0]);
        data[1]!==undefined&&(uniform.value.y = data[1]);
        this.updateGUI();
    }
    initSon();

    function initSon()
    {
        let index = 0;
        const dataX = {uniform,
            key:infos[index].key||infos[index].name,
            name:infos[index].name,
            info:{
                isBoolean:infos[index].isBoolean,
                isSlider:infos[index].isSlider,
                max:infos[index].max,
                min:infos[index].min,
                delta:infos[index].delta,
                PtoU:infos[index].PtoU,
                UtoP:infos[index].UtoP,
                isPass:infos[index].isPass
            },
            onChange:onSonChange,
            onFinish:onSonFinish,
        }
        index = 1;
        const dataY = {uniform,
            key:infos[index].key||infos[index].name,
            name:infos[index].name,
            info:{
                isBoolean:infos[index].isBoolean,
                isSlider:infos[index].isSlider,
                max:infos[index].max,
                min:infos[index].min,
                delta:infos[index].delta,
                PtoU:infos[index].PtoU,
                UtoP:infos[index].UtoP,
                isPass:infos[index].isPass
            },
            onChange:onSonChange,
            onFinish:onSonFinish,
        }
        sonNode['x'] = new NumberType(dataX,'x');
        sonNode['y'] = new NumberType(dataY,'y');
    }
    function onSonChange(value)
    {
        if(data['onChange'])
        {
            data['onChange'](uniform.value);
        }
    }
    function onSonFinish(value)
    {
        if(data['onFinish'])
        {
            data['onFinish'](uniform.value);
        }
        
    }
    this.drawGUI = function(folder,style)
    {
        if(headName)
        {
            folder = folder.addFolder(headName);
            folderStyle(folder,style);
        }
        for(var key in sonNode)
        {
            guiItems[key] = sonNode[key].drawGUI(folder,style);
        }
        return guiItems;
    }
}


export {Vector2Type}
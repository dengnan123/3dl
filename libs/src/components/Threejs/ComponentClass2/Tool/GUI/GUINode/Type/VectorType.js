import { Color } from 'three';
import { numberType } from './ValueType';

import { colorStyle, folderStyle } from '../Style';

function Vector2Type(data) {
    const infos = data.infos || [];
    if (infos.length != 2) {
        console.log("Infos数目不够");
        throw "111";
    }
    const isNeedHead = data.isNeedHead || false;
    const headName = data.headName || "无Head名";
    const uniform = data.uniform;
    const style = data.style;
    const sonNode = {};
    const guiItems = {};
    this.updateGUI = function () {
        for (var key in sonNode) {
            // console.log(key,sonNode[key]);
            sonNode[key].updateGUI();
        }
    }
    initSon();

    function initSon() {
        let index = 0;
        const dataX = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        sonNode['x'] = new numberType(dataX, 'x');
        index = 1;
        const dataY = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }

        sonNode['y'] = new numberType(dataY, 'y');
    }
    function onSonChange(value) {
        if (data['onChange']) {
            data['onChange'](uniform);
        }
    }
    function onSonFinish(value) {
        if (data['onFinish']) {
            data['onFinish'](uniform);
        }

    }
    this.drawGUI = function (folder) {
        if (isNeedHead) {
            folder = folder.addFolder(headName);
        }
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder);
        }
        return guiItems;
    }
}

function Vector3Type(data) {
    const infos = data.infos || [];
    if (infos.length != 3) {
        console.log("Infos数目不够");
        throw "111";
    }
    const isNeedHead = data.isNeedHead || false;
    const headName = data.headName || "无Head名";
    const uniform = data.uniform;
    const style = data.style || {};
    const sonNode = {};
    const guiItems = {}
    this.updateGUI = function () {
        for (var key in sonNode) {
            // console.log(key,sonNode[key]);
            sonNode[key].updateGUI();
        }
    }
    initSon();

    function initSon() {
        let index = 0;
        const dataX = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                PtoU: infos[index].PtoU,
                UtoP: infos[index].UtoP,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        index = 1;
        const dataY = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                PtoU: infos[index].PtoU,
                UtoP: infos[index].UtoP,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        index = 2;
        const dataZ = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                PtoU: infos[index].PtoU,
                UtoP: infos[index].UtoP,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }


        sonNode['x'] = new numberType(dataX, 'x');
        sonNode['y'] = new numberType(dataY, 'y');
        sonNode['z'] = new numberType(dataZ, 'z');

    }
    function onSonChange(value) {
        if (data['onChange']) {
            data['onChange'](uniform);
        }
    }
    function onSonFinish(value) {
        if (data['onFinish']) {
            data['onFinish'](uniform);
        }

    }
    this.drawGUI = function (folder) {
        if (isNeedHead) {
            console.log(style);
            folder = folder.addFolder(headName);
            folderStyle(folder, style);
        }
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder);
        }
        return guiItems;
    }
}

function Vector4Type(data) {
    const infos = data.infos || [];
    if (infos.length != 4) {
        console.log("Infos数目不够");
        throw "111";
    }
    const isNeedHead = data.isNeedHead || false;
    const headName = data.headName || "无Head名";
    const uniform = data.uniform;
    const style = data.style;
    const sonNode = {};
    const guiItems = {}
    this.updateGUI = function () {
        for (var key in sonNode) {
            // console.log(key,sonNode[key]);
            sonNode[key].updateGUI();
        }
    }
    initSon();

    function initSon() {
        let index = 0;
        const dataX = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        index = 1;
        const dataY = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        index = 2;
        const dataZ = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        index = 3;
        const dataW = {
            uniform,
            key: infos[index].key || infos[index].displayName,
            displayName: infos[index].displayName,
            info: {
                isBoolean: infos[index].isBoolean,
                isSlider: infos[index].isSlider,
                max: infos[index].max,
                min: infos[index].min,
                delta: infos[index].delta,
                isPass: infos[index].isPass
            },
            style,
            onChange: onSonChange,
            onFinish: onSonFinish,
        }
        sonNode['x'] = new numberType(dataX, 'x');
        sonNode['y'] = new numberType(dataY, 'y');
        sonNode['z'] = new numberType(dataZ, 'z');
        sonNode['w'] = new numberType(dataW, 'w');
    }
    function onSonChange(value) {
        if (data['onChange']) {
            data['onChange'](uniform);
        }
    }
    function onSonFinish(value) {
        if (data['onFinish']) {
            data['onFinish'](uniform);
        }

    }
    this.drawGUI = function (folder) {
        if (isNeedHead) {
            folder = folder.addFolder(headName);
        }
        for (var key in sonNode) {
            guiItems[key] = sonNode[key].drawGUI(folder);
        }
        return guiItems;
    }
}

function Color3Type(data) {
    const info = data.info || {};
    const uniform = data.uniform;
    const params = { hex: null };
    const style = data.style || {};
    const displayName = info.displayName || data.key;
    let guiItem = null;

    const UtoP = () => {
        params['color'] = new Color(uniform.value.x, uniform.value.y, uniform.value.z);
        params['hex'] = params['color'].getHex();
    }
    const PtoU = () => {
        params['color'].setHex(params['hex']);
        const col = params['color'];
        uniform.value.set(col.r, col.g, col.b);
    }


    UtoP();
    this.updateGUI = function () {
        UtoP();
        // console.log(guiItem);
        guiItem.updateDisplay();
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](uniform);
        }
    }
    function onValueFinish(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](uniform);
        }

    }
    this.drawGUI = function (folder) {
        // console.log(params);

        guiItem = folder.addColor(params, 'hex').name(displayName).onChange(onValueChange).onFinishChange(onValueFinish);
        colorStyle(guiItem, style);


        return guiItem;
    }
}
function Color4Type(data) {
    const info = data.info || {};
    const isNeedHead = data.isNeedHead || false;
    const headName = data.headName || "无Head名";
    const uniform = data.uniform;
    const params = { hex: null };
    const style = data.style || {};
    const sonNode = {};
    let guiItem = null;

    let alphaNode = null;
    let alphaItem = null;
    const UtoP = () => {
        params['color'] = new Color(uniform.value.x, uniform.value.y, uniform.value.z);
        params['hex'] = params['color'].getHex();
    }
    const PtoU = () => {
        params['color'].setHex(params['hex']);
        const col = params['color'];
        uniform.value.set(col.r, col.g, col.b, uniform.value.w);
    }

    UtoP();
    initAlpha();
    function initAlpha() {
        const dataX = {
            uniform,
            key: data.key + "(Alpha)",
            displayName: (info.displayName || data.key) + "(Alpha)",
            info: {
                isSlider: true,
                max: 1,
                min: 0,
                delta: 0.001
            },
            style,
            onChange: onValueChange,
            onFinish: onValueFinish,
        }
        alphaNode = new numberType(dataX, 'w');
    }
    this.updateGUI = function () {
        UtoP();
        guiItem.updateDisplay();
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](uniform);
        }
    }
    function onValueFinish(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](uniform);
        }

    }
    this.drawGUI = function (folder) {
        console.log(params);

        guiItem = folder.addColor(params, 'hex').name(info['displayName'] || data.key).onChange(onValueChange).onFinishChange(onValueFinish);
        alphaItem = alphaNode.drawGUI(folder);
        colorStyle(guiItem, style);


        return guiItem;
    }
}



export { Vector2Type, Vector3Type, Vector4Type, Color3Type, Color4Type };
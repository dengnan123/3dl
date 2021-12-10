import { numberStyle, sliderStyle, booleanStyle, stringStyle, dropperStyle } from '../Style';
function numberType(data, paramsName, paramsNameU) {
    paramsName = paramsName;
    const info = data['info'] || {};
    const style = data['style'] || {};
    info['displayName'] = info['displayName'] || data.key;
    if (info['isSlider']) {
        info['min'] = info['min'] || 0;
        info['max'] = info['max'] || 1;
        info['delta'] = info['delta'] || 0.01;
    }
    const uniform = data.uniform;
    const params = { value: 0 };
    let UtoP;
    let PtoU;


    this.UtoP = UtoP;
    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
    }

    initPUConvert();
    UtoP();

    this.drawGUI = function (folder) {

        if (info.isPass) {
            console.log("isPass");
            return { updateDisplay: () => { } }
        }
        let item;
        if (info['isBoolean']) {
            item = folder.add(params, 'value').name(info['displayName']).onChange(onValueChange).onFinishChange(onValueFinished);
            booleanStyle(item, style);
        }
        else {
            if (info['isSlider']) {
                item = folder.add(params, 'value').name(info['displayName']).min(info.min).max(info.max).step(info.delta).onChange(onValueChange).onFinishChange(onValueFinished);
                sliderStyle(item, style);
            }
            else {
                item = folder.add(params, 'value').name(info['displayName']).onChange(onValueChange).onFinishChange(onValueFinished);
                numberStyle(item, style);
            }
        }

        this.guiItem = item;
        return item;
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](value);
        }
    }
    function onValueFinished(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](value);
        }
    }
    function initPUConvert() {
        if (info['isBoolean']) {
            if (paramsName) {
                UtoP = () => {
                    const v = uniform.value[paramsName];
                    params.value = v != 0;
                }
            }
            else {
                UtoP = () => {
                    const v = uniform.value;
                    params.value = v != 0;
                }
            }

        }
        else {
            if (paramsName) {
                UtoP = () => {
                    let v = uniform.value[paramsName];
                    if (info.UtoP) {
                        v = info.UtoP(v);
                    }
                    params.value = v;
                }
            }
            else {
                UtoP = () => {
                    let v = uniform.value;
                    if (info.UtoP) {
                        v = info.UtoP(v);
                    }
                    params.value = v;
                }
            }
        }
        if (paramsName) {
            PtoU = () => {
                if (info.PtoU) {
                    uniform.value[paramsName] = info.PtoU(params.value + 0);
                }
                else {
                    uniform.value[paramsName] = params.value + 0;
                }
            }
        }
        else {
            PtoU = () => {
                if (info.PtoU) {
                    uniform.value = info.PtoU(params.value + 0);
                }
                else {
                    uniform.value = params.value + 0;
                }

            }
        }
    }
    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
    }


}

function booleanType(data) {
    const info = data.info || {};
    info['displayName'] = info['displayName'] || data.key;
    const style = data['style'] || {};
    const uniform = data.uniform;
    const params = { value: data.uniform.value };

    const UtoP = () => { params.value = uniform.value };
    const PtoU = () => { uniform.value = params.value };
    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
    }
    this.drawGUI = function (folder) {
        const item = folder.add(params, 'value').name(info['displayName']).
            onChange(onValueChange).onFinishChange(onValueFinished);
        booleanStyle(item, style);
        this.guiItem = item;
        return item;
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](value);
        }
    }
    function onValueFinished(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](value);
        }
    }

}

function stringType(data) {
    const info = data.info || {};
    info['displayName'] = info['displayName'] || data.key;
    const style = data['style'] || {};
    const uniform = data.uniform;
    const params = { value: data.uniform.value };

    const UtoP = () => { params.value = uniform.value };
    const PtoU = () => { uniform.value = params.value };

    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
    }
    this.drawGUI = function (folder) {
        const item = folder.add(params, 'value').name(info['displayName']).
            onChange(onValueChange).onFinishChange(onValueFinished);
        stringStyle(item, style);
        this.guiItem = item;
        return item;
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](value);
        }
    }
    function onValueFinished(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](value);
        }
    }
}

function dropList(data) {
    const info = data.info || {};
    info['displayName'] = info['displayName'] || data.key;
    const style = data['style'] || { optionColor: '#000000' };
    const uniform = data.uniform;
    const params = { value: data.uniform.value };
    const UtoP = () => { params.value = uniform.value };
    const PtoU = () => { uniform.value = params.value };
    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
    }
    this.drawGUI = function (folder) {
        // console.log(info);
        const item = folder.add(params, 'value', info.dropList).name(info['displayName']).
            onChange(onValueChange).onFinishChange(onValueFinished);
        dropperStyle(item, style);
        this.guiItem = item;
        return item;
    }

    function onValueChange(value) {
        PtoU();
        if (data['onChange']) {
            data['onChange'](value);
        }
    }
    function onValueFinished(value) {
        PtoU();
        if (data['onFinish']) {
            data['onFinish'](value);
        }
    }
}

function noneType(data) {
    this.drawGUI = function (folder) {

    }
    this.updateGUI = function () {
    }
}




export { noneType, numberType, booleanType, stringType, dropList };
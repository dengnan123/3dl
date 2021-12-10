function NumberType(data, paramsName, paramsNameU) {
    const info = data['info'] || {};
    const isPass = info.isPass || false;
    info['name'] = info['name'] || data.key;
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
        if (isPass) return;
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
        onValueChange(uniform.value);
    }

    initPUConvert();
    UtoP();

    this.drawGUI = function (folder, style) {
        if (isPass) return { updateDisplay: () => { } };
        let item;
        if (info['isBoolean']) {
            item = folder.add(params, 'value').name(info['name']).onChange(onValueChange).onFinishChange(onValueFinished);
            booleanStyle(item, style);
        }
        else {
            if (info['isSlider']) {
                item = folder.add(params, 'value').name(info['name']).min(info.min).max(info.max).step(info.delta).onChange(onValueChange).onFinishChange(onValueFinished);
                sliderStyle(item, style);
            }
            else {
                item = folder.add(params, 'value').name(info['name']).onChange(onValueChange).onFinishChange(onValueFinished);
                numberStyle(item, style);
            }
        }

        this.guiItem = item;
        return item;
    }
    this.getData = function () {
        return [uniform.value];
    }
    this.setData = function (data) {
        uniform.value = data[0];
        this.updateGUI();
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
                    params.value = v !== 0;
                }
            }
            else {
                UtoP = () => {
                    const v = uniform.value;
                    params.value = v !== 0;
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


}

function numberStyle(item, style) {

    if (JSON.stringify(style) === '{}') return;
    // if(style.padding){
    //     // console.log(item.__li.style);
    //     item.__li.style.marginLeft = `${style.padding}px`;
    // }
    if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
        item.__input.style.color = style.fontColor;
    }
    if (style.inputBackColor) {
        item.__input.style.backgroundColor = style.inputBackColor;
    }
    if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
    }

}

function sliderStyle(item, style) {
    if (JSON.stringify(style) === '{}') return;

    const inputStyle = item.domElement.querySelector('div > input[type="text"]').style;

    if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.textShadow = "none";
        item.__li.style.borderLeftColor = style.fontColor;
        item.__foreground.style.backgroundColor = style.fontColor;
        inputStyle.color = style.fontColor;
    }
    if (style.inputBackColor) {
        item.__background.style.backgroundColor = style.inputBackColor;
        inputStyle.backgroundColor = style.inputBackColor;
    }
    if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
    }
}

function booleanStyle(item, style) {
    if (JSON.stringify(style) === '{}') return;


    const toggler = item.domElement.querySelector(`input[type = "checkbox"]`).style;
    toggler.color = `#FF0000`;
    toggler.backgroundColor = '#00FF00';

    if (style.fontColor) {
        item.__li.style.color = style.fontColor;
        item.__li.style.borderLeftColor = style.fontColor;
    }
    if (style.backColor) {
        item.__li.style.backgroundColor = style.backColor;
    }
}

export { NumberType }
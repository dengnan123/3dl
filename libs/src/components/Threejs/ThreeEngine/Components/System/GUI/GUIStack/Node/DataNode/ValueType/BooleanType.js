function BooleanType(data) {

    const info = data.info || {};
    info['name'] = info['name'] || data.key;
    const uniform = data.uniform;
    const params = { value: data.uniform.value };

    const UtoP = () => { params.value = uniform.value };
    const PtoU = () => { uniform.value = params.value };
    this.guiItem = null;
    this.updateGUI = function () {
        UtoP();
        if (this.guiItem) this.guiItem.updateDisplay();
        onValueChange(uniform.value);
    }
    this.drawGUI = function (folder, style) {
        const item = folder.add(params, 'value').name(info['name']).onChange(onValueChange).onFinishChange(onValueFinished);
        booleanStyle(item, style);
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

export { BooleanType }
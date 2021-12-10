import { getTypeofObj, UniformType } from "./UniformType";

function UniformNode(data){
    const key = data.key;
    const order = data.order||0;
    const index = data.index||0;
    const uniform = data.uniform;
    const type = (uniform&&uniform.value!==undefined)?getTypeofObj(data.uniform):"none";
    const node = new UniformType[type](data);
    const style = data.style;
    let guiItem;
    this.drawGUI = function(folder,parentStyle){
        const st = style||parentStyle||{};
        guiItem = node.drawGUI(folder,st);
    }

    this.getData = function(){
        return node.getData();
    }
    this.setData = function(d){
        return node.setData(d);
    }
    this.updateGUI = function(){
        node.updateGUI();
    }

    Object.defineProperty(this, "key", {
        get: function () { return key },
    })
    Object.defineProperty(this, "order", {
        get: function () { return order },
    })
    Object.defineProperty(this, "index", {
        get: function () { return index },
    })
}

export{UniformNode}
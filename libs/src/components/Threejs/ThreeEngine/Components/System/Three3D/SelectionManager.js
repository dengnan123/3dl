function SelectionManager(eventComp,{gui}){
    let _selection;
    let _drawObj;
    // console.log(gui);
    this.setSelection = function(root,drawObj,isInverse){
        if(!root||(isInverse&&root===_selection)){
            gui.isDrawSystem = true;
            if(_selection){
                gui.clearMain();
                gui.draw();
            }
            _selection = null;
            return;
        }
        if(_selection ===root)return;
        
        _selection = root;
        _drawObj = drawObj;
        console.log(`选择了${_selection.name}`)
        gui.isDrawSystem = false;
        gui.clearMain();
        // console.log(drawObj)
        console.dir(drawObj);
        console.log(Object.keys(drawObj))
        console.dir(drawObj['drawGUI']);

        if(drawObj&&drawObj.drawGUI)
        {

            drawObj.drawGUI(gui);
        }


        gui.draw();
    }
    Object.defineProperty(this, "Selection", {
        get: function () { return _selection },
    })
}


export{SelectionManager}
import { cityLayer } from "../../CityInfo"

function EditorLayerClickEvent(three3D){
    let _targetObjects = undefined;
    let selectTarget = [];


    let upAnimate;
    let downAnimate;

    this.onClick = function(raycaster){
        setLayer(raycaster.layers);
        // console.log("Editor Click")

        const ios = raycaster.intersectObject(_targetObjects,true);
        if(ios.length>0){
            const io = ios[0];
            const {point,distance,object} = io;
            const obj = object.layerObj;
            if(obj){
                three3D.selection.setSelection(object.layerRoot,obj);
            }
            

        }
        else{
            three3D.selection.setSelection(undefined);

        }

    }
    
    function setLayer(layers){
        layers.disableAll();
        for(var key in cityLayer){
            layers.enable(cityLayer[key]);
        }
    }

    Object.defineProperty(this,"targetObjects",{
        get:function(){return _targetObjects},
        set:function(val){
            _targetObjects = val;
            },
    })
}


export{EditorLayerClickEvent}
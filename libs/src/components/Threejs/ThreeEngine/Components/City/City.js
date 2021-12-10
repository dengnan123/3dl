import { BuildLayerClickEvent } from "./CityLayer/ClickEvent/BuildLayerClickEvent";
import { EditorLayerClickEvent } from "./CityLayer/ClickEvent/EditorLayerClickEvent";


const layerClickEvent = {
    'build':BuildLayerClickEvent,
    'editor':EditorLayerClickEvent
}


export {layerClickEvent};
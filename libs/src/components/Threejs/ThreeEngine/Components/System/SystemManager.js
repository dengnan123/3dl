import { Tree } from "antd";
import { AnimateManager } from "./Event/Animate";
import { ClickEvent } from "./Event/ClickEvent";
import { ScreenSizeManager } from "./Event/ScreenSizeManager"
import { Three3D } from "./Three3D";
import systemJson from "./Config.json";

function InitComponentSystem(infos, data) {

    // console.log(infos)

    const animate = new AnimateManager();
    const screenSize = new ScreenSizeManager(infos.screenSize, infos.screenScale);
    const eventComp = { animate, screenSize };
    const clickEvent = new ClickEvent(eventComp);
    eventComp['clickEvent'] = clickEvent;

    const three3D = new Three3D(eventComp, infos);

    const { camera, renderer, container } = three3D.obj;
    //clickEvent
    clickEvent.setContainer(renderer.domElement);
    clickEvent.setCamera(camera);

    if (JSON.stringify(data) != '{}') {
        three3D.gui.setSystemData(data);
    }
    else {
        three3D.gui.setSystemData(systemJson);
    }

    return { eventComponent: eventComp, three3D };
}

export { InitComponentSystem };
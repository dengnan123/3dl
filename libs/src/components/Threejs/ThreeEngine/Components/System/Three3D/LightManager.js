import { AmbientLight, DirectionalLight, Group } from "three";
import CustomStyle from "../GUI/GUIStack/Node/CustomStyle";

var LightManager = function ({ animate, screenSize }, scene, gui) {
    let _lightGroup;
    let _directionalLight;
    let _ambientLight;

    init();

    drawGUI();
    function init() {
        _lightGroup = new Group();
        _lightGroup.name = "Lighting";
        scene.add(_lightGroup);
        //初始化主灯
        _directionalLight = new DirectionalLight(0x444444);
        _directionalLight.position.set(1, 1, 1);
        _lightGroup.add(_directionalLight);
        //初始化环境灯
        _ambientLight = new AmbientLight(0x666666, 0.5);
        _lightGroup.add(_ambientLight);

    }

    function drawGUI() {
        var folder = gui.addSystemFolder({ key: "Light", name: "灯光", order: 1, style: CustomStyle.red });
        folder.addValue({ uniform: { value: _directionalLight }, key: "DirLight", name: "平行光" });
        folder.addValue({ uniform: { value: _ambientLight }, key: "anbiLight", name: "环境光" });
    }

}


export { LightManager };
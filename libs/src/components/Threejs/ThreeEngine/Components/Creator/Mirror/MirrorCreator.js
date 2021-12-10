
import CustomStyle from "../../System/GUI/GUIStack/Node/CustomStyle";
import { ReflectorFade } from "./ReflectFade";
var createMirror = function (geometry, screenSize, color = 0x889999, clipBias = 0.003) {

    // const reflector = new Reflector(geometry,
    //     {
    //         clipBias,
    //         textureWidth:screenSize.x*window.devicePixelRatio,
    //         textureHeight:screenSize.y*window.devicePixelRatio,
    //         color
    //     });
    const reflector = new ReflectorFade(geometry,
        {
            clipBias,
            textureWidth: screenSize.x * window.devicePixelRatio / 2,
            textureHeight: screenSize.y * window.devicePixelRatio / 2,
            color
        });
    return {
        geometry,
        mesh: reflector,
        drawGUI: function (guiFunc) {
            const folder = guiFunc({ key: "Mirror", name: "镜面", order: 2, style: CustomStyle.red });
            folder.addValue({ uniform: this.mesh.material.uniforms.farFade, key: "farFade", info: { isSlider: true, max: 2 } });
        },
        dispose: function () {

        },
        getJSON: function () {

        }
    }
}

export { createMirror };
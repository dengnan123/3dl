import { Scene, Fog, Color as TColor, GridHelper, Group, PlaneBufferGeometry } from 'three';
import { createMirror } from '../../Creator/Mirror/MirrorCreator';
import CustomStyle from '../GUI/GUIStack/Node/CustomStyle';

var SceneManager = function ({ animate, screenSize }, gui, grid = null, mirror = {}) {
    let _scene = null;
    let _helperGroup;
    let _grid;
    let _cityGroup;
    let _mirror;

    const uniformDic = {};
    init();
    function init() {
        _scene = new Scene();
        // _scene.background = new TColor(0xcce0ff);
        _scene.background = new TColor(0x000000);

        _scene.fog = new Fog(0x001433, 500, 10000);
        const fogUniforms = {
            fogColor: { type: "c", value: _scene.fog.color },
            fogNear: { type: "f", value: _scene.fog.near },
            fogFar: { type: "f", value: _scene.fog.far }
        };
        uniformDic['fog'] = fogUniforms;
        var fogFolder = gui.addSystemFolder({ key: "fog", name: "雾", style: CustomStyle.red });
        fogFolder.addValue({ uniform: { value: _scene.fog.color }, key: "color", name: "color", isNeedVector: true });
        fogFolder.addValue({ uniform: { value: _scene.fog.near }, key: "near", name: "近", onChange: (val) => { _scene.fog.near = val; fogUniforms.fogNear.value = val; } });
        fogFolder.addValue({ uniform: { value: _scene.fog.far }, key: "far", name: "远", onChange: (val) => { _scene.fog.far = val; fogUniforms.fogFar.value = val; } });


        //创建helperGroup
        _helperGroup = new Group();
        _helperGroup.name = "Helper";
        _scene.add(_helperGroup);
        if (grid) {
            _grid = new GridHelper(1000, 10);
            _helperGroup.add(_grid)
        }
        if (mirror) {
            const planeGeo = new PlaneBufferGeometry(5000, 5000);
            _mirror = createMirror(planeGeo, screenSize.size);
            _mirror.mesh.rotateX(-Math.PI / 2);
            // _mirror.mesh.positon.set(0, 10, 0);
            _scene.add(_mirror.mesh);
            _mirror.drawGUI(gui.addSystemFolder);
        }
        //_city group
        _cityGroup = new Group();
        _cityGroup.name = "City";
        _cityGroup.matrixAutoUpdate = false;
        _scene.add(_cityGroup);
    }
    Object.defineProperty(this, "scene", {
        get: function () { return _scene },
    })
    Object.defineProperty(this, "group", {
        get: function () { return { city: _cityGroup } },
    })
    Object.defineProperty(this, "fogUniforms", {
        get: function () { return uniformDic.fog },
    })

}

export { SceneManager }

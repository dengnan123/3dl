import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { GUIManager } from '../Tool/GUIManager';
import BasePPS from '../Base/BasePPS';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { GUIInitEllipsePoints, GUIInitScreenNoise } from "../Tool/GUITypeInit";
class ExamplePPS extends BasePPS {
    constructor(props) {
        props.data['domID'] = props.data['domID'] || "WebGL_MultiplePointNoisePPS";
        super(props);
    }
    initMain(data, obj) {
        var gui = obj.gui;
        var mainPass;
        var composer = obj.composer;

        initMainPass();

        function initMainPass() {

        }


    }
    animate(data, obj) {
    }


}
export default ExamplePPS;


// import {Vector2,Vector3, Vector4} from "three";
// import * as THREE from 'three';
// import {ShaderMath} from '../../Tool/ShaderMath';
// var defaultUniform = {
//     "time":{value:new Vector2(0.0,1.0)},
//     "screenSize":{value:new Vector2(50,50)},
// };
// function WaterDropWaveShader(uniforms,data)
// {


//     var shader = {};
//     var uni = uniforms||defaultUniform;
//     data = data||{};
//     var pointsNum = data.pointsCount||uni['points'].value.length;
//     shader['uniforms'] = uni;
//     shader['vertexShader'] = ShaderMath.vertexShader;
//     shader['fragmentShader']=getFragmentShader(pointsNum);
//     return shader;

//     function getFragmentShader(num)
//     {
//         var fs = 
//         [
//             `
//         #include <common>
//         varying vec2 vUv;
//         uniform vec2 time;
//         uniform vec2 screenSize;

//         void main()
//         {
//             float WDH = screenSize.x/screenSize.y;
//             vec3 _col;
//             _col.x = 1.0;
//             gl_FragColor = vec4(_col, 1.0);
//         }
//         `
//         ].join('\n');
//         return fs; 

//     }
// }


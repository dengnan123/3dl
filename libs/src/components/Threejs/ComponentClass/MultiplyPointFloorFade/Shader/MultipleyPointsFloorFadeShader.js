
import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
function MuliplePointsFloorFadeShaderCreator(uniforms, data) {
    var shader = {};
    var uni = uniforms || defaultUniform;
    data = data || {};
    var pointsNum = data.pointsCount || uni['points'].value.length;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader'] = getFragmentShader(pointsNum);
    return shader;
    function getFragmentShader(num) {
        var fs =
            [
                `
                #include <common>
                varying vec2 vUv;
                uniform vec2 time;
                uniform vec2 screenSize;
                uniform vec4 points[${num}];
                uniform vec4 pointsSetting[${num}];
                uniform float globalRScale;
                uniform vec3 floorFadeSetting;
                uniform float floorFadeSpeedT;
                uniform sampler2D gradientTex;
                uniform sampler2D groundTex;
                uniform vec2 hisRange;
                `,
                ShaderMath.lerpFloat,
                ShaderMath.ellipseR,
                ShaderMath.getPointsR(num),
                ShaderMath.floorFade,
                ShaderMath.lerpVec3,
                ShaderMath.historyRange,
                `
                void main()
                {
                    float WDH = screenSize.x/screenSize.y;
                    vec4 vol = getPointsR(points,pointsSetting,globalRScale,WDH);
        
                    float fadeVol = floorFade(vol.w,floorFadeSetting,floorFadeSpeedT)*vol.z;
                    float hr = smoothstep(0.0,1.0,historyRange(hisRange,fadeVol)*vol.z);
                    vec4 graTex = texture2D(gradientTex,vec2(hr,0.5));
                    vec3 groTex = texture2D(groundTex,vUv).xyz;
        
                    vec3 col = lerp(groTex,graTex.xyz,fadeVol*vol.z);
                    gl_FragColor = vec4(col, 1.0);
                    // gl_FragColor = vec4(vol.z,0.0,0.0,1.0);
                }`
            ].join("\n")
        return fs;
    }
}


var defaultUniform =
{
    'time': { value: new Vector2(0.0, 1.0) },
    "screenSize": { value: new Vector2(50, 50) },
    // x y z isDisplay
    "points": {
        value: [
            new Vector4(0.75, 0.86, 0, 1.0),
            new Vector4(0.17, 0.1, 0, 1.0),
        ]
    },
    // a b angle 
    "pointsSetting": {
        value: [
            new Vector4(0.37, 1.189, 0, 0),
            new Vector4(0.32, 1.021, 0, 0),
        ]
    },
    'globalRScale': { value: 1.0 },


    'floorFadeSetting': { value: new Vector3(12.0, 0.8, 0.01) },
    'floorFadeSpeedT': { value: 0 },
    'hisRange': { value: new Vector2(0.8, 0.2) },
    'gradientTex': { value: null },
    'groundTex': { value: null },
};


var mark =
    `
// var MultipleyPointsFloorFadeShader= 
// {
    

//     vertexShader:
//     [
//         "varying vec2 vUv;",
// 		"void main()",
//         "{",
//         "	vUv = uv;",
//         "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
// 		"}"
//     ].join("\n"),

//     fragmentShader:
    
// };
// uniforms:
// {
//     'time':{value:new Vector2(0.0,1.0)},
//     "WDH":{value:1.0},

//     // x y z isDisplay
//     "points":{value:[
//         new Vector4(0.75  ,0.86 ,0  ,1.0),
//         new Vector4(0.17,0.1 ,0  ,1.0),
//         new Vector4(0.5,-0.19 ,0  ,0.0),
//         new Vector4(0.5,0.5,0,0.0),
//         new Vector4(0,0,0,0)
//     ]},
//     // a b angle 
//     "pointsSetting":{value:[
//         new Vector4(0.37,1.189,0,0),
//         new Vector4(0.32,1.021,0,0),
//         new Vector4(0.5,1.4,0,0),
//         new Vector4(0.15,1.0,0,0),
//         new Vector4(0,1.0,0,0)
//     ]},
//     'globalRScale':{value:1.0},


//     'floorFadeSetting':{value:new Vector3(12.0,0.8,0.01)},
//     'hisRange':{value:new Vector2(0.8,0.2)},
//     'gradientTex':{value:null},
//     'groundTex':{value:null},
// },
`

export { MuliplePointsFloorFadeShaderCreator };

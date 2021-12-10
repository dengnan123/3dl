import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';

function MultiplyLevelFlowShader(uniforms, data) {
    var shader = {};
    var uni = uniforms || defaultUniforms;
    data = data || {};
    var pointsNum = data.levelCount || uni['levelSetting'].value.length;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader'] = getFragmentShader(pointsNum);
    return shader;
    function getFragmentShader(num) {
        var fs = [

            "#include <common>",
            "varying vec2 vUv;",
            "uniform vec2 screenSize;",
            `
            uniform vec2 time;
            uniform sampler2D heightTex;
            uniform sampler2D gradientTex;
            uniform sampler2D normalTex1;
            uniform sampler2D normalTex2;
            uniform sampler2D waterTex;

            `,
            ShaderMath.lerpVec2,
            ShaderMath.levelsFlowNormal2(num),
            ShaderMath.historyRange,
            `
            uniform vec3 uvSetting;
            uniform vec4 levelSetting[${num}];
            uniform vec4 levelUVSetting[${num}];
            uniform vec4 normalSetting;
            uniform float normalSettingT;
            
            uniform vec2 uvSmoothStepRange;
            uniform float stepFadeWidth;
            void main()
            {

                vec3 _col = vec3(0.0,0.0,0.0);
                // vec2 uv = vUv*uvSetting.z+uvSetting.xy;
                vec2 uv = vUv;
                float dis = stepFadeWidth*uvSmoothStepRange.y*2.0;
                float cPosition;
                for(int i = 0;i<${num};i++)
                {
                    vec2 uvi = levelsFlowNormal2(vUv,normalSetting,levelSetting[i].zw,levelUVSetting[i],normalTex1,normalTex2,normalSettingT);
                    uvi = uvi+uv;
                    float h = texture2D(heightTex,uvi).r;
                    float v = smoothstep(uvSmoothStepRange.x,uvSmoothStepRange.x+uvSmoothStepRange.y,h);
                    _col.x = v;
                    float w = texture2D(waterTex,uvi).r;

                    float cp = smoothstep(levelSetting[i].x-dis,levelSetting[i].x,v)*levelSetting[i].y;
                    cPosition = max(cPosition,cp);
                }
                _col = texture2D(gradientTex,vec2(cPosition,0.5)).xyz;
                gl_FragColor = vec4(_col, 1.0);

                // //step1
                // float w1 = texture2D(waterTex,uv+normal1).r;
                // float v1 = smoothstep(step3.x-dis,step3.x,v)*stepColor3.x*w1;
    
                // h = texture2D(heightMap,uv+normal2).r;
                // v = smoothstep(UVRange.x,UVRange.y,h);
                // // float v2 = step(step3.y,v)*0.50;
                // float v2 = smoothstep(step3.y-dis,step3.y,v);
                // float w2 = texture2D(waterTex,uv+normal2).r;
                // v2 = step(0.00001,v2)*(v2*(stepColor3.y-stepColor3.x)+stepColor3.x)*w2;
    
                // h = texture2D(heightMap,uv+normal3).r;
                // v = smoothstep(UVRange.x,UVRange.y,h);
                // // float v3 =step(step3.z,v)*0.80;
                // float v3 = smoothstep(step3.z-dis,step3.z,v);
                // v3 = step(0.00001,v3)*(v3*(stepColor3.z-stepColor3.y)+stepColor3.y);
    
    
                // float value = max(v1,max(v2,v3));
                // // float value = v1;
    
                // vec3 fadeCol = texture2D(GradientTex,vec2(value,0.5)).xyz;
    
                // // fadeCol = normal1*40.0;
                // // fadeCol.z = 0.0;
                // // fadeCol.x = 0.0;
                
            }`
        ].join("\n")
        return fs
    }
}



var defaultUniforms =
{
    'time': { value: new Vector2(0.0, 1.0) },
    "screenSize": { value: new Vector2(50, 50) },
    'heightTex': { value: null },
    'gradientTex': { value: null },
    'alphaTex': { value: null },
    'normalTex1': { value: null },
    'normalTex2': { value: null },
    'waterTex': { value: null },


    'uvSetting': { value: new Vector3(0.13, 0.32, 0.59) },
    // xy dir z: speed w:power 
    'normalSetting': { value: new Vector4(1.0, 0.5, 0.29, 0.2) },
    'normalSettingT': { value: 0 },
    // x step y stepColorValue z:flowSpeed w:flowPower
    'levelSetting': {
        value: [
            new Vector4(0.07, 0.25, 0.25, 0.25),
            new Vector4(0.34, 0.5, 0.25, 0.25),
            new Vector4(1.0, 0.8, 0.25, 0.25)]
    },
    // xy offset z scale
    'levelUVSetting': {
        value: [
            new Vector4(0.25, 0.50, 1.0, 0.5),
            new Vector4(0.50, 0.25, 1.0, 0.5),
            new Vector4(0.75, 0.75, 1.0, 0.5),
        ]
    },
    'uvSmoothStepRange': { value: new Vector2(0.0, 0.2) },
    'stepFadeWidth': { value: 0.2 },
}
export { MultiplyLevelFlowShader };

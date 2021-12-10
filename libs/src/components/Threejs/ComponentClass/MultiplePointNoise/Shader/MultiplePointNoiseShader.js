import {Vector2,Vector3, Vector4} from "three";
import * as THREE from 'three';
import {ShaderMath} from '../../Tool/ShaderMath';
var defaultUniform = {
    "time":{value:new Vector2(0.0,1.0)},
    "u_Color":{value: new Vector3(0.945,0.8196,0.0588)},
    "u_GroundColor":{value: new Vector3(0.5333334,0.2313,0.8941)},
    "u_bezierP1":{value:new Vector2(0.5,0.77)},
    "screenSize":{value:new Vector2(50,50)},
    // x y z isDisplay
    "points":{value:[
        new Vector4(-0.12  ,0.87 ,0  ,1.0),
        new Vector4(1.22,0.67 ,0  ,1.0),
        new Vector4(0.5,-0.19 ,0  ,1.0),
    ]},
    // a b angle 
    "pointsSetting":{value:[
        new Vector4(0.37,1.081,90,0),
        new Vector4(0.26,1.0,0,0),
        new Vector4(0.5,1.4,0,0),
    ]},
    'globalRScale':{value:1.0},

    'screenNoise':{value:new Vector3(370.0,0.06,0.13)},
    'smoothStep1':{value:new Vector4(0.53,0.39,0.2,6.62/2.0)},
};
function MultiplePointNoiseShaderCreator(uniforms,data)
{
    

    var shader = {};
    var uni = uniforms||defaultUniform;
    data = data||{};
    var pointsNum = data.pointsCount||uni['points'].value.length;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader']=getFragmentShader(pointsNum);
    return shader;

    function getFragmentShader(num)
    {
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

        uniform vec3 screenNoise;

        uniform vec3 u_GroundColor;
        uniform vec3 u_Color;
        uniform vec2 u_bezierP1;
        uniform vec4 smoothStep1;
        `,
        ShaderMath.lerpFloat,
        ShaderMath.lerpVec3,
        ShaderMath.ellipseR,
        ShaderMath.noiseWithSizePower,
        ShaderMath.calBezier1,
        ShaderMath.smoothStepFadeMove,
        `
        void main()
        {
            float WDH = screenSize.x/screenSize.y;
            vec4 vol = vec4(1.0,1.0,1.0,0.0);
            for(int i=0;i<${num};i++)
            {
                vec4 p = points[i];
                vec4 ps = pointsSetting[i];
                vec4 value = GetEllipseR(p.xyz,ps.xyz,vUv,globalRScale,WDH);
                vol.z = lerp(vol.z,min(vol.z,value.z),p.w);
                vol.w = lerp(vol.w,max(vol.w,value.w),p.w);
            }

            float v = 1.0 - smoothStepFadeMove(smoothStep1,1.0 - vol.w);
            v = getNoiseWithSizePower(screenNoise,vUv,WDH,v);
            v = CalBezier(vec2(0.0,0.0),u_bezierP1,vec2(1.0,1.0),v);

            vec3 _col = lerp(u_GroundColor,u_Color,v);
            gl_FragColor = vec4(_col, 1.0);
        }
        `
        ].join('\n');
        return fs; 
        
    }
}


export {MultiplePointNoiseShaderCreator};
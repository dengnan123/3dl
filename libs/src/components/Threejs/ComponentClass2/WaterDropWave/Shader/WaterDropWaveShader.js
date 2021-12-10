import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
    "time": { value: new Vector2(0.0, 1.0) },
    "screenSize": { value: new Vector2(50, 50) },

    'heightTex': { value: null },
    'groundTex': { value: null },
    'gradientTex': { value: null },
    'normalTex1': { value: null },
    'normalTex2': { value: null },
    'whiteTex': { value: null },

    'smoothSetting': { value: new Vector4(0, 1.0, 0.2833, 0.1) },
    'colorTop': { value: new Vector3(0.16078, 0.47843, 0.91372) },
    'colorBottom': { value: new Vector3(0.49803, 0.89411, 0.85882) },
    //x speed y power z slice min w slice max
    'normalSetting': { value: new Vector4(0.1, 1.0, 0.0, 0.0) },
    'normalSettingT': { value: 0 },
};
function WaterDropWaveShader(uniforms) {


    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        #include <common>
        varying vec2 vUv;
        uniform vec2 time;
        uniform vec2 screenSize;
        uniform sampler2D heightTex;
        uniform sampler2D groundTex;
        uniform sampler2D gradientTex;
        uniform sampler2D normalTex1;
        uniform sampler2D normalTex2;
        uniform sampler2D whiteTex;
        
        uniform vec4 smoothSetting;
        uniform vec3 colorTop;
        uniform vec3 colorBottom;
        uniform vec4 normalSetting;
        uniform float normalSettingT;
        `,
                ShaderMath.lerpVec3,
                `
        void main()
        {

            vec2 norUV = vUv+vec2(-1.0,0.0)*normalSettingT;
            vec2 norV = (texture2D(normalTex1,norUV).xy-0.5) + (texture2D(normalTex2,norUV).xy-0.5);
            float isNormal = step(vUv.x,normalSetting.z)*step(normalSetting.w,vUv.x);
            norV = norV*isNormal + norV*(1.0-isNormal)*0.2;
            vec2 uv = vUv + norV*normalSetting.y/6.0;
            float h = texture2D(heightTex,uv).r;
            float b = texture2D(groundTex,uv).r;
            
            h = smoothstep(smoothSetting.x,smoothSetting.y,h);
            float step = step(0.00001,h);
            float ssb = smoothstep(0.0,0.7 + 0.3*smoothSetting.x,b);
            h = texture2D(gradientTex,vec2(h,0.5)).r;

            vec2 noiseUV = vUv;
            noiseUV.x/=(screenSize.x/screenSize.y);
            float noisePower = texture2D(whiteTex,noiseUV*0.5).r;
            noisePower = (noisePower-0.5)*smoothSetting.w;
            h*=(1.0 + noisePower);
            ssb*=(1.0 + noisePower);

            vec3 lerpColor = lerp(colorBottom,colorTop,h)*step ;
            vec3 backColor = lerp(colorBottom,colorTop,smoothSetting.z)*(1.0-step)*ssb;
            vec3 addColor = lerpColor + backColor;
            vec3 _col = vec3(1.0,1.0,1.0);
            // _col*=noisePower;
            _col = addColor;


            gl_FragColor = vec4(_col, 1.0);
        }
        `
            ].join('\n');
        return fs;

    }
}


export { WaterDropWaveShader };
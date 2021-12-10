import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
    "time": { value: new Vector2(0.0, 1.0) },
    "screenSize": { value: new Vector2(50, 50) },


    topColor: { value: new Vector3(0.933333, 0.84313, 0.36078) },
    bottomColor: { value: new Vector3(0.89019, 0.89019, 0.87843) },
    // topColor: { value: new Vector3(1, 1, 1) },
    // bottomColor: { value: new Vector3(0, 0, 0) },
    backGroundColor: { value: new Vector3(0.51764, 0.74509, 0.82745) },
    heightTex: { value: null },
    backLevelTex: { value: null },
    gradientTex: { value: null },
    normalTex: { value: null },
    level1: { value: new Vector2(0.4, 0.3) },
    levelAlpha: { value: 0 },

    normalSetting: { value: new Vector2(0.8, 0.02) },

};
function HisRangeShaderCreator(uniforms, data) {


    var shader = {};
    var uni = uniforms || defaultUniform;
    data = data || {};
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
        uniform sampler2D backLevelTex;
        uniform sampler2D gradientTex;
        uniform sampler2D normalTex;
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 backGroundColor;
        uniform vec2 level1;
        uniform float levelAlpha;
        uniform vec2 normalSetting;
        `,
                ShaderMath.historyRange,
                ShaderMath.lerpVec3,
                `
        void main()
        {
            vec2 nuv = (time.x*vec2(1.0,0.0)/20.0+vUv)*normalSetting.x;
            vec2 nv = (texture2D(normalTex,nuv).xy-0.5)*2.0*normalSetting.y;
            float h = texture2D(heightTex,vUv+nv).r;
            float bv = texture2D(backLevelTex,vUv+nv).r*(level1.x-0.1);
            float levelLength = level1.y;
            if(level1.x+level1.y>1.0)
            {
                levelLength = 1.0 - level1.x;
            }
            float hv = smoothstep(level1.x,level1.x+levelLength,h);
            hv = texture2D(gradientTex,vec2(hv,0.5)).r;
            float la = smoothstep(level1.x,level1.x+levelLength*levelAlpha,h);

            bv = smoothstep(level1.x/2.0,(level1.x+levelLength)/2.0,bv);
            vec3 bc = lerp(backGroundColor,bottomColor,bv);
            
            vec3 _col = vec3(1.0,1.0,1.0);
            _col = lerp(bottomColor,topColor,hv);
            _col = lerp(bc,_col,la);
            // _col.xy = nv;
            // _col=bc;
            gl_FragColor = vec4(_col, 1.0);
        }
        `
            ].join('\n');
        return fs;

    }
}


export { HisRangeShaderCreator };
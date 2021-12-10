import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';

function BackShader(uniforms) {
    var shader = {};
    var uni = uniforms || defaultUniforms;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;
    function getFragmentShader(num) {
        var fs = [
            `
            
            varying vec2 vUv;
            uniform sampler2D heightTex;
            uniform sampler2D tDiffuse;
            uniform sampler2D normalTex;
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform vec3 topColor2;
            uniform vec3 bottomColor2;
            uniform float normalScale;
            uniform vec2 time;
            `,
            ShaderMath.lerpVec3,
            `
            
            void main(){
                vec3 _col = vec3(1.0,0.0,0.0);

                vec3 normal = texture2D(normalTex,vUv*0.25+vec2(time.x*0.02,0.0)).xyz;
                normal = texture2D(normalTex,vUv*0.25-normal.xy*0.1-time.x*0.02).xyz/40.0;

                float backH = texture2D(heightTex,vUv+normal.xy*normalScale).r;
                float oriH = texture2D(tDiffuse,vUv).r;
                vec3 backColor = lerp(bottomColor,topColor,backH);
                vec3 oriCol = lerp(bottomColor2,topColor2,oriH);

                

                // _col = oriCol;
                float alpha = min(oriCol.x*2.0,1.0);
                _col = lerp(backColor,oriCol,alpha);
                // _col = backColor;

                gl_FragColor = vec4(_col,1.0);
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
    'tDiffuse': { value: null },
    'normalTex': { value: null },

    'topColor': { value: new Vector3(0.02, 0.06, 0.13) },
    'bottomColor': { value: new Vector3(0.21, 0.21, 0.33) },

    'topColor2': { value: new Vector3(0.66, 0.85, 0.92) },
    'bottomColor2': { value: new Vector3(0.06, 0.10, 0.17) },
    "normalTex": { value: null },
    'normalScale': { value: 1 },
}
export { BackShader };

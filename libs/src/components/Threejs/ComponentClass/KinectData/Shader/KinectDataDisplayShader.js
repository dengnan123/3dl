import {Vector2,Vector3, Vector4} from "three";
import * as THREE from 'three';
import {ShaderMath} from '../../Tool/ShaderMath';
var defaultUniform = {
    "time":{value:new Vector2(0.0,1.0)},
    "screenSize":{value:new Vector2(50,50)},
    "colorTex":{value:null},
    "depthTex":{value:null},
    'jointLeft':{value:[new Vector3(0.4,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1)]},
    'jointRight':{value:[new Vector3(0.6,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1),new Vector3(0.5,0.5,1)]},
};
function KinectDataDiplayShader(uniforms)
{
    var shader = {};
    var uni = uniforms||defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = ShaderMath.vertexShader;
    shader['fragmentShader']=getFragmentShader();
    return shader;

    function getFragmentShader()
    {
        var fs = 
        [
            `
        #include <common>
        varying vec2 vUv;
        uniform vec2 time;
        uniform vec2 screenSize;
        uniform sampler2D colorTex;
        uniform sampler2D depthTex;

        uniform vec3 jointLeft[6];
        uniform vec3 jointRight[6];
        // uniform sampler2D gradientTex;
        // uniform sampler2D normalTex1;
        // uniform sampler2D normalTex2;
        // uniform sampler2D whiteTex;
        
        `,
        ShaderMath.lerpVec3,
        `
        void main()
        {
            vec3 _col = vec3(1.0,0.0,0.0);
            vec3 _pointColor = vec3(1.0,0.0,0.0);
            vec3 _pointColor2 = vec3(0.0,1.0,0.0);
            vec3 col = texture2D(colorTex,vUv).rgb;
            vec3 dep = texture2D(depthTex,vUv).rgb;
            float left = 0.0;
            float right = 0.0;
            float wdh = screenSize.x/screenSize.y;
            for(int i =0;i<6;i++)
            {
                vec2 dir = vUv-jointLeft[i].xy;
                dir.x*=wdh;
                float dis = length(dir);
                left = max(left,step(dis,0.01)*jointLeft[i].z);
            }
            for(int i =0;i<6;i++)
            {
                vec2 dir = vUv-jointRight[i].xy;
                dir.x*=wdh;
                float dis = length(dir);
                right = max(right,step(dis,0.01)*jointRight[i].z);
            }
            _col = col;
            _col = _col*(1.0-left) +_pointColor*left;
            _col = _col*(1.0-right) +_pointColor2*right;

            gl_FragColor = vec4(_col, 1.0);
        }
        `
        ].join('\n');
        return fs; 
        
    }
}


export {KinectDataDiplayShader};
import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../../Tool/ShaderMath';
var defaultUniform = {
    "screenSize": { value: new Vector2(50, 50) },
    "texelSize":{value:new Vector2(0.02,0.02)},
    'points':{value:[new Vector4(),new Vector4()]},
    'colors':{value:[new Vector4(),new Vector4()]},
    'readTex':{value:null},
};
function CenterDiffusionDYEShader(uniforms) {

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
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform vec4 points[2];
        uniform vec4 colors[2];
        uniform sampler2D readTex;
        uniform vec2 screenSize;
        `,
                `
        void main()
        {
            vec3 v = texture2D(readTex,vUv).xyz;
            float wdh = screenSize.x/screenSize.y;
            for(int i = 0;i<2;i++)
            {
                if(points[i].w!=0.0)
                {
                    vec4 p = points[i];
                    vec2 dir = vUv - p.xy;
                    dir.x*=wdh;

                    float dis = length(dir);
                    // vec3 sv = colors[i].xyz*exp(-dot(dir,dir)/p.z)*colors[i].w;
                    vec3 sv = colors[i].xyz*step(dis,p.z*1.0)*colors[i].w;
                    v+=sv;
                }
            }
            gl_FragColor = vec4(v,1.0);
            // gl_FragColor = vec4(v,1.0);
        }
        `
            ].join('\n');
        return fs;

    }
}
function CenterDiffusionVelocityShader(uniforms) {

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
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform vec4 points[2];
        uniform vec4 colors[2];
        uniform sampler2D readTex;
        uniform vec2 screenSize;
        `,
                `
        void main()
        {
            vec3 v = texture2D(readTex,vUv).xyz;
            float wdh = screenSize.x/screenSize.y;
            for(int i = 0;i<2;i++)
            {
                if(points[i].w!=0.0)
                {
                    // vec4 p = points[i];
                    // vec2 dir = vUv - p.xy;
                    // dir.x*=wdh;

                    // float dis = length(dir);
                    // dir = normalize(dir);


                    // // vec3 sv = vec3(dir,0.0)*length(colors[i].xyz)*exp(-dot(dir,dir)/p.z)*colors[i].w;
                    // vec3 sv = vec3(dir,0.0)*step(dis,p.z)*colors[i].w*100.0;
                    // v+=sv;

                    vec4 p = points[i];
                    vec2 dir = vUv - p.xy;
                    dir.x*=wdh;
                    vec3 sv = vec3(dir,0)*10000.0*exp(-dot(dir,dir)/p.z*4.0)*colors[i].w;
                    v+=sv;
                }
            }
            gl_FragColor = vec4(v,1.0);
            // gl_FragColor = vec4(0.0,0.0,0.0,1.0);
        }
        `
            ].join('\n');
        return fs;

    }
}


export { CenterDiffusionDYEShader,CenterDiffusionVelocityShader };

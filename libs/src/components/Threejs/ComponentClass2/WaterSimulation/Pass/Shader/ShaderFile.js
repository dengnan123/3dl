import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../../Tool/ShaderMath';
var vertexShader = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main()
    {
        vUv = uv;
        vL = vUv - vec2(texelSize.x,0.0);
        vR = vUv + vec2(texelSize.x,0.0);
        vB = vUv - vec2(0.0,texelSize.y);
        vT = vUv + vec2(0.0,texelSize.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;
// var defaultUniform = {
//     "time": { value: new Vector2(0.0, 1.0) },
//     "screenSize": { value: new Vector2(50, 50) },
//     "texelSize":{value:new Vector2(0.02,0.02)},
// };

function CopyShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "tDiffuse": { value: null },
        "scale":{value:1.0},
        'addValue':{value:0.0}

    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" );
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
                // precision mediump float;
                // precision mediump sampler2D;
                precision highp float;
                precision highp sampler2D;

                varying highp vec2 vUv;
                uniform sampler2D tDiffuse;
                uniform float scale;
                uniform float addValue;

                void main () {
                    gl_FragColor = scale * texture2D(tDiffuse, vUv) +addValue;
                }
        `
            ].join('\n');

        return fs;

    }
}

function SplatShader(uniforms) {
    var defaultUniform = {
        "screenSize": { value: new Vector2(50, 50) },
        "texelSize":{value:new Vector2(0.02,0.02)},
        'points':{value:[new Vector4(),new Vector4(),new Vector4(),new Vector4(),new Vector4(),
            new Vector4(),new Vector4(),new Vector4(),new Vector4(),new Vector4()]},
        'colors':{value:[new Vector4(),new Vector4(),new Vector4(),new Vector4(),new Vector4(),
            new Vector4(),new Vector4(),new Vector4(),new Vector4(),new Vector4()]},
        'readTex':{value:null},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform vec4 points[10];
        uniform vec4 colors[10];
        uniform sampler2D readTex;
        uniform vec2 screenSize;
        `,
                `
        void main()
        {
            vec3 v = texture2D(readTex,vUv).xyz;
            float wdh = screenSize.x/screenSize.y;
            for(int i = 0;i<10;i++)
            {
                if(points[i].w!=0.0)
                {
                    vec4 p = points[i];
                    vec2 dir = vUv - p.xy;
                    dir.x*=wdh;
                    vec3 sv = colors[i].xyz*exp(-dot(dir,dir)/p.z)*colors[i].w;
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
// function SplatShader(uniforms) {
//     var defaultUniform = {
//         "screenSize": { value: new Vector2(50, 50) },
//         "texelSize":{value:new Vector2(0.02,0.02)},
//         'points':{value:[new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),
//             new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3()]},
//         'colors':{value:[new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3(),
//             new Vector3(),new Vector3(),new Vector3(),new Vector3(),new Vector3()]},
//         'radius':{value:0.1},
//         'readTex':{value:null},
//     };
//     var shader = {};
//     var uni = uniforms || defaultUniform;
//     shader['uniforms'] = uni;
//     shader['vertexShader'] = vertexShader;
//     shader['fragmentShader'] = getFragmentShader();
//     return shader;

//     function getFragmentShader() {
//         var fs =
//             [
//                 `
//         precision highp float;
//         precision highp sampler2D;
//         varying vec2 vUv;
//         uniform vec3 points[10];
//         uniform vec3 colors[10];
//         uniform float radius;
//         uniform sampler2D readTex;
//         uniform vec2 screenSize;
//         `,
//                 `
//         void main()
//         {
//             vec3 v = texture2D(readTex,vUv).xyz;
//             float wdh = screenSize.x/screenSize.y;
//             for(int i = 0;i<10;i++)
//             {
//                 if(points[i].z!=0.0)
//                 {
//                     vec3 p = points[i];
//                     vec2 dir = vUv - p.xy;
//                     dir.x*=wdh;
//                     vec3 sv = colors[i]*exp(-dot(dir,dir)/radius);
//                     v+=sv;
//                 }
//             }
//             gl_FragColor = vec4(v,1.0);
//         }
//         `
//             ].join('\n');

//         return fs;

//     }
// }

function CurlShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        'velocityTex':{value:null},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D velocityTex;
        `,
                `
        void main()
        {
            //左边的竖直方向速度
            float L = texture2D(velocityTex,vL).y;
            //右边的竖直方向速度
            float R = texture2D(velocityTex,vR).y;
            //上边的水平方向速度
            float T = texture2D(velocityTex,vT).x;
            //下边的水平方向速度
            float B = texture2D(velocityTex,vB).x;
            float v = R-L-T+B;
            gl_FragColor = vec4(0.5*v,0.0,0.0,1.0);
            // gl_FragColor = texture2D(velocityTex,vUv);
        }
        `
            ].join('\n');

        return fs;

    }
}

function VorticityShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "velocityTex":{value:null},
        "curlTex":{value:null},
        "curlS":{value:0},
        "deltaTime":{value:0},

    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;
        uniform sampler2D velocityTex;
        uniform sampler2D curlTex;
        uniform float curlS;
        uniform float deltaTime;
        `,
                `
        void main()
        {
            float L = texture2D(curlTex,vL).x;
            float R = texture2D(curlTex,vR).x;
            float T = texture2D(curlTex,vT).x;
            float B = texture2D(curlTex,vB).x;
            float C = texture2D(curlTex,vUv).x;

            vec2 force = 0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));

            force/=length(force)+0.0001;
            force*=curlS*C;
            force.y*=-1.0;
            vec2 vel = texture2D(velocityTex,vUv).xy;
            gl_FragColor = vec4(vel+force*deltaTime,0.0, 1.0);

        }
        `
            ].join('\n');

        return fs;

    }
}

function DivergenceShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "velocityTex":{value:null},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D velocityTex;
        `,
        ShaderMath.lerpFloat,
        `
        void main()
        {
            float L = texture2D(velocityTex,vL).x;
            float R = texture2D(velocityTex,vR).x;
            float T = texture2D(velocityTex,vT).y;
            float B = texture2D(velocityTex,vB).y;

            vec2 C = texture2D(velocityTex,vUv).xy;
            L = lerp(L,-C.x,step(vL.x,0.0));
            R = lerp(R,-C.x,step(1.0,vR.x));
            T = lerp(T,-C.y,step(1.0,vT.y));
            B = lerp(B,-C.y,step(vB.y,0.0));
            // if (vL.x < 0.0) { L = -C.x; }
            // if (vR.x > 1.0) { R = -C.x; }
            // if (vT.y > 1.0) { T = -C.y; }
            // if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R-L+T-B);

            gl_FragColor = vec4(div,0.0,0.0, 1.0);
            // gl_FragColor = vec4(C,0.0, 1.0);

        }
        `
            ].join('\n');

        return fs;

    }
}

function PressureShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "pressureTex":{value:null},
        "divergenceTex":{value:null},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D pressureTex;
        uniform sampler2D divergenceTex;
        `,
                `
        void main()
        {
            float L = texture2D(pressureTex,vL).x;
            float R = texture2D(pressureTex,vR).x;
            float T = texture2D(pressureTex,vT).x;
            float B = texture2D(pressureTex,vB).x;
            float C = texture2D(pressureTex,vUv).x;
            float div = texture2D(divergenceTex,vUv).x;

            float pre = (L+R+B+T-div)*0.25;


            gl_FragColor = vec4(pre,0.0,0.0, 1.0);
        }
        `
            ].join('\n');

        return fs;

    }
}

function GradienSubtractShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "pressureTex":{value:null},
        "velocityTex":{value:null},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D pressureTex;
        uniform sampler2D velocityTex;
        `,
                `
        void main()
        {
            float L = texture2D(pressureTex,vL).x;
            float R = texture2D(pressureTex,vR).x;
            float T = texture2D(pressureTex,vT).x;
            float B = texture2D(pressureTex,vB).x;

            vec2 velocity = texture2D(velocityTex,vUv).xy;

            velocity.xy -=vec2(R-L,T-B);

            gl_FragColor = vec4(velocity,0.0,1.0);
        }
        `
            ].join('\n');

        return fs;

    }
}

function AdvectionShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "sourceTex":{value:null},
        "velocityTex":{value:null},
        'deltaTime':{value:0},
        'dissipation':{value:0},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision highp float;
        precision highp sampler2D;
        
        varying vec2 vUv;

        uniform sampler2D velocityTex;
        uniform sampler2D sourceTex;

        uniform vec2 texelSize;
        uniform float deltaTime;
        uniform float dissipation;
        `,
                `
        void main()
        {
            vec2 velocity = texture2D(velocityTex,vUv).xy;
            vec2 uv = vUv - deltaTime * velocity * texelSize;
            vec4 result = texture2D(sourceTex,uv);
            float decay =1.0 + dissipation * deltaTime;
            gl_FragColor = result/decay;
        }
        `
            ].join('\n');

        return fs;

    }
}
function AdvectionGradientShader(uniforms) {
    var defaultUniform = {
        "texelSize":{value:new Vector2(0.02,0.02)},
        "sourceTex":{value:null},
        "velocityTex":{value:null},
        "lifeGradientTex":{value:null},
        'deltaTime':{value:0},
    };
    var shader = {};
    var uni = uniforms || defaultUniform;
    shader['uniforms'] = uni;
    shader['vertexShader'] = vertexShader;
    shader['fragmentShader'] = getFragmentShader();
    console.log(shader);
    return shader;

    function getFragmentShader() {
        var fs =
            [
                `
        precision highp float;
        precision highp sampler2D;
        
        varying vec2 vUv;

        uniform sampler2D velocityTex;
        uniform sampler2D sourceTex;
        uniform sampler2D lifeGradientTex;
        uniform vec2 texelSize;
        uniform float deltaTime;
        `,
                `
        void main()
        {
            vec2 velocity = texture2D(velocityTex,vUv).xy;
            vec2 uv = vUv - deltaTime * velocity * texelSize;
            vec4 result = texture2D(sourceTex,uv);
            float decay = texture2D(lifeGradientTex,vec2(deltaTime,0.5)).x;
            gl_FragColor = result/decay;
        }
        `
            ].join('\n');

        return fs;

    }
}
// function VorticityShader(uniforms) {
//     var defaultUniform = {
//         "texelSize":{value:new Vector2(0.02,0.02)},
//         "velocityTex":{value:null},
//         "curlTex":{value:null},
//         "curlS":{value:0},
//         "deltaTime":{value:0},

//     };
//     var shader = {};
//     var uni = uniforms || defaultUniform;
//     shader['uniforms'] = uni;
//     shader['vertexShader'] = vertexShader;
//     shader['fragmentShader'] = getFragmentShader();
//     return shader;

//     function getFragmentShader() {
//         var fs =
//             [
//                 `
//         #include <common>
//         varying vec2 vUv;
//         varying vec2 vL;
//         varying vec2 vR;
//         varying vec2 vT;
//         varying vec2 vB;
//         uniform vec2 texelSize;
//         uniform sampler2D velocityTex;
//         uniform sampler2D curlTex;
//         uniform float curlS;
//         uniform float deltaTime;
//         `,
//                 `
//         void main()
//         {
//             float L = texture2D(curlTex,vL).x;
//             float R = texture2D(curlTex,vR).x;
//             float T = texture2D(curlTex,vT).x;
//             float B = texture2D(curlTex,vB).x;
//             float C = texture2D(curlTex,vUv).x;
//             vec2 force = 0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));

//             force/=(length(force)+0.0001);
//             force*=curlS*C;
//             force.y*=-1.0;
//             vec2 vel = texture2D(velocityTex,vUv).xy;
//             gl_FragColor = vec4(vel+force*deltaTime,0.0, 1.0);




//             // vec4 vt = texture2D(velocityTex,vUv);
//             // gl_FragColor = vt;
//         }
//         `
//             ].join('\n');

//         return fs;

//     }
// }

export { CopyShader,VorticityShader,SplatShader,CurlShader,DivergenceShader,PressureShader
    ,GradienSubtractShader,AdvectionShader,AdvectionGradientShader};
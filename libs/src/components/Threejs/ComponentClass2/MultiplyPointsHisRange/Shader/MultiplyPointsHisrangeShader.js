import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
  "time": { value: new Vector2(0.0, 1.0) },
  "screenSize": { value: new Vector2(50, 50) },


  topColor: { value: new Vector3(0.933333, 0.84313, 0.36078) },
  bottomColor: { value: new Vector3(0.89019, 0.89019, 0.87843) },
  backGroundColor: { value: new Vector3(0.51764, 0.74509, 0.82745) },

  points1: {
    value: [
      new Vector4(0.5, 0.5, 0.0, 1.0), new Vector4(0.5, 0.5, 0.0, 1.0),
      new Vector4(0.5, 0.5, 0.0, 1.0), new Vector4(0.5, 0.5, 0.0, 1.0),
      new Vector4(0.5, 0.5, 0.0, 1.0), new Vector4(0.5, 0.5, 0.0, 1.0),
      new Vector4(0.5, 0.5, 0.0, 1.0), new Vector4(0.5, 0.5, 0.0, 1.0),
      new Vector4(0.5, 0.5, 0.0, 1.0), new Vector4(0.5, 0.5, 0.0, 1.0)]
  },
  pointsSet1: {
    value: [
      new Vector4(0.2, 1.0, 0.0, 0.0), new Vector4(0.2, 1.0, 0.0, 0.0),
      new Vector4(0.2, 1.0, 0.0, 0.0), new Vector4(0.2, 1.0, 0.0, 0.0),
      new Vector4(0.2, 1.0, 0.0, 0.0), new Vector4(0.2, 1.0, 0.0, 0.0),
      new Vector4(0.2, 1.0, 0.0, 0.0), new Vector4(0.2, 1.0, 0.0, 0.0),
      new Vector4(0.2, 1.0, 0.0, 0.0), new Vector4(0.2, 1.0, 0.0, 0.0)
    ]
  },

  RScale: { value: 1 },
  // heightTex: { value: null },
  // backLevelTex: { value: null },
  // gradientTex: { value: null },
  // normalTex: { value: null },
  // level1: { value: new Vector2(0.4, 0.3) },
  // levelAlpha: { value: 0 },

  // normalSetting: { value: new Vector2(0.8, 0.02) },

};
function MultiplyPointsHisrangeShader(uniforms, data) {


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

        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 backGroundColor;
        uniform vec4 points1[10];
        uniform vec4 pointsSet1[10];
        uniform float RScale;
        `,
        ShaderMath.historyRange,
        ShaderMath.lerpVec3,
        `
        void main()
        {
            
            float v = 0.0;
            float wdh = screenSize.x/screenSize.y;
            for(int i = 0;i<10;i++)
            {
              if(points1[i].w!=0.0)
              {
                vec4 p = points1[i];
                vec4 setting = pointsSet1[i];

                float a = setting.x*setting.y*RScale;
                float b = setting.x*RScale;
                vec2 dir = vUv - p.xy;
                dir.x*=wdh;
                float dis = length(dir);
                float angle = setting.z;
                float edgeDis = length(vec2(a*cos(angle),b*sin(angle)));

                float dde = max(1.0 - dis/edgeDis,0.0);
                // float dde =dis/edgeDis;

                // v = max(v,dde);
                v = dde;
              }

            }


            vec3 _col = vec3(1.0,0.0,0.0)*v;
            gl_FragColor = vec4(_col, 1.0);
        }
        `
      ].join('\n');
    return fs;

  }
}


export { MultiplyPointsHisrangeShader };
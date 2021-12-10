import { Vector2, Vector3, Vector4 } from 'three';
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
  time: { value: new Vector2(0.0, 1.0) },
  screenSize: { value: new Vector2(50, 50) },

  dyeTex: { value: null },
  velTex: { value: null },
  backTex: { value: null },
  topColor: { value: new Vector3(1, 1, 1) },
  bottomColor: { value: new Vector3(0, 0, 0) },
  velPower: { value: 1 },
  waterDyeColor: { value: new Vector4(166 / 255, 196 / 255, 196 / 255, 0.3) },
};
function WSDShader(uniforms) {
  var shader = {};
  var uni = uniforms || defaultUniform;
  shader['uniforms'] = uni;
  shader['vertexShader'] = ShaderMath.vertexShader;
  shader['fragmentShader'] = getFragmentShader();
  return shader;

  function getFragmentShader() {
    var fs = [
      `
        #include <common>
        varying vec2 vUv;
        uniform vec2 time;
        uniform vec2 screenSize;

        uniform sampler2D backTex;
        uniform sampler2D dyeTex;
        uniform sampler2D velTex;
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float velPower;
        uniform vec4 waterDyeColor;
        
        `,
      ShaderMath.lerpVec3,
      `
        void main()
        {
            // float backV = texture2D(backTex,vUv).r;
            //水波偏置
            vec2 dirOffset = texture2D(velTex,vUv).xy;
            //背景颜色
            vec3 backCol = texture2D(backTex,vUv-dirOffset*0.002*velPower).rgb;
            //水染颜色
            float waterDyeA = texture2D(dyeTex,vUv).r;

            vec3 outputCol = lerp(backCol,waterDyeColor.rgb,waterDyeA*waterDyeColor.a);

            vec3 _col = vec3(1.0,1.0,1.0);
            _col = outputCol;

            gl_FragColor = vec4(_col, 1.0);
        }
        `,
    ].join('\n');
    return fs;
  }
}

export { WSDShader };

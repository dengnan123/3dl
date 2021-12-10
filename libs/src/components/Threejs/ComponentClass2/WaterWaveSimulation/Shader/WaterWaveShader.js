import { Vector2, Vector3, Vector4 } from 'three';
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
  time: { value: new Vector2(0.0, 1.0) },
  screenSize: { value: new Vector2(50, 50) },
  WIDTH: { value: 0 },
  heightTex: { value: null },
  normalTex: { value: null },
  normalScale: { value: 1 },
  subNormalScale: { value: 1.0 },
  backTexOffset: { value: 1.0 },
  backTex: { value: null },

  topColor: { value: new Vector3(244 / 255, 226 / 255, 142 / 255) },
  bottomColor: { value: new Vector3(58 / 255, 144 / 255, 224 / 255) },
};
function WaterWaveShader(uniforms) {
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
        uniform float WIDTH;
        uniform vec2 screenSize;
        uniform sampler2D heightTex;
        uniform sampler2D normalTex;
        uniform float normalScale;
        uniform float subNormalScale;
        uniform sampler2D backTex;
        uniform float backTexOffset;

        uniform vec3 topColor;
        uniform vec3 bottomColor;
        `,
      ShaderMath.lerpVec3,
      `
        void main()
        {
            vec2 cellSize = vec2( 1.0 / WIDTH, 1.0 / WIDTH );
            vec3 objectNormal = vec3(
                ( texture2D( heightTex, vUv + vec2( - cellSize.x, 0 ) ).x - texture2D( heightTex, vUv + vec2( cellSize.x, 0 ) ).x ) * WIDTH / BOUNDS,
                ( texture2D( heightTex, vUv + vec2( 0, - cellSize.y ) ).x - texture2D( heightTex, vUv + vec2( 0, cellSize.y ) ).x ) * WIDTH / BOUNDS,
                1.0 );

            vec3 normal = texture2D(normalTex,vUv+vec2(time.x*0.1,0.0)).xyz;
            normal = (normal-0.5)*2.0*0.1;
            normal = texture2D(normalTex,vUv+normal.xy+time.x*0.1).xyz;
            normal = (normal-0.5)*2.0;
            normal.xy*=normalScale*0.1;
            normalize(normal);
            objectNormal.xy*=subNormalScale*2.0;
            normalize(objectNormal);

            vec3 blendNormal = vec3(objectNormal.xy+normal.xy,objectNormal.z*normal.z);
            
            float h = texture2D(backTex,vUv+blendNormal.xy*backTexOffset).r;
            
            vec3 _col = vec3(1.0,1.0,1.0);
            _col = lerp(bottomColor,topColor,h);
            // _col = blendNormal*10.0;
            // _col = normal;
            // _col*=h*10.0;


            gl_FragColor = vec4(_col, 1.0);
        }
        `,
    ].join('\n');
    return fs;
  }
}

export { WaterWaveShader };

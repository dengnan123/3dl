/**
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

import { Vector2 } from "three/build/three.module";

var HorizontalNormalBlurShader = {

  uniforms: {

    'tDiffuse': { value: null },
    'h': { value: 1.0 / 512.0 },
    'hScale': { value: 1 },
    'smoothStepV': { value: new Vector2(0.33, 0.44) },
    'colorScale': { value: 0.5 },


  },

  vertexShader: [

    'varying vec2 vUv;',

    'void main() {',

    '	vUv = uv;',
    '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: [

    'uniform sampler2D tDiffuse;',
    'uniform float h;',

    `varying vec2 vUv;
    uniform vec2 smoothStepV;
    uniform float hScale;
    uniform float colorScale;
    void main() {
      vec4 sum = vec4( 0.0 );
      float ss = smoothstep(smoothStepV.x-smoothStepV.y,smoothStepV.x+smoothStepV.y,abs(vUv.x-0.5)*2.0);
      float curveV = ss *hScale* h;
    `,

    '	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * curveV, vUv.y ) ) * 0.051;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * curveV, vUv.y ) ) * 0.0918;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * curveV, vUv.y ) ) * 0.12245;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * curveV, vUv.y ) ) * 0.1531;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * curveV, vUv.y ) ) * 0.1531;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * curveV, vUv.y ) ) * 0.12245;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * curveV, vUv.y ) ) * 0.0918;',
    '	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * curveV, vUv.y ) ) * 0.051;',
    ' sum.rgb*=ss*colorScale +1.0-ss;',
    '	gl_FragColor = sum;',

    '}'

  ].join('\n')

};

export { HorizontalNormalBlurShader };



import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
    
};
function SmoothShader(uniforms) {


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
                uniform sampler2D smoothTexture;
    
                void main()	{
    
                    vec2 cellSize = 1.0 / resolution.xy;
    
                    vec2 uv = gl_FragCoord.xy * cellSize;
    
                    // Computes the mean of texel and 4 neighbours
                    vec4 textureValue = texture2D( smoothTexture, uv );
                    textureValue += texture2D( smoothTexture, uv + vec2( 0.0, cellSize.y ) );
                    textureValue += texture2D( smoothTexture, uv + vec2( 0.0, - cellSize.y ) );
                    textureValue += texture2D( smoothTexture, uv + vec2( cellSize.x, 0.0 ) );
                    textureValue += texture2D( smoothTexture, uv + vec2( - cellSize.x, 0.0 ) );
    
                    textureValue /= 5.0;
    
                    gl_FragColor = textureValue;
    
                }
    `
            ].join('\n');
        return fs;

    }
}


export { SmoothShader };
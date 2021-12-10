import { Vector2, Vector3, Vector4 } from "three";
import * as THREE from 'three';
import { ShaderMath } from '../../Tool/ShaderMath';
var defaultUniform = {
    
};
function HeightMapShader(uniforms) {


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
               #include <common>

                uniform float viscosityConstant;
                uniform float heightCompensation;
                uniform float heightAlpha;
                uniform vec2 screenSize;
                //x x y y z size w power
                uniform vec4 mouses[10];
                uniform vec4 mainMouse;

                void main()	{
                    float wdh = screenSize.x/screenSize.y;
                    vec2 cellSize = 1.0 / resolution.xy;

                    vec2 uv = gl_FragCoord.xy * cellSize;
                    vec2 vUv = gl_FragCoord.xy;
                    // heightmapValue.x == height from previous frame
                    // heightmapValue.y == height from penultimate frame
                    // heightmapValue.z, heightmapValue.w not used
                    vec4 heightmapValue = texture2D( heightmap, uv );

                    // Get neighbours
                    vec4 north = texture2D( heightmap, uv + vec2( 0.0, cellSize.y ) );
                    vec4 south = texture2D( heightmap, uv + vec2( 0.0, - cellSize.y ) );
                    vec4 east = texture2D( heightmap, uv + vec2( cellSize.x/wdh, 0.0 ) );
                    vec4 west = texture2D( heightmap, uv + vec2( - cellSize.x/wdh, 0.0 ) );

                    // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

                    float newHeight = ( ( north.x + south.x + east.x + west.x ) * 0.5 - heightmapValue.y ) * viscosityConstant;

                    // Mouse influence
                    vec2 mouseDir = ( uv - vec2( 0.5 ) )  - vec2( mainMouse.x, -  mainMouse.y );
                    mouseDir.x*=wdh;
                    
                    float iMP = clamp(length(mouseDir) * PI /  mainMouse.z*20.0, 0.0, PI );
                    newHeight+=( cos( iMP ) + 1.0 ) * 0.28*mainMouse.w;
                    for(int i=0;i<10;i++)
                    {
                        if(mouses[i].w>0.0)
                        {
                            mouseDir = ( uv - vec2( 0.5 ) )  - vec2( mouses[i].x, -  mouses[i].y );
                            mouseDir.x*=wdh;
                            
                            iMP = clamp(length(mouseDir) * PI /  mouses[i].z*20.0, 0.0, PI );
                            newHeight+=( cos( iMP ) + 1.0 ) * 0.28*sin(mouses[i].w*PI/2.0);
                        }
                    }
                    heightmapValue.y = heightmapValue.x;
                    heightmapValue.x = newHeight;

                    gl_FragColor = heightmapValue;

                }
               `
            ].join('\n');
        return fs;

    }
}


export { HeightMapShader };
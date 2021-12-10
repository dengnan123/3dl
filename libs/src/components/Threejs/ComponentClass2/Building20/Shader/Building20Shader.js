import {Vector2,Vector3, Vector4} from "three";
import * as THREE from 'three';
import {ShaderMath} from '../../Tool/ShaderMath';
var defaultUniform = {
    "time":{value:new Vector2(0.0,1.0)},
    "screenSize":{value:new Vector2(50,50)},
    'infoLeft20':{value:[0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1.0]},
    'infoRight20':{value:[0.01,0.012,0.013,0.08,0.10,0.12,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.90,0.92,0.94,0.96,0.98,1.0].reverse()},
    'borderPercent':{value:0.05},
    'borderWDH':{value:1},

    'sideColor':{value:new Vector3(70/255,80/255,98/255)},
    'tbColor':{value:new Vector3(104/255,118/255,143/255)},
    'infoBackColor':{value:new Vector3(98/255,112/255,135/255)},
    'infoSliderBackColor':{value:new Vector3(114/255,129/255,153/255)},
    'infoSliderColor':{value:new Vector3(95/255,173/255,255/255)},

    'valuePercentLeft':{value:1.0},
    'valuePercentRight':{value:1.0},
    'valuePercentLeft2':{value:1.0},
    'valuePercentRight2':{value:1.0},

};
function Building20Shader(uniforms,data)
{
    var shader = {};
    var uni = uniforms||defaultUniform;
    data = data||{};
    shader['uniforms'] = uni;
    shader['vertexShader'] = getVertexShader();
    shader['fragmentShader']=getFragmentShader();
    return shader;

    function getVertexShader()
    {
        var vs = 
        [
            
            `
                precision mediump float;
                precision mediump int;


                attribute vec2 uv0;
                varying vec2 vUv;
                void main()
                {
                    vUv = uv0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `
        ].join('\n')
        return vs;
    }
    function getFragmentShader(num)
    {
        var fs = 
        [
            `
            precision mediump float;
			precision mediump int;


			varying vec2 vUv;
            
            uniform float infoLeft20[20];
            uniform float infoRight20[20];
            uniform float borderPercent;
            uniform float borderWDH;
            uniform vec3 sideColor;
            uniform vec3 tbColor;
            uniform vec3 infoBackColor;
            uniform vec3 infoSliderBackColor;
            uniform vec3 infoSliderColor;
            uniform float valuePercentLeft;
            uniform float valuePercentRight;
            uniform float valuePercentLeft2;
            uniform float valuePercentRight2;
            
            vec3 getGraphValue()
            {
                float uvx = vUv.x;
                float borderW = borderPercent/borderWDH;
                float borderH = borderPercent;
                //左侧
                float stepL = step(0.25,uvx)*step(uvx,0.5);
                float vL = 1.0 - stepL*(uvx-0.25)*4.0;
                //右侧
                float stepR = step(0.75,uvx)*step(uvx,1.0);
                float vR = 1.0 - stepR*(uvx-0.75)*4.0;

                //背景色

                float stepTB = step(1.5,vUv.y);
                vec3 backCol =((stepL+stepR)*infoBackColor + max(1.0 - stepL-stepR,0.0)*sideColor );
                backCol= backCol*(1.0-stepTB)+stepTB*tbColor;

                //边框
                float stepBorderL =step(borderW,vL)*step(vL,1.0-borderW);
                float stepBorderR =step(borderW,vR)*step(vR,1.0-borderW);

                int floorIndex = int(vUv.y*20.0);
                //纵间距
                float vY = vUv.y*20.0-float(floorIndex);
                float stepBorderH = step(borderH,vY)*step(vY,1.0-borderH);

                float sliderBack = stepBorderH * (stepBorderL+stepBorderR);
                backCol = sliderBack*infoSliderBackColor + (1.0-sliderBack)*backCol;

                //左侧参数
                // float ilv = infoLeft20[floorIndex]*valuePercentLeft;
                // float irv = infoRight20[floorIndex]*valuePercentRight;
                float ilv = min(infoLeft20[floorIndex],valuePercentLeft)*valuePercentLeft2;
                float irv = min(infoRight20[floorIndex],valuePercentRight)*valuePercentRight2;
                //左侧输出
                vL = (vL-borderW)/(1.0-2.0*borderW);
                float vlo = step(ilv,vL);
                //右侧输出
                vR = (vR-borderW)/(1.0-2.0*borderW);
                float vro = step(irv,vR);

                
                float vo = (1.0 - vlo*vro)*sliderBack;
                
                float stepVO = step(0.5,vo);

                vec3 o = backCol*(1.0-stepVO) + (backCol*0.2+infoSliderColor*0.8)*stepVO;

                // vec3 o = vec3(1.0,0.0,0.0);
                // o = backCol;
                // o*=vo;
                return o;
            }
			void main()	
            {
                vec3 gc = getGraphValue();

				gl_FragColor = vec4(gc,1.0);

			}
            `
        //     `
        // #include <common>
        // varying vec2 vUv0;
        // uniform vec2 time;
        // uniform vec2 screenSize;
        // void main()
        // {
        //     vec3 _col = vec3(1.0,0.0,0.0);
        //     gl_FragColor = vec4(_col, 1.0);
        // }
        // `
        ].join('\n');
        return fs; 
        
    }
}


export {Building20Shader};
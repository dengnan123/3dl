// import {uniform} from "three";

export const ShaderMath:
{
    vertexShader:string,
    /**float lerp(float a,float b,float t) */
    lerpFloat:string,
    /**vec2 lerp(vec2 a,vec2 b,float t) */
    lerpVec2:string,
    /**vec3 lerp(vec3 a,vec3 b,float t) */
    lerpVec3:string,
    /**vec4 lerp(vec4 a,vec4 b,float t) */
    lerpVec4:string,
    /**vec2 CalBezier(vec2 p0,vec2 p1,vec2 p2, float t) */
    besierVec2:string,
    /**  */
    ellipseR:string,
    /**function(len) len:point number
     * vec4 getPointsR(vec4[] ps1,vec4[] ps2,float gRScale,float wdh) */
    getPointsR:string,
    /**getNoiseWithSizePower(vec3 noise,vec2 vUv,float wdh,float value) */
    noiseWithSizePower:string,
    /**float CalBezier(vec2 p0,vec2 p1,vec2 p2, float t) */
    calBezier1:string,
    /**float smoothStepFadeMove(vec4 ss,vec2 time,float v) */
    smoothStepFadeMove:string,
    floorFade:string,
    historyRange:string,
    levelsFlowNormal2:function(num),
}
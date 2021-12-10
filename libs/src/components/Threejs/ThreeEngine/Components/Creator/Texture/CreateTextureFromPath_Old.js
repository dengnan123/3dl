import { FloatType, NearestFilter, RGBFormat } from "three";
import { DataTexture } from "three/build/three.module";
import { ShaderFunc } from "../../../Shader/ShaderFunc";

function createTextureFromPath(path) {
  if (!Array.isArray(path)) return;
  const pointNum = path.length / 3;
  const size = Math.pow(2, Math.floor(Math.log2(Math.sqrt(pointNum))) + 1);
  const data = Array(size * size * 3).fill(0);
  for (let index = 0; index < path.length; index++) {
    data[index] = path[index];
  }
  const texture = new DataTexture(new Float32Array(data), size, size, RGBFormat, FloatType);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  let dis = 0;
  let lastP = [path[0], path[1], path[2]];
  for (let i = 1; i < pointNum; i++) {
    let x = path[3 * i];
    let x2 = Math.pow(x - lastP[0], 2);

    let y = path[3 * i + 1];
    let y2 = Math.pow(y - lastP[1], 2);

    let z = path[3 * i + 2];
    let z2 = Math.pow(z - lastP[2], 2);

    dis += Math.sqrt(x2 + y2 + z2);
    lastP[0] = x;
    lastP[1] = y;
    lastP[2] = z;
  }
  const shader =
    ShaderFunc.getBezierPosition + ShaderFunc.getBezierTangent + `
    uniform sampler2D _pPathTex;
    uniform float _pTotalLength;
    uniform float _pSize;
    uniform float _pCount;
    uniform float _pBezierSmooth;
    uniform float _pBezierMinSmooth;

    struct PTS{
      vec3 position;
      vec3 tangent;
      vec3 normal;
      vec3 up;
    };
    
    vec3 samplerPathTex(float n){
      float x = mod(n,_pSize)/_pSize;
      float y = n/_pSize/_pSize;
      return vec3(texture2D(_pPathTex,vec2(x,y)).rgb);

      // int x = index%pSize_i;
      // int y = index/pSize_i;
      // vec2 texUV = vec2(float(x)/_pSize,float(y)/_pSize);
      // return vec3(texture2D(_pPathTex,texUV).rgb);
    }

    PTS getOffsetPosition(float z){
      float halfSize = 0.5/_pSize;

      //把p归到0~l_pTotalLength 确保z小于_pTotalLength
      float lo = min(z,_pTotalLength-0.000001);
      lo = max(lo,0.);
      //是否在之前
      float isFirst = step(z,0.);
      //是否在之后
      float isEnd = step(_pTotalLength,z);
      vec3 pos;

      //本点index
      float process = lo/_pTotalLength*_pCount;
      float sp = fract(process);
      int N_i = int(process);
      float N_f = float(N_i);

      //上一点    0
      float N_Last_f = max(N_f-1.,0.);
      vec3 pos_N_Last = samplerPathTex(N_Last_f);

      //本点      1
      vec3 pos_N = samplerPathTex(N_f);
      
      //下一点    2
      float N_Next_f = min(N_f+1.,_pCount-1.);
      vec3 pos_N_Next = samplerPathTex(N_Next_f);

      //下两点    3
      float N_Next2_f = min(N_f+2.,_pCount-1.);
      vec3 pos_N_Next2 = samplerPathTex(N_Next2_f);

      //N position
      vec3 N_P = pos_N;
      vec3 N_P_1 = pos_N_Next;
      //N tangent
      vec3 N_T = normalize(pos_N_Next-pos_N_Last);

      //Vector N=>N+1;
      vec3 N_V_1_2 = (pos_N_Next-pos_N);
      vec3 N_V_1_2_SS = N_V_1_2*_pBezierSmooth;

      //N+1 Tangent
      vec3 N_1_T = normalize(pos_N_Next2-pos_N);

      float minTangentLength = length(N_V_1_2)*_pBezierSmooth*_pBezierMinSmooth;


      float TofNDot = max(abs(dot(N_T,N_V_1_2_SS)),minTangentLength);

      float TofN_1Dot = max(abs(dot(N_V_1_2_SS,N_1_T)),minTangentLength);

      N_T*= TofNDot;
      N_1_T*=-TofN_1Dot;

      vec3 A = N_P;
      vec3 B = N_P+N_T;
      vec3 C = N_P_1+N_1_T;
      vec3 D = N_P_1;

      PTS res;
      res.position = getBezierPosition(A,B,C,D,sp);
      res.tangent = getBezierTangent(A,B,C,D,sp);
      // res.normal = getBezierNormal(res.tangent,A,B,C,D,sp);
      vec3 worldUp = vec3(0.,1.,0.);
      res.up = worldUp - res.tangent*dot(worldUp,res.tangent);
      res.normal = normalize(cross(res.up,res.tangent));
      return res;
      
      
    }
  `
  return {
    uniforms: {
      _pPathTex: { value: texture },
      _pTotalLength: { value: dis },
      _pSize: { value: size },
      _pCount: { value: pointNum },
      _pBezierSmooth: { value: 0.3333 },
      _pBezierMinSmooth: { value: 0.5 },
    },
    shader
  }
}


export { createTextureFromPath };
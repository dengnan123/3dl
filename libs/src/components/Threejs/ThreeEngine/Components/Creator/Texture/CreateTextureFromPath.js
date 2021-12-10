import { DataTexture, FloatType, RGBFormat, NearestFilter } from "three";
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
  const shader = ShaderFunc.getBezierPosition + ShaderFunc.getBezierTangent + `
    uniform sampler2D _pPathTex;
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

    struct PTS_B4{
      vec3 p0;
      vec3 p1;
      vec3 p2;
      vec3 p3;
    };
    
    //Bezier parameter
    struct PTS_BP{
      vec3 A;
      vec3 B;
      vec3 C;
      vec3 D;
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
    //Bezier参数求值
    PTS getPTSFromBezierParameter(PTS_BP bp,float process){
      PTS res;
      res.position = getBezierPosition(bp.A,bp.B,bp.C,bp.D,process);
      res.tangent = getBezierTangent(bp.A,bp.B,bp.C,bp.D,process);
      // res.normal = getBezierNormal(res.tangent,bp.A,bp.B,bp.C,bp.D,process);
      vec3 worldUp = vec3(0.,1.,0.);
      res.up = normalize(worldUp - res.tangent*max(dot(worldUp,res.tangent),0.0001));
      res.normal = normalize(cross(res.up,res.tangent));
      return res;
    }
    // p0 p1 p2 p3四点求过p1 p2的bezier曲线
    PTS getPTSFromBezier4(PTS_B4 b4,float process){
      //N position
      vec3 N_P = b4.p1;
      vec3 N_P_1 = b4.p2;
      //N tangent
      vec3 N_T = normalize(b4.p2-b4.p0);

      //Vector N=>N+1;
      vec3 N_V_1_2 = (b4.p2-b4.p1);
      vec3 N_V_1_2_SS = N_V_1_2*_pBezierSmooth;

      //N+1 Tangent
      vec3 N_1_T = normalize(b4.p3-b4.p1);

      float minTangentLength = length(N_V_1_2)*_pBezierSmooth*_pBezierMinSmooth;


      float TofNDot = max(abs(dot(N_T,N_V_1_2_SS)),minTangentLength);

      float TofN_1Dot = max(abs(dot(N_V_1_2_SS,N_1_T)),minTangentLength);

      N_T*= TofNDot;
      N_1_T*=-TofN_1Dot;

      PTS_BP bp;
      bp.A = N_P;
      bp.B = N_P+N_T;
      bp.C = N_P_1+N_1_T;
      bp.D = N_P_1;

      
      return getPTSFromBezierParameter(bp,process);
    }
   
  `;
  const uniforms = {
    _pPathTex: { value: texture },
    _pSize: { value: size },
    _pCount: { value: pointNum },
    _pBezierSmooth: { value: 0.3333 },
    _pBezierMinSmooth: { value: 0.5 },
  };

  return {
    uniforms,
    shader,
    texture
  }
}

export { createTextureFromPath }


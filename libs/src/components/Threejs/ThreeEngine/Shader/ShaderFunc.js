import { BezierMath } from "./Math/Bezier";

var ShaderFunc = {
  getBezierPosition: BezierMath.getBezierPositionShader,
  getBezierTangent: BezierMath.getBezierTangentShader,
  getBezierNormal: BezierMath.getBezierNormal,
}

export { ShaderFunc };
var BezierMath = {
  getBezierPositionShader: `
  vec3 getBezierPosition(vec3 A,vec3 B,vec3 C,vec3 D,float sp){
    float sp1 = 1.-sp;
    vec3 bpos = A*sp1*sp1*sp1 + 3. * B* sp1*sp1*sp + 3.*C*sp*sp*sp1+ D*sp*sp*sp;
    return bpos;
  }
  `,
  getBezierTangentShader: `
  vec3 getBezierTangent(vec3 A,vec3 B,vec3 C,vec3 D,float sp){
    float sp1 = 1.-sp;
    vec3 btan = sp1*sp1*3.*(B-A)+2.*sp*sp1*3.*(C-B)+sp*sp*(D-C);
    return normalize(btan);
  }
  `,
  getBezierNormal: `
  
  `,

}

export { BezierMath };
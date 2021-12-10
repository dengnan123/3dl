import { LineCurve3, TubeBufferGeometry, Vector3, ShaderChunk, Group, InstancedMesh, ShaderMaterial } from "three";
import { createTextureFromPath } from "../../Texture/CreateTextureFromPath";
// const r2 = Math.SQRT1_2;
const options = {
  count: 10,
  path: [],
  //offset scale power
  size: [0, 1, 0.5],
}

function TwoPointCurve(baseOption) {
  const group = new Group();
  group.TPC = this;
  const baseObj = {
    curve: undefined,
    geometry: undefined,
    mesh: undefined,
    material: undefined,
    pathTex: undefined,
  }

  // const scope = this;
  init();


  function init() {
    group.name = "TwoPointCurve";
    initOptions();

    initBaseObj();

    function initOptions() {
      baseOption = baseOption || {};
      baseOption.segmentNumber = baseOption.segmentNumber || 40;
      baseOption.radius = baseOption.radius || 20;
      baseOption.radiusSegment = baseOption.radiusSegment || 8;

      baseOption = baseOption || {};
      for (var key in options) {
        if (baseOption[key] === undefined) {
          baseOption[key] = options[key];
        }
      }
      if (baseOption.path.length === 0) {
        var path = [];
        var PI4 = 2 * Math.PI / 8;
        var size = 1000;
        var endPos = new Vector3(0, 0, 0);
        for (let index = 0; index < 8; index++) {
          var data = {
            end: endPos,
          };
          data['start'] = new Vector3(Math.cos(PI4 * index) * size, 1 * size, Math.sin(PI4 * index) * size);
          path.push(data);
        }
        baseOption.path = path;
      }

      //Uniforms
      baseOption.uniforms = baseOption.uniforms || {};
      baseOption.uniforms.fog = baseOption.uniforms.fog || {};
    }

    function initBaseObj() {

      //创建texture
      var getShaderFunc = `
      PTS getOffsetPosition(float z){
        float offset = float(gl_InstanceID);
        vec3 start = samplerPathTex(offset*2.);
        vec3 end = samplerPathTex(offset*2.+1.);
        vec3 center = (start+end)/2.;
        vec3 start_ = center.xyz;
        start_.y = start.y;
        vec3 _end = center.xyz;


        _end.y = end.y;


        PTS_BP bp;
        bp.A = start;
        bp.B = start_;
        bp.C = _end;
        bp.D = end;

        return getPTSFromBezierParameter(bp,z);
      }
      `
      var texPath = [];
      for (var key in baseOption.path) {
        var s = baseOption.path[key].start;
        var e = baseOption.path[key].end;
        texPath.push(s.x, s.y, s.z);
        texPath.push(e.x, e.y, e.z);
      }
      var texData = createTextureFromPath(texPath, getShaderFunc);
      baseObj.pathTex = texData;
      //设置index
      for (let index = 0; index < baseOption.path.length; index++) {
        const element = baseOption.path[index];
        // let off = index * 2;
        // const _pSize = texData.uniforms._pSize.value;
        // element['start_x'] = off % _pSize;
        // element['start_y'] = Math.floor(off / _pSize);
        // off++;
        // element['end_x'] = off % _pSize;
        // element['end_y'] = Math.floor(off / _pSize);
        element['index'] = index;
        element['texture'] = texData.texture;
        element['update'] = function () {
          const start = this.start;
          const end = this.end;
          const tex = this.texture;
          tex.image.data.set([start.x, start.y, start.z, end.x, end.y, end.z], this.index * 6);
          tex.needsUpdate = true;
        }
      }
      var texShader = texData.shader + getShaderFunc;

      //创建mesh
      const count = baseOption.path.length;
      const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
      baseObj.curve = curve;
      const geo = new TubeBufferGeometry(curve, baseOption.segmentNumber, baseOption.radius, baseOption.radiusSegment);
      baseObj.geometry = geo;



      const shader = createTwoPointCurveShader();
      shader.uniforms = Object.assign(shader.uniforms, baseOption.uniforms, texData.uniforms);
      baseObj.material = new ShaderMaterial(shader);
      baseObj.material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace("#include <getPositionFromTexture_vertex>", texShader);
      }
      const unifroms = baseObj.material.uniforms;
      unifroms._size.value.set(...baseOption.size);
      const mesh = new InstancedMesh(geo, baseObj.material, count);
      mesh.frustumCulled = false;
      baseObj.mesh = mesh;
      group.add(mesh);


    }
  }

  this.dispose = function () {
    for (var key in baseObj) {
      if (baseObj[key].dispose) {
        baseObj[key].dispose();
      }
    }
  }


  Object.defineProperty(this, "mesh", {
    get: function () { return baseObj.mesh },
  })
  Object.defineProperty(this, "group", {
    get: function () { return group },
  })
  Object.defineProperty(this, "texData", {
    get: function () { return baseObj.pathTex },
  })
  Object.defineProperty(this, "geometry", {
    get: function () { return baseObj.geometry },
  })

}
function createTwoPointCurveShader() {
  const uniforms = {
    _size: { value: new Vector3(1, 0, 1) },
  }
  let vertexShader = `
  precision highp float;
  precision highp sampler2D;
  #define USE_FOG;
  ${ShaderChunk["fog_pars_vertex"]}
  varying vec2 vUv;
  uniform vec3 _size;
  #include <getPositionFromTexture_vertex>
  void main()
  {
      vUv = uv;
      vec3 pos = position.xyz;
      pos.xy*=_size.x+pow(sin(pos.z*3.1415926)*_size.y,_size.z);
      PTS res = getOffsetPosition(pos.z);
      vec3 newPos = res.position;
      vec3 offPos = (pos.x)*res.normal+pos.y*res.up;
      newPos+=offPos;
      pos = newPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
  }
  `;
  let fragmentShader = `
    #define USE_FOG;
    ${ShaderChunk["fog_pars_fragment"]}
    varying vec2 vUv; 
    void main() 
    {
      gl_FragColor = vec4(1.,0.,0.,1.);
      // if (gl_FragColor.a < 0.0001) discard;
      ${ShaderChunk["fog_fragment"]}
    }
  
  `;
  return {
    vertexShader,
    fragmentShader,
    uniforms
  }
}

export { TwoPointCurve }
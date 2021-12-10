import { Group, InstancedMesh, LineCurve3, ShaderChunk, ShaderMaterial, TubeBufferGeometry } from "three"
import { Vector3 } from "three/build/three.module";
import { TwoPointCurve } from "../../Creator/Instance/TwoPoint/TwoPointCurve";
import { createTextureFromPath } from "../../Creator/Texture/CreateTextureFromPath";

function ElevatorManager(points) {
  const group = new Group();
  const baseObj = {
    twoPointCurve: undefined,
    twoPointLine: undefined,
  };
  const elevators = [];
  const handlerPoint = new Vector3(400, 800, 400);

  let needsUpdate = false;

  init();




  this.dispose = function () {
    for (var key in baseObj) {
      if (baseObj[key].dispose) {
        baseObj[key].dispose();
      }
    }
  }

  this.update = function (index) {
    if (!group.visible) {
      needsUpdate = true;
      return;
    }
    if (index === undefined) {
      elevators.forEach(element => {
        element.update();
      });
    }
    else {
      elevators[index].update();
    }
  }


  function init() {
    points.forEach(element => {
      const pathData = {};
      pathData['start'] = element;
      pathData['end'] = handlerPoint;
      elevators.push(pathData);
    });
    const option = {
      radius: 1.5,
      segmentNumber: 40,
      path: elevators,
      uniforms: {
      }
    }
    baseObj.twoPointCurve = new TwoPointCurve(option);
    console.log(baseObj.twoPointCurve.texData)

    baseObj.twoPointLine = new TwoPointLineVertical({}, baseObj.twoPointCurve.texData, baseObj.twoPointCurve.geometry);
    group.add(baseObj.twoPointCurve.group);
    group.add(baseObj.twoPointLine.group);
  }



  Object.defineProperty(this, "group", {
    get: function () { return group },
  })
  Object.defineProperty(this, "visible", {
    get: function () { return group.visible },
    set: function (val) {
      group.visible = val;
      if (val && needsUpdate) {
        this.update();
      }
    }
  })

}


function TwoPointLineVertical(baseOption, texData, geo) {
  const baseObj = {
    curve: undefined,
    geometry: undefined,
    mesh: undefined,
    material: undefined,
    pathTex: undefined,
  }
  let data = texData;
  const group = new Group();

  init();

  this.dispose = function () {
    for (var key in baseObj) {
      if (baseObj[key] && baseObj[key].dispose) {
        baseObj[key].dispose();
      }
    }
  }

  function init() {
    var texData = data;
    baseOption = baseOption || {};
    baseOption.uniforms = baseOption.uniforms || {};
    if (!texData) {
      var texPath = [];
      for (var key in baseOption.path) {
        var s = baseOption.path[key].start;
        var e = baseOption.path[key].end;
        texPath.push(s.x, s.y, s.z);
        texPath.push(e.x, e.y, e.z);
      }
      texData = createTextureFromPath(texPath);
    }
    else {
      console.log(texData);
    }
    var texShader = `
    PTS getOffsetPosition(float z){
      float offset = float(gl_InstanceID);
      vec3 top = samplerPathTex(offset*2.);
      vec3 bottom = top.xyz;
      bottom.y = 0.; 
      PTS p;
      p.position = mix(bottom,top,z);
      p.tangent = vec3(0.,1.,0.);
      p.normal = -vec3(1.,0.,0.);
      p.up = vec3(0.,0.,1.);
      return p;
    }
    `
    texShader = texData.shader + texShader;
    if (!geo) {
      const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
      baseObj.curve = curve;
      geo = new TubeBufferGeometry(curve, baseOption.segmentNumber, baseOption.radius, baseOption.radiusSegment);
      baseObj.geometry = geo;
    }



    const shader = createTwoPointShader();
    shader.uniforms = Object.assign(shader.uniforms, baseOption.uniforms, texData.uniforms);
    baseObj.material = new ShaderMaterial(shader);
    baseObj.material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace("#include <getPositionFromTexture_vertex>", texShader);
    }
    const mesh = new InstancedMesh(geo, baseObj.material, texData.uniforms._pCount.value / 2);
    mesh.frustumCulled = false;
    baseObj.mesh = mesh;
    group.add(mesh);
  }
  Object.defineProperty(this, "group", {
    get: function () { return group },
  })

  function createTwoPointShader() {
    const uniforms = {
      _size: { value: new Vector3(0, 1, 0.5) },
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
        pos.xy*=(_size.x+_size.y);
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
        gl_FragColor = vec4(0.,1.,0.,1.);
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
}



export { ElevatorManager }
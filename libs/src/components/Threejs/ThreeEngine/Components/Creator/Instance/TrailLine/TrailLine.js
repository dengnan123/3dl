import { InstancedBufferGeometry, LineCurve3, TubeBufferGeometry, Vector3, Color, ShaderChunk } from "three";
import { InstancedBufferAttribute, Mesh, ShaderMaterial, Vector2 } from "three/build/three.module";
import { MathTool } from "../../../../Tool/MathTool";
import { createTextureFromPath } from "../../Texture/CreateTextureFromPath";

function TrailLine(baseOption) {
  const baseObj = {
    curve: undefined,
    geometry: undefined,
    mesh: undefined,
    material: undefined,
    pathTex: undefined,
  }


  init();

  this.animate = (dt, t) => {
  }


  function init() {
    //初始化输入设置
    initOption();
    //初始化基础
    initBaseObj();




    function initOption() {
      //init option
      baseOption = baseOption || {};
      //trail line 数量
      baseOption.lineCount = baseOption.lineCount || 20;
      //是否是道路
      baseOption.isRoadWay = baseOption.isTwoRoadWay || false;
      //车道数
      baseOption.laneCount = baseOption.laneCount || 2;
      //trailline段数
      baseOption.segmentNumber = baseOption.segmentNumber || 40;
      //trailline 半径
      baseOption.radiu = baseOption.radiu || 2;
      //trailline 半径段数
      baseOption.radiuSegment = baseOption.radiuSegment || 8;

      //总道路长度
      baseOption.totalLength = baseOption.totalLength || 4 * 100 * 1.414;
      //偏移半径
      baseOption.offsetRadius = baseOption.offsetRadius || [0.05, 0.15];
      //单条长度
      // baseOption.trailLineLength = baseOption.trailLineLength || [15, 25];
      baseOption.trailLineLength = baseOption.trailLineLength || [15 * 3, 25 * 2];

      //基础速度
      baseOption.baseSpeed = baseOption.baseSpeed || [80, 100];
      //高度偏移范围
      baseOption.offsetYRange = baseOption.offsetYRange || [0.1, 1];
      baseOption.offsetXRange = baseOption.offsetXRange || [0.1, 1];
      //均匀路径点
      baseOption.path = baseOption.path || [0, 0, 0, 100 / 2, 0, 100 / 2, 200 / 2, 0, 0, 300 / 2, 0, -100 / 2, 400 / 2, 0, 0,
        250, 0, 0, 300, 0, 100 / 2, 350, 0, 0, 400, 0, -100 / 2, 450, 0, 0,
        500, 0, 0, 550, 0, 100 / 2, 600, 0, 0, 650, 0, -100 / 2, 700, 0, 0];

      //trailline 颜色
      baseOption.colors = baseOption.colors || 0xff102a;
      if (Array.isArray(baseOption.colors)) {
        for (let index = 0; index < baseOption.colors.length; index++) {
          baseOption.colors[index] = new Color(baseOption.colors[index]);
        }
      }
      else {
        baseOption.colors = new Color(baseOption.colors);
      }


      //Uniforms
      baseOption.uniforms = baseOption.uniforms || {};
      baseOption.uniforms.fog = baseOption.uniforms.fog || {};
    }
    //创建texture

    function initBaseObj() {



      // //创建texture
      // var texData = createTextureFromPath(baseOption.path);
      // baseOption.totalLength = texData.uniforms._pTotalLength.value;
      var texData = initTexture();

      const lineCount = baseOption.lineCount * (baseOption.isTwoRoadWay ? 2 * baseOption.laneCount * 2 : 1);
      //初始化instanced geometry
      baseObj.curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
      const geo = new TubeBufferGeometry(baseObj.curve, baseOption.segmentNumber, baseOption.radiu, baseOption.radiuSegment);
      baseObj.geometry = new InstancedBufferGeometry().copy(geo);
      baseObj.geometry.maxInstancedCount = lineCount;
      geo.dispose();

      const lineOffsets = [];
      const lineMetrics = [];
      const lineColors = [];

      for (let index = 0; index < lineCount; index++) {
        let radius = MathTool.random(baseOption.offsetRadius);
        let length = MathTool.random(baseOption.trailLineLength);
        let baseSpeed = MathTool.random(baseOption.baseSpeed);


        if (!baseOption.isTwoRoadWay) {
          //水平 竖直 偏置
          let offsetX, offsetY, offsetZ;
          offsetX = MathTool.random(baseOption.offsetXRange);
          offsetY = MathTool.random(baseOption.offsetYRange);
          offsetZ = -Math.random() * baseOption.totalLength;

          let color = MathTool.pikeRandom(baseOption.colors);
          lineOffsets.push(offsetX, offsetY, offsetZ);
          lineMetrics.push(radius, length, baseSpeed);
          lineColors.push(color.r, color.g, color.b);
        }


      }

      baseObj.geometry.addAttribute("lineOffset", new InstancedBufferAttribute(new Float32Array(lineOffsets), 3, false))
      baseObj.geometry.addAttribute("lineMetric", new InstancedBufferAttribute(new Float32Array(lineMetrics), 3, false))
      baseObj.geometry.addAttribute("lineColor", new InstancedBufferAttribute(new Float32Array(lineColors), 3, false))



      const shader = createTrailLineShader();
      shader.uniforms = Object.assign(shader.uniforms, baseOption.uniforms, texData.uniforms);
      baseObj.material = new ShaderMaterial(shader);
      baseObj.material.onBeforeCompile = shader => {
        shader.vertexShader = shader.vertexShader.replace("#include <getPositionFromTexture_vertex>", texData.shader);
        // console.log(shader.vertexShader);
        // console.log(shader.fragmentShader)
        // console.log(shader.uniforms);
      }
      const mesh = new Mesh(baseObj.geometry, baseObj.material);
      baseObj.mesh = mesh;
      mesh.frustumCulled = false;



    }
    function initTexture() {
      var readUniforms = {
        _pTotalLength: { value: 0 },
      }
      var readTexFunc = `
      uniform float _pTotalLength;

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

        PTS_B4 b4;
        b4.p0 = pos_N_Last;
        b4.p1 = pos_N;
        b4.p2 = pos_N_Next;
        b4.p3 = pos_N_Next2;
        return getPTSFromBezier4(b4,sp);
      }`
      var texData = createTextureFromPath(baseOption.path);
      baseOption.totalLength = MathTool.getPathLength(baseOption.path);
      readUniforms._pTotalLength.value = baseOption.totalLength;

      texData.uniforms = Object.assign(readUniforms, texData.uniforms);
      texData.shader += readTexFunc;
      return texData;
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
}


function createTrailLineShader() {
  let uniforms = {
    speed: { value: 2 },
    uFade: {
      value: new Vector2(0, 0.6)
    },
  };
  let vertexShader = `
  precision highp float;
  precision highp sampler2D;
  #define USE_FOG;
  ${ShaderChunk["fog_pars_vertex"]}
  attribute vec3 lineOffset;
  attribute vec3 lineMetric;
  attribute vec3 lineColor;


  varying vec2 vUv;
  varying vec3 vColor;
  uniform float speed;
  uniform float _time;

  #include <getPositionFromTexture_vertex>


  void main()
  {
      vUv = uv;

      vColor = lineColor;
      
      vec3 pos = position.xyz;
      float radius = lineMetric.x*10.0;
      float length = lineMetric.y;
      float fSpeed = lineMetric.z * speed;

      pos.xy*=radius;

      //pos.z 原来范围[0,1] length < 0

      pos.z*=length;


      //计算起始点偏置位置 偏置范围[-length,_pTotalLength]
      float off = mod(max(lineOffset.z+_time*fSpeed,0.0),_pTotalLength+length)-length+pos.z;
      // PTS res = getOffsetPosition(142.*2.+71.);
      PTS res = getOffsetPosition(off);

      
      //基础位置
      vec3 newPos = res.position;
      vec3 offPos = (pos.x+lineOffset.x)*res.normal+pos.y*res.up;
      newPos+=offPos;
      newPos.y = lineOffset.y;
      pos = newPos;
      // pos.xy+=offsetPos.xy;
      
      // pos.xy+=lineOffset.xy;

      // pos.xyz+=res.normal*10.;

      
      gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
  }
  
  `;
  let fragmentShader = `
  #define USE_FOG;
  ${ShaderChunk["fog_pars_fragment"]}
  varying vec3 vColor;
  varying vec2 vUv; 
  uniform vec2 uFade;
  void main() {
  vec3 color = vec3(vColor);
  float fadeStart = 0.4;
  float maxFade = 0.;
  float alpha = 1.;
  
  alpha = smoothstep(uFade.x, uFade.y, vUv.x);
  gl_FragColor = vec4(color,alpha);
  if (gl_FragColor.a < 0.0001) discard;
  ${ShaderChunk["fog_fragment"]}
  }
  
  `;



  return {
    vertexShader,
    fragmentShader,
    uniforms
  }
}


export { TrailLine };
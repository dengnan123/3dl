import {
  ShaderMaterial,
  Uniform,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4,
} from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';
import * as THREE from 'three';
import { WebGLRenderTarget } from 'three';
import {
  SplatShader,
  VorticityShader,
  CurlShader,
  DivergenceShader,
  PressureShader,
  CopyShader,
  GradienSubtractShader,
  AdvectionShader,
} from './Shader/ShaderFile';
import { ShaderMath } from '../../Tool/ShaderMath';
var WaterSimulationPass = function (screenSize, applyDyeMaterial, applyVelocityMaterial) {
  Pass.call(this);
  this.uniforms = {
    time: { value: new Vector2(0, 1) },
    dye_Resolution: { value: 1024 },
    sim_Resolution: { value: 256 },

    isCopyInverse: { value: false },

    show_Index: { value: 2 },
    screenSize: screenSize,
    isPause: { value: false },
    isCopy: { value: false },
    isRandomColor: { value: true, timer: 0, updateSpeed: 1 },
    lastUpdateTime: Date.now(),
    clearRT: false,

    points: { value: [] },
    splatStack: { value: [] },
    staticInputs: { value: [] },
    applyDyeMaterial: null,
    applyVelocityMaterial: null,

    SPLAT_MULTIPLY_FORCE: { value: 1000 },
    SPLAT_MULTIPLY_RADIUS: { value: 0.25 },
    SPLAT_MULTIPLY_STATIC_RADIU: { value: true },

    SPLAT_STATIC_UPDATE: { value: true },

    SPLAT_FORCE: { value: 6000 },
    SPLAT_RADIUS: { value: 0.25 },

    PRESSURE: { value: 0.13 },
    PRESSURE_ITERATIONS: { value: 10 },
    CURL: { value: 16.84 },
    VELOCITY_DISSIPATION: { value: 0.18 },
    DENSITY_DISSIPATION: { value: 0.09 },
  };
  this.onResolutionChange = () => {
    initFrameBuffers();
  };
  const uniforms = this.uniforms;
  this.uniformsDic = {};
  const uniformDic = this.uniformsDic;
  this.renderTargets = {};

  this.materialDic = {};
  const materialDic = this.materialDic;

  const renderTargets = this.renderTargets;
  initFrameBuffers(true);
  initMaterial();
  initDefaultValue();
  this.fsQuad = new Pass.FullScreenQuad(materialDic['copy']);

  function initDefaultValue() { }

  function initFrameBuffers(isFirstTime) {
    var dyeRes = getScreenSize(uniforms.dye_Resolution.value);
    var simRes = getScreenSize(uniforms.sim_Resolution.value);
    console.log(simRes);
    console.log(uniforms.dye_Resolution.value);
    console.log(uniforms.sim_Resolution.value);
    if (isFirstTime) {
      renderTargets['dye'] = createDoubleRenderTarget(
        dyeRes.width,
        dyeRes.height,
        'dye',
        THREE.RGBAFormat,
      );
      renderTargets['velocity'] = createDoubleRenderTarget(
        simRes.width,
        simRes.height,
        'velocity',
        THREE.RGBFormat,
      );
      renderTargets['divergence'] = createRenderTarget(
        simRes.width,
        simRes.height,
        'divergence',
        THREE.RedFormat,
        THREE.NearestFilter,
      );
      renderTargets['curl'] = createRenderTarget(
        simRes.width,
        simRes.height,
        'curl',
        THREE.RedFormat,
        THREE.NearestFilter,
      );
      renderTargets['pressure'] = createDoubleRenderTarget(
        simRes.width,
        simRes.height,
        'pressure',
        THREE.RedFormat,
        THREE.NearestFilter,
      );
    } else {
      renderTargets['dye'].resize(dyeRes.width, dyeRes.height);
      renderTargets['velocity'].resize(simRes.width, simRes.height);
      renderTargets['divergence'].resize(simRes.width, simRes.height);
      renderTargets['curl'].resize(simRes.width, simRes.height);
      renderTargets['pressure'].resize(simRes.width, simRes.height);
    }

    function createMaterialShader(shader) {
      new ShaderMaterial({
        defines: Object.assign({}, shader.defines),
        uniforms: shader.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
      });
    }

    function createRenderTarget(w, h, name, format, filter) {
      filter = filter || THREE.LinearFilter;
      var tex1 = new WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: filter,
        format: format,
        type: THREE.HalfFloatType,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      });
      tex1.texture.name = name;

      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return tex1;
        },
        set read(value) {
          tex1 = value;
        },
        resize: function (w, h) {
          tex1.setSize(w, h);
          this.width = w;
          this.height = h;
          this.texelSizeX = 1.0 / w;
          this.texelSizeY = 1.0 / h;
        },
      };
    }

    function createDoubleRenderTarget(w, h, name, format, filter) {
      filter = filter || THREE.LinearFilter;
      var tex1 = new WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: filter,
        format: format,
        type: THREE.HalfFloatType,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      });
      var tex2 = new WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: filter,
        format: format,
        type: THREE.HalfFloatType,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      });
      tex1.texture.name = name;
      tex2.texture.name = name;
      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return tex1;
        },
        set read(value) {
          tex1 = value;
        },
        get write() {
          return tex2;
        },
        set write(value) {
          tex2 = value;
        },
        swap: function () {
          var temp = tex1;
          tex1 = tex2;
          tex2 = temp;
        },
        resize: function (w, h) {
          tex1.setSize(w, h);
          tex2.setSize(w, h);
          this.width = w;
          this.height = h;
          this.texelSizeX = 1.0 / w;
          this.texelSizeY = 1.0 / h;
        },
      };
    }
  }
  function initMaterial() {
    materialDic['splat'] = new ShaderMaterial(new SplatShader());
    materialDic['copy'] = new ShaderMaterial(new CopyShader());
    materialDic['copyTex'] = new ShaderMaterial(new CopyShader());
    materialDic['curl'] = new ShaderMaterial(new CurlShader());
    materialDic['VorticityShader'] = new ShaderMaterial(new VorticityShader());
    materialDic['divergence'] = new ShaderMaterial(new DivergenceShader());
    materialDic['pressure'] = new ShaderMaterial(new PressureShader());
    materialDic['gradiensubtract'] = new ShaderMaterial(new GradienSubtractShader());
    materialDic['advectionShader'] = new ShaderMaterial(new AdvectionShader());
  }
  function getScreenSize(resolution) {
    var aspectRatio = uniforms.screenSize.x / uniforms.screenSize.y;
    aspectRatio = aspectRatio > 0 ? aspectRatio : 1.0 / aspectRatio;

    var min = Math.round(resolution);
    var max = Math.round(resolution * aspectRatio);
    if (window.innerWidth > window.innerHeight) {
      return { width: max, height: min };
    } else {
      return { width: min, height: max };
    }
  }
};

WaterSimulationPass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: WaterSimulationPass,

  render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
    var uniforms = this.uniforms;
    var materialDic = this.materialDic;
    var renderTargets = this.renderTargets;
    var fsQuad = this.fsQuad;
    var deltaTime = calDeltaTime();
    if (uniforms.clearRT) {
      uniforms.clearRT = false;
      clearRT();
      console.log('清除纹理');
    }
    if (uniforms.isRandomColor.value) {
      updateColors();
    }
    applyInputs();

    if (!uniforms.isPause.value) {
      updateRT();
    }

    if (uniforms.isCopy.value) {
      CopyTexture();
    }

    function calDeltaTime() {
      var now = Date.now();
      var delta = (now - uniforms.lastUpdateTime) / 1000;
      delta = Math.min(delta, 0.016666);
      uniforms.lastUpdateTime = now;
      return delta;
    }

    function updateColors() {
      uniforms.isRandomColor.timer += deltaTime * uniforms.isRandomColor.updateSpeed;
      if (uniforms.isRandomColor.timer >= 1) {
        uniforms.isRandomColor.timer = wrap(uniforms.isRandomColor.timer, 0, 1);
        uniforms.points.value.forEach(function (p) {
          p.color = generateColor();
        });
      }
    }

    function applyInputs() {
      //随机点
      multipleRandomSplat();
      multipleStaticInputSplat();

      function multipleRandomSplat() {
        if (uniforms.splatStack.value.length === 0) return;
        const pointsNum = uniforms.splatStack.value.pop();
        var ps = [];
        for (var i = 0; i < pointsNum; i++) {
          var color = generateColor();
          color.r *= 10.0;
          color.g *= 10.0;
          color.b *= 10.0;
          var p = new WaterSimulationPoint();
          p.color = new Vector3(color.r, color.g, color.b);
          p.pos.set(Math.random(), Math.random());
          var dx = uniforms.SPLAT_MULTIPLY_FORCE.value * (Math.random() - 0.5);
          var dy = uniforms.SPLAT_MULTIPLY_FORCE.value * (Math.random() - 0.5);
          p.dPos.set(dx, dy);
          p.isShow = true;
          p.R =
            (uniforms.SPLAT_MULTIPLY_STATIC_RADIU.value ? Math.random() : 1) *
            uniforms.SPLAT_MULTIPLY_RADIUS.value;
          ps.push(p);
        }
        splatPoints(ps);
      }
      function multipleStaticInputSplat() {
        if (uniforms.isPause.value) return;
        if (!uniforms.SPLAT_STATIC_UPDATE.value) return;

        // uniforms.SPLAT_STATIC_UPDATE.value = false;
        var isShowCount = 0;
        for (let index = 0; index < uniforms.staticInputs.value.length; index++) {
          const p = uniforms.staticInputs.value[index];
          if (p.isShow) {
            isShowCount++;
            p.animate(deltaTime);
          }
        }
        if (isShowCount > 0) {
          var matD = { dye: uniforms.applyDyeMaterial, velocity: uniforms.applyVelocityMaterial };
          splatPoints(uniforms.staticInputs.value, matD);
          // console.log("展示静态")
        }
      }
      function splatPoints(ps, material) {
        if (ps.length > 10) {
          console.log('点数超过10个');
        }
        material = material || { dye: null, velocity: null };
        material.dye = material.dye || materialDic['splat'];
        material.velocity = material.velocity || materialDic['splat'];
        var velocityRTD = renderTargets['velocity'];

        material.dye.uniforms.screenSize.value.set(velocityRTD.width, velocityRTD.height);
        material.dye.uniforms.texelSize.value.set(velocityRTD.texelSizeX, velocityRTD.texelSizeY);
        material.velocity.uniforms.screenSize.value.set(velocityRTD.width, velocityRTD.height);
        material.velocity.uniforms.texelSize.value.set(
          velocityRTD.texelSizeX,
          velocityRTD.texelSizeY,
        );
        var splatU;
        splatVelocity();
        splatDYE();
        function splatVelocity() {
          splatU = material.velocity.uniforms;
          fsQuad._mesh.material = material.velocity;
          splatU.points.value.forEach(p => {
            p.set(0, 0, 0, 0);
          });
          splatU.colors.value.forEach(p => {
            p.set(0, 0, 0);
          });
          for (var index in ps) {
            var p = ps[index];
            splatU.points.value[index].set(p.pos.x, p.pos.y, p.R / 100, p.isShow + 0);
            splatU.colors.value[index].set(p.dPos.x * p.dPower, p.dPos.y * p.dPower, 0, 1);
          }
          splatU.readTex.value = velocityRTD.read.texture;
          renderer.setRenderTarget(velocityRTD.write);
          fsQuad.render(renderer);
          velocityRTD.swap();
        }

        function splatDYE() {
          splatU = material.dye.uniforms;
          fsQuad._mesh.material = material.dye;
          var dyeRTD = renderTargets['dye'];
          splatU.readTex.value = dyeRTD.read.texture;
          renderer.setRenderTarget(dyeRTD.write);
          for (var index in ps) {
            var p = ps[index];
            splatU.colors.value[index].set(
              p.color.x * p.colorPower,
              p.color.y * p.colorPower,
              p.color.z * p.colorPower,
              p.colorPower,
            );
          }
          // console.log(ps);
          fsQuad.render(renderer);
          dyeRTD.swap();
        }
      }
      //动点
      // uniforms.points.forEach((p) => {
      //     if (p.moved) {
      //         p.moved = false;
      //         pointsData.push(splatPointer(p));
      //     }
      // })
      // if (pointsData.length != 0) {
      //     splat(pointsData,uniforms.SPLAT_RADIUS.value);
      // }
      // //静点
      // pointsData = [];
      // uniforms.staticInputs.forEach((p)=>
      // {
      //     pointsData.push(splatPointer(p));
      // });
      // if (pointsData.length != 0) {
      //     splat(pointsData);
      // }

      function splatPointer(pointer) {
        var dx = pointer.deltaX * uniforms.SPLAT_FORCE.value;
        var dy = pointer.deltaY * uniforms.SPLAT_FORCE.value;
        var x = pointer.texcoordX;
        var y = pointer.texcoordY;
        var color = pointer.color;
        return { x, y, dx, dy, color };
      }
      //************************************************************** */
      function splat(ps, radius) {
        if (ps.length > 10) {
          console.log('点数超过10个');
        }
        var splatMaterial = materialDic['splat'];
        var splatU = splatMaterial.uniforms;
        var velocityRTD = renderTargets['velocity'];

        splatU.screenSize.value.set(velocityRTD.width, velocityRTD.height);
        splatU.texelSize.value.set(velocityRTD.texelSizeX, velocityRTD.texelSizeY);
        splatU.points.value.forEach(p => {
          p.set(0, 0, 0);
        });
        splatU.colors.value.forEach(p => {
          p.set(0, 0, 0);
        });
        splatU.radius.value = radius / 100;
        for (var index in ps) {
          var p = ps[index];
          splatU.points.value[index].set(p.x, p.y, 1);
          splatU.colors.value[index].set(p.dx, p.dy, 0);
        }

        splatU.readTex.value = velocityRTD.read.texture;
        renderer.setRenderTarget(velocityRTD.write);
        fsQuad._mesh.material = splatMaterial;
        fsQuad.render(renderer);
        velocityRTD.swap();

        var dyeRTD = renderTargets['dye'];
        splatU.readTex.value = dyeRTD.read.texture;
        renderer.setRenderTarget(dyeRTD.write);
        for (var index in ps) {
          var p = ps[index];
          splatU.colors.value[index].set(
            p.color.r * p.colorPower,
            p.color.g * p.colorPower,
            p.color.b * p.colorPower,
          );
        }
        // console.log(ps);
        fsQuad.render(renderer);
        dyeRTD.swap();
      }
    }

    function updateRT() {
      var dyeRTD = renderTargets['dye'];
      var curlRT = renderTargets['curl'].read;
      var velocityRTD = renderTargets['velocity'];
      var divergenceRT = renderTargets['divergence'].read;
      var pressureRTD = renderTargets['pressure'];
      var screenSize = uniforms.screenSize;

      var texelSize = new Vector2(velocityRTD.texelSizeX, velocityRTD.texelSizeY);
      //前进峰
      renderCurl();
      //交界湍流
      renderVorticityShader();
      // //扩散
      renderDivergence();
      // //压力
      renderPressure();

      renderGradienSubtract();

      renderAdvection();
      // uniforms.isPause.value = true;

      function renderCurl() {
        var curlU = materialDic['curl'].uniforms;
        curlU.texelSize.value = texelSize;
        curlU.velocityTex.value = velocityRTD.read.texture;
        fsQuad._mesh.material = materialDic['curl'];
        renderer.setRenderTarget(curlRT);
        fsQuad.render(renderer);
      }
      function renderVorticityShader() {
        var velMat = materialDic['VorticityShader'];
        renderer.setRenderTarget(velocityRTD.write);
        var velU = velMat.uniforms;
        velU.texelSize.value = texelSize;
        velU.velocityTex.value = velocityRTD.read.texture;
        velU.curlTex.value = curlRT.texture;
        velU.deltaTime.value = deltaTime;
        velU.curlS.value = uniforms.CURL.value;

        fsQuad._mesh.material = velMat;
        fsQuad.render(renderer);
        velocityRTD.swap();
      }
      function renderDivergence() {
        var divergenceMat = materialDic['divergence'];
        var divU = divergenceMat.uniforms;
        divU.texelSize.value = texelSize;
        divU.velocityTex.value = velocityRTD.read.texture;
        // console.log(divU)

        renderer.setRenderTarget(divergenceRT);
        fsQuad._mesh.material = divergenceMat;
        fsQuad.render(renderer);
      }
      function renderPressure() {
        //衰减复制
        var copyM = materialDic['copy'];
        copyM.uniforms.tDiffuse.value = pressureRTD.read.texture;
        copyM.uniforms.scale.value = uniforms.PRESSURE.value;
        renderer.setRenderTarget(pressureRTD.write);
        fsQuad._mesh.material = copyM;
        fsQuad.render(renderer);
        pressureRTD.swap();

        var pressureMat = materialDic['pressure'];
        fsQuad._mesh.material = pressureMat;
        pressureMat.uniforms.texelSize.value = texelSize;
        pressureMat.uniforms['divergenceTex'].value = divergenceRT.texture;
        for (let index = 0; index < uniforms.PRESSURE_ITERATIONS.value; index++) {
          pressureMat.uniforms['pressureTex'].value = pressureRTD.read.texture;
          renderer.setRenderTarget(pressureRTD.write);
          fsQuad.render(renderer);
          pressureRTD.swap();
        }
      }
      function renderGradienSubtract() {
        var gsMat = materialDic['gradiensubtract'];
        gsMat.uniforms.texelSize.value = texelSize;
        gsMat.uniforms.pressureTex.value = pressureRTD.read.texture;
        gsMat.uniforms.velocityTex.value = velocityRTD.read.texture;
        renderer.setRenderTarget(velocityRTD.write);
        fsQuad._mesh.material = gsMat;
        fsQuad.render(renderer);
        velocityRTD.swap();
      }
      function renderAdvection() {
        var advecMat = materialDic['advectionShader'];
        // console.log(advecMat);
        var advecU = advecMat.uniforms;
        advecU.texelSize.value = texelSize;
        advecU.velocityTex.value = velocityRTD.read.texture;
        advecU.sourceTex.value = velocityRTD.read.texture;
        advecU.deltaTime.value = deltaTime;
        advecU.dissipation.value = uniforms.VELOCITY_DISSIPATION.value;
        // console.log(advecU);

        renderer.setRenderTarget(velocityRTD.write);
        fsQuad._mesh.material = advecMat;
        fsQuad.render(renderer);
        velocityRTD.swap();

        advecU.velocityTex.value = velocityRTD.read.texture;
        advecU.sourceTex.value = dyeRTD.read.texture;
        advecU.dissipation.value = uniforms.DENSITY_DISSIPATION.value;

        renderer.setRenderTarget(dyeRTD.write);
        fsQuad.render(renderer);
        dyeRTD.swap();
      }
    }

    function clearRT() {
      for (var key in renderTargets) {
        renderer.setRenderTarget(renderTargets[key].read);
        renderer.clear();
        renderer.setRenderTarget(renderTargets[key].write);
        renderer.clear();
      }
    }
    function generateColor() {
      var c = HSVtoRGB(Math.random(), 1.0, 1.0);
      c.r *= 0.15;
      c.g *= 0.15;
      c.b *= 0.15;

      function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        switch (i % 6) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;
          case 1:
            r = q;
            g = v;
            b = p;
            break;
          case 2:
            r = p;
            g = v;
            b = t;
            break;
          case 3:
            r = p;
            g = q;
            b = v;
            break;
          case 4:
            r = t;
            g = p;
            b = v;
            break;
          case 5:
            r = v;
            g = p;
            b = q;
            break;
        }

        return {
          r: r,
          g: g,
          b: b,
        };
      }

      return new THREE.Color(c.r, c.g, c.b);
    }
    function wrap(value, min, max) {
      var range = max - min;
      if (range == 0) {
        return min;
      }
      return ((value - min) % range) + min;
    }

    function CopyTexture() {
      //Copy
      var copyRTName = 'velocity';
      var copyScale = 1.0;
      var copyAdd = 0;
      uniforms.show_Index.value = Number(uniforms.show_Index.value);
      switch (uniforms.show_Index.value) {
        case 1:
          copyRTName = 'velocity';
          break;
        case 2:
          copyRTName = 'dye';
          break;
        case 3:
          copyRTName = 'curl';
          copyScale = 1;
          break;
        case 4:
          copyRTName = 'divergence';
          copyScale = 10.0;
          break;
        case 5:
          copyRTName = 'pressure';
          copyScale = -10.0;
          break;
        default:
          break;
      }
      // console.log(copyRTName);
      renderer.setRenderTarget(null);
      renderer.clear();
      var isIC = uniforms.isCopyInverse.value ? -1 : 1;
      materialDic['copyTex'].uniforms.scale.value = copyScale * isIC;
      materialDic['copyTex'].uniforms.addValue.value = copyAdd;
      fsQuad._mesh.material = materialDic['copyTex'];
      materialDic['copyTex'].uniforms.tDiffuse.value = renderTargets[copyRTName].read.texture;
      fsQuad.render(renderer);
    }

    //readBuffer.texture

    // this.fsQuad.material = this.material;
    // renderer.setRenderTarget( writeBuffer );
    // // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
    // if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
    // this.fsQuad.render( renderer );
  },
});

var WaterSimulationPoint = function () {
  this.pos = new Vector2(0.5, 0.5);
  this.R = 0.25;
  this.dPos = new Vector2(0, 0);
  this.dPower = 1;
  this.color = new Vector3(1, 1, 1);
  this.colorPower = 1;
  this.isMove = false;
  this.isShow = false;
  this.name = null;
  this.animate = deltaTime => { };
  this.initGUI = function (gui, folder) {
    if (this.name) {
      folder = gui.addFolder({ key: this.name, isOpen: true }, folder);
    }
    var posData = {
      uniform: { value: this.pos },
      key: 'Pos',
      infos: [
        { displayName: 'PosX', isSlider: true },
        { displayName: 'PosY', isSlider: true },
      ],
    };
    gui.addValue(posData, folder);

    var rData = {
      uniform: { value: this.R },
      info: { displayName: 'R', isSlider: true, delta: 0.001 },
      onChange: value => {
        this.R = value;
      },
    };
    gui.addValue(rData, folder);

    var dirData = {
      uniform: { value: this.dPos },
      key: 'dir',
      infos: [
        { displayName: '方向X', min: -1, delta: 0.001, isSlider: true },
        { displayName: '方向Y', min: -1, delta: 0.001, isSlider: true },
      ],
    };
    gui.addValue(dirData, folder);

    var dPowerData = {
      uniform: { value: this.dPower },
      info: { displayName: '强度', max: 100, isSlider: true },
      onChange: value => {
        this.dPower = value;
      },
    };
    gui.addValue(dPowerData, folder);

    var colorData = { uniform: { value: this.color }, type: 'color', key: '颜色' };
    gui.addValue(colorData, folder);

    var colorPData = {
      uniform: { value: this.colorPower },
      key: '颜色强度',
      info: { displayName: '颜色强度', isSlider: true, delta: 0.001 },
      onChange: value => {
        this.colorPower = value;
      },
    };
    gui.addValue(colorPData, folder);

    var showData = {
      uniform: { value: this.isShow },
      info: { displayName: '是否显示' },
      onChange: value => {
        this.isShow = value;
      },
    };
    gui.addValue(showData, folder);
  };
};

export { WaterSimulationPass, WaterSimulationPoint };

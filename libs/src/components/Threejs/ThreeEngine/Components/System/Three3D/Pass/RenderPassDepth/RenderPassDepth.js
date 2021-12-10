import { Color, DepthFormat, DepthTexture, NearestFilter, RGBFormat, ShaderMaterial, UnsignedIntType, WebGLRenderTarget } from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";


var RenderPassDepth = function (scene, camera, resolution, overrideMaterial, clearColor, clearAlpha) {

  Pass.call(this);

  this.scene = scene;
  this.camera = camera;

  this.overrideMaterial = overrideMaterial;

  this.clearColor = clearColor;
  this.clearAlpha = (clearAlpha !== undefined) ? clearAlpha : 0;

  this.clear = true;
  this.clearDepth = false;
  this.needsSwap = false;
  this._oldClearColor = new Color();

  this.renderTarget = new WebGLRenderTarget(resolution.x, resolution.y);
  const target = this.renderTarget;
  target.texture.format = RGBFormat;
  target.texture.minFilter = NearestFilter;
  target.texture.magFilter = NearestFilter;
  target.texture.generateMipmaps = false;
  target.stencilBuffer = true;
  target.depthBuffer = true;
  target.depthTexture = new DepthTexture();
  target.depthTexture.format = DepthFormat;
  target.depthTexture.type = UnsignedIntType;

  this.copyMaterial = new ShaderMaterial(CopyShader);
  this.copyMaterial.uniforms.tDiffuse.value = target.texture;
  this.fsQuad = new Pass.FullScreenQuad(this.copyMaterial);


};

RenderPassDepth.prototype = Object.assign(Object.create(Pass.prototype), {

  constructor: RenderPassDepth,

  render: function (renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {

    var oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    var oldClearAlpha, oldOverrideMaterial;

    if (this.overrideMaterial !== undefined) {

      oldOverrideMaterial = this.scene.overrideMaterial;

      this.scene.overrideMaterial = this.overrideMaterial;

    }

    if (this.clearColor) {

      renderer.getClearColor(this._oldClearColor);
      oldClearAlpha = renderer.getClearAlpha();

      renderer.setClearColor(this.clearColor, this.clearAlpha);

    }

    if (this.clearDepth) {

      renderer.clearDepth();

    }

    renderer.setRenderTarget(this.renderTarget);

    // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
    if (this.clear) renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    renderer.render(this.scene, this.camera);

    if (this.clearColor) {

      renderer.setClearColor(this._oldClearColor, oldClearAlpha);

    }

    if (this.overrideMaterial !== undefined) {

      this.scene.overrideMaterial = oldOverrideMaterial;

    }

    renderer.autoClear = oldAutoClear;

    if (this.renderToScreen) {

      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);

    } else {

      renderer.setRenderTarget(readBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);

    }

  }

});



export { RenderPassDepth };

import { Color, DepthTexture, LinearFilter, Matrix4, Mesh, PerspectiveCamera, Plane, RGBFormat, ShaderMaterial, UnsignedShortType, Vector3, Vector4, WebGLRenderTarget } from "three";
import { Math as MathT, UniformsUtils } from "three/build/three.module";

var ReflectorFade = function (geometry, options) {
	Mesh.call(this, geometry);

	this.type = 'ReflectorFade';

	var scope = this;

	options = options || {};

	var color = (options.color !== undefined) ? new Color(options.color) : new Color(0x7F7F7F);
	var textureWidth = options.textureWidth || 512;
	var textureHeight = options.textureHeight || 512;
	var clipBias = options.clipBias || 0;
	var shader = options.shader || ReflectorFade.ReflectorShader;

	//
	var reflectorPlane = new Plane();
	var normal = new Vector3();
	var reflectorWorldPosition = new Vector3();
	var cameraWorldPosition = new Vector3();
	var rotationMatrix = new Matrix4();
	var lookAtPosition = new Vector3(0, 0, - 1);
	var clipPlane = new Vector4();
	var viewport = new Vector4();

	var view = new Vector3();
	var target = new Vector3();
	var q = new Vector4();

	var textureMatrix = new Matrix4();
	var virtualCamera = new PerspectiveCamera();

	var parameters = {
		minFilter: LinearFilter,
		magFilter: LinearFilter,
		format: RGBFormat,
		stencilBuffer: false
	};

	var renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);

	renderTarget.depthBuffer = true;
	renderTarget.depthTexture = new DepthTexture();
	renderTarget.depthTexture.type = UnsignedShortType;

	if (!MathT.isPowerOfTwo(textureWidth) || !MathT.isPowerOfTwo(textureHeight)) {

		renderTarget.texture.generateMipmaps = false;

	}

	var material = new ShaderMaterial({
		uniforms: UniformsUtils.clone(shader.uniforms),
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		transparent: true
	});

	material.uniforms.tDiffuse.value = renderTarget.texture;
	material.uniforms.tDepth.value = renderTarget.depthTexture;
	material.uniforms.color.value = color;
	material.uniforms.textureMatrix.value = textureMatrix;

	this.material = material;

	material.uniforms['farFade'] = { value: 1 };
	this.onBeforeRender = function (renderer, scene, camera) {

		reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
		cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

		rotationMatrix.extractRotation(scope.matrixWorld);

		normal.set(0, 0, 1);
		normal.applyMatrix4(rotationMatrix);

		view.subVectors(reflectorWorldPosition, cameraWorldPosition);

		// Avoid rendering when reflector is facing away

		if (view.dot(normal) > 0) return;

		view.reflect(normal).negate();
		view.add(reflectorWorldPosition);

		rotationMatrix.extractRotation(camera.matrixWorld);

		lookAtPosition.set(0, 0, - 1);
		lookAtPosition.applyMatrix4(rotationMatrix);
		lookAtPosition.add(cameraWorldPosition);

		target.subVectors(reflectorWorldPosition, lookAtPosition);
		target.reflect(normal).negate();
		target.add(reflectorWorldPosition);

		virtualCamera.position.copy(view);
		virtualCamera.up.set(0, 1, 0);
		virtualCamera.up.applyMatrix4(rotationMatrix);
		virtualCamera.up.reflect(normal);
		virtualCamera.lookAt(target);

		virtualCamera.far = camera.far; // Used in WebGLBackground

		virtualCamera.updateMatrixWorld();
		virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

		this.material.uniforms.cameraNear.value = camera.near;
		this.material.uniforms.cameraFar.value = camera.far;

		// Update the texture matrix
		textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		textureMatrix.multiply(virtualCamera.projectionMatrix);
		textureMatrix.multiply(virtualCamera.matrixWorldInverse);
		textureMatrix.multiply(scope.matrixWorld);

		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
		reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

		clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

		var projectionMatrix = virtualCamera.projectionMatrix;

		q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
		q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
		q.z = - 1.0;
		q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

		// Calculate the scaled plane vector
		clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

		// Replacing the third row of the projection matrix
		projectionMatrix.elements[2] = clipPlane.x;
		projectionMatrix.elements[6] = clipPlane.y;
		projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
		projectionMatrix.elements[14] = clipPlane.w;

		// Render

		renderTarget.texture.encoding = renderer.outputEncoding;

		scope.visible = false;

		var currentRenderTarget = renderer.getRenderTarget();

		var currentXrEnabled = renderer.xr.enabled;
		var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

		renderer.xr.enabled = false; // Avoid camera modification
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

		renderer.setRenderTarget(renderTarget);

		renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

		if (renderer.autoClear === false) renderer.clear();
		renderer.render(scene, virtualCamera);

		renderer.xr.enabled = currentXrEnabled;
		renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

		renderer.setRenderTarget(currentRenderTarget);
		// Restore viewport

		var bounds = camera.bounds;

		if (bounds !== undefined) {

			var size = renderer.getSize();
			var pixelRatio = renderer.getPixelRatio();

			viewport.x = bounds.x * size.width * pixelRatio;
			viewport.y = bounds.y * size.height * pixelRatio;
			viewport.z = bounds.z * size.width * pixelRatio;
			viewport.w = bounds.w * size.height * pixelRatio;

			renderer.state.viewport(viewport);

		}

		scope.visible = true;

	};

	this.getRenderTarget = function () {

		return renderTarget;

	};

};

ReflectorFade.prototype = Object.create(Mesh.prototype);
ReflectorFade.prototype.constructor = ReflectorFade;

ReflectorFade.ReflectorShader = {

	uniforms: {

		'color': {
			type: 'c',
			value: null
		},

		'tDiffuse': {
			type: 't',
			value: null
		},

		'tDepth': {
			type: 't',
			value: null
		},

		'textureMatrix': {
			type: 'm4',
			value: null
		},

		'cameraNear': {
			type: 'f',
			value: 0
		},

		'cameraFar': {
			type: 'f',
			value: 0
		},

	},

	vertexShader: [
		'uniform mat4 textureMatrix;',
		'varying vec4 vUv;',

		'void main() {',

		'	vUv = textureMatrix * vec4( position, 1.0 );',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join('\n'),

	fragmentShader: [
		'#include <packing>',
		'uniform vec3 color;',
		'uniform sampler2D tDiffuse;',
		'uniform sampler2D tDepth;',
		'uniform float cameraNear;',
		'uniform float cameraFar;',
		'uniform float farFade;',
		'varying vec4 vUv;',

		'float blendOverlay( float base, float blend ) {',

		'	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',

		'}',

		'vec3 blendOverlay( vec3 base, vec3 blend ) {',

		'	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',

		'}',

		'float readDepth( sampler2D depthSampler, vec4 coord ) {',

		'	float fragCoordZ = texture2DProj( depthSampler, coord ).x;',
		'	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );',
		'	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );',

		'}',

		'void main() {',

		'	vec4 base = texture2DProj( tDiffuse, vUv );',
		' float depth = readDepth( tDepth, vUv )*pow(10.0,farFade);',
		'	gl_FragColor = vec4( blendOverlay( base.rgb, color ), (1.0 - ( depth * 7000.0 )) );',

		'}'
	].join('\n')
};

export { ReflectorFade }
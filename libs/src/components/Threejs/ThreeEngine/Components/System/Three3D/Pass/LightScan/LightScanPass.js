import { DepthFormat, NoBlending, RGBADepthPacking, UnsignedIntType } from "three";
import { Color, DepthTexture, Matrix4, MeshDepthMaterial, ShaderMaterial, Vector2, Vector3, Vector4, WebGLRenderTarget } from "three/build/three.module";
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

var LightScanPass = function (resolution, scene, camera, time) {
	Pass.call(this);
	this._depthRT = new WebGLRenderTarget(resolution.x, resolution.y);
	this._depthRT.texture.generateMipmaps = false;
	this._depthRT.stencilBuffer = false;
	this._depthRT.depthBuffer = true;
	this._depthRT.depthTexture = new DepthTexture();
	this._depthRT.depthTexture.format = DepthFormat;
	this._depthRT.depthTexture.type = UnsignedIntType;


	this._scene = scene;
	this._camera = camera;
	this._scanMaterial = new ShaderMaterial(createLightScanShader(time));
	this.uniforms = this._scanMaterial.uniforms;
	this.fsQuad = new Pass.FullScreenQuad(null);

	this.depthMaterial = new MeshDepthMaterial();
	this.depthMaterial.depthPacking = RGBADepthPacking;
	this.depthMaterial.blending = NoBlending;

	this.oldClearColor = new Color();
	this.oldClearAlpha = 1;

	this._stopRender = false;
	this.depthTexture = null;






}
LightScanPass.prototype = Object.assign(Object.create(Pass.prototype), {

	constructor: LightScanPass,
	dispose: function () {

	},
	setSize: function (width, height) {

	},
	render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
		if (this._stopRender) return;
		var uniforms = this.uniforms;
		var camera = this._camera;

		renderer.getClearColor(this.oldClearColor);
		this.oldClearAlpha = renderer.getClearAlpha();
		if (this.depthTexture) {
			renderer.setRenderTarget(null);
			uniforms._depthTex.value = this.depthTexture;

		}
		else {
			//渲染深度
			renderer.setClearColor(0x000000, 1);
			this._scene.overrideMaterial = this.depthMaterial;
			renderer.setRenderTarget(this._depthRT);
			renderer.clear();
			renderer.render(this._scene, this._camera);
			uniforms._depthTex.value = this._depthRT.depthTexture;
		}
		renderer.setClearColor(this.oldRenderClearColor, this.oldClearAlpha);
		this._scene.overrideMaterial = null;

		uniforms._projectionInverse.value.copy(camera.projectionMatrixInverse);
		uniforms._matrixWorld.value.copy(camera.matrixWorld);
		uniforms._far.value = this._camera.far;
		uniforms._near.value = this._camera.near;

		uniforms._tDiffuse.value = readBuffer.texture;

		this.fsQuad.material = this._scanMaterial;



		if (this.renderToScreen) {

			renderer.setRenderTarget(null);
			this.fsQuad.render(renderer);

		} else {
			renderer.setRenderTarget(writeBuffer);
			this.fsQuad.render(renderer);
		}














	},






});



var createLightScanShader = function (time) {
	var defines = {
		'DEPTH_PACKING': 0,
		'PERSPECTIVE_CAMERA': 1,
	};
	var uniforms = {
		_tDiffuse: { value: undefined },
		_depthTex: { value: undefined },
		_matrixWorld: { value: new Matrix4() },
		_projectionInverse: { value: new Matrix4() },
		_far: { value: 0 },
		_near: { value: 0 },

		_scanCenter: { value: new Vector3(0, 0, 0) },
		_scanDistance: { value: 5000 },
		_scanHeight: { value: new Vector2(-5, 200) },
		_scanColor: { value: new Color(0xd0e0e3) },
		_scanPower: { value: 0.5 },
		_time: time,

		// x angle y length z percent w speed
		_scanOp: { value: new Vector4(0, 8000, 0.1, 2000) },
	}
	var vertexShader = `
		varying vec2 vUv;
		
		void main(){
			vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`;
	var fragmentShader = `
		#include <packing>
		uniform sampler2D _depthTex;
		uniform sampler2D _tDiffuse;
		uniform mat4 _matrixWorld;
		uniform mat4 _projectionInverse;
		uniform float _far;
		uniform float _near;
		uniform vec3 _scanCenter;
		uniform vec3 _scanColor;
		uniform float _scanPower;
		uniform float _scanDistance;
		uniform vec2 _scanHeight;
		uniform vec4 _scanOp;
		uniform float _time;
		varying vec2 vUv;

		float getDepth(const in vec2 screenPos){
			#if DEPTH_PACKING ==1
				return unpackRGBAToDepth(texture2D(_depthTex,screenPos));
			#else
				return texture2D(_depthTex,screenPos).x;
			#endif
		}
		float getViewZ(const in float depth){
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ( depth, _near, _far );
			#else
				return orthographicDepthToViewZ( depth, _near, _far );
			#endif
		}
		vec4 computeWorldPosition4(){
			//采样深度
			float normalizedDepth = getDepth(vUv);

			float viewZ = getViewZ(normalizedDepth);
			//Linear depth 0~1
			float d = viewZToOrthographicDepth( viewZ, _near, _far );
			//裁剪空间坐标
			vec4 ndc = vec4(
				(vUv.x - 0.5) * 2.0,
				(vUv.y - 0.5) * 2.0,
				(normalizedDepth - 0.5) * 2.0,
				1.0);
			//投影到camera模型
			vec4 clip = _projectionInverse*ndc;
			//模型到世界
			vec3 worldPos = (_matrixWorld*clip/clip.w).xyz;
			
			

			return vec4(worldPos,d);
		}

    
		vec4 getScanColor(const in vec4 worldPos){
			//计算是否显示*****************************************************
			//高度
			float isScan = step(_scanHeight.x+_scanCenter.y,worldPos.y)*step(worldPos.y,_scanHeight.y+_scanCenter.y);
			//半径
			vec2 dp = worldPos.xz-_scanCenter.xz;
			isScan*=step(dp.x*dp.x+dp.y*dp.y,_scanDistance*_scanDistance);
			isScan*=step(worldPos.w,0.999999);

			float angle = -_scanOp.x/180.*3.14159265359;
			vec2 sPos;
			sPos.x = worldPos.x*cos(angle)+worldPos.z*sin(angle);
			sPos.y = worldPos.z*cos(angle)-worldPos.x*sin(angle);
			float scanLine = mod(sPos.x-_time*_scanOp.w,_scanOp.y)/_scanOp.y;
			scanLine = max((scanLine-1.+_scanOp.z)/_scanOp.z,0.);


			isScan*=scanLine;
			//计算是否显示*****************************************************
			//计算颜色************************************
			vec3 col = vec3(_scanColor);

			//计算颜色************************************
			

			return vec4(col*_scanPower,isScan);
		}
		
		void main(){
			vec3 originCol = texture2D(_tDiffuse,vUv).rgb;
			vec4 worldPos = computeWorldPosition4();
			

			vec4 scanColor = getScanColor(worldPos);
			vec3 _col;
			_col = scanColor.xyz*scanColor.w+originCol;
			gl_FragColor = vec4(_col,1.0);


			// vec3 worldPosition = computeWorldPosition4();
      // gl_FragColor = vec4( visualizePosition(worldPosition), 1.0);
		}


	`;

	return {
		defines,
		uniforms,
		vertexShader,
		fragmentShader,
		lights: false,
		depthTest: false,
		depthWrite: false,
		transparent: true,
		vertexColors: false
	}
}



export { LightScanPass };
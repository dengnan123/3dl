import { Group, InstancedMesh, LineCurve3, ShaderChunk, Vector3 } from 'three';
import { ShaderMaterial, TubeBufferGeometry } from 'three/build/three.module';
import { ThreeObject } from '../../../Object/ThreeObject';
class TubeInstance extends ThreeObject {
  constructor(infos = TubeInstance.static_Infos) {
    super();
    infos = Object.assign(TubeInstance.static_Infos, infos);
    this.#group.name = "TubeInstance";
    const curve = new LineCurve3(new Vector3(0, 0, 0), new Vector3(0, 0, -1));
    const geo = new TubeBufferGeometry(curve, infos.segment, infos.radius, infos.radiusSegment);
    const shader = createShader();
    const material = new ShaderMaterial(shader);
    material.onBeforeCompile = (shader) => {
      shader.uniforms = Object.assign(shader.uniforms, this.uniforms);
      shader.vertexShader = shader.vertexShader.replace("<mainVertex_Uni>", this.mainVertex_Uni).replace("<mainVertex>", this.mainVertex_Uni);
      shader.fragmentShader = shader.fragmentShader.replace("<mainFragment_Uni>", this.mainFragment_Uni).replace("<mainFragment>", this.mainFragment_Uni);
    }
    const mesh = new InstancedMesh(geo, material, infos.count);
    this.object.mesh = mesh;
    this.#group.add(mesh);
    function createShader() {
      const uniforms = {
      }
      let vertexShader = `
      precision highp float;
      precision highp sampler2D;
      #define USE_FOG;
      ${ShaderChunk["fog_pars_vertex"]}
      varying vec2 vUv;
      <mainVertex_Uni>
      #include <getPositionFromTexture_vertex>
      void main()
      {
          vUv = uv;
          vec3 pos = position.xyz;
          <mainVertex>
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
      }
      `;
      let fragmentShader = `
        #define USE_FOG;
        ${ShaderChunk["fog_pars_fragment"]}
        varying vec2 vUv; 
        <mainFragment_Uni>
        void main() 
        {
          <mainFragment>
          
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
  #group = new Group();

  uniforms = {

  }
  mainVertex_Uni = "";
  mainVertex = "";
  mainFragment_Uni = "";
  mainFragment = "gl_FragColor = vec4(1.,0.,0.,1.);";




  get group() {
    return this.#group;
  }
  static static_Infos = {
    radius: 1,
    segment: 10,
    radiusSegment: 8,
    count: 10,
  }
}

export { TubeInstance }
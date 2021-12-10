import { Color, Fog, GridHelper, Group, Scene, Vector2 } from "three";
import { PlaneBufferGeometry } from "three/build/three.module";
import { ThreeEventObject } from "../../../../../Object/Three/ThreeEventObject";
import { createMirror } from "../../../Object/Effects/Mirror/MirrorCreator";

class SceneManager extends ThreeEventObject {
  constructor(eventComp, infos = SceneManager.static_Infos) {
    super(eventComp);
    infos = Object.assign(SceneManager.static_Infos, infos);

    const scene = new Scene();
    this.#scene = scene;

    this.#lightGroup = new Group();
    this.#lightGroup.name = "Light";
    this.#noOutlineGroup = new Group();
    this.#noOutlineGroup.name = "No Outline Group";
    this.#outlineGroup = new Group();
    this.#outlineGroup.name = "Outline Group";

    this.#staticGroup = new Group();
    this.#staticGroup.name = "Static";
    this.#staticGroup.matrixAutoUpdate = false;
    this.#staticOutlineGroup = new Group();
    this.#staticOutlineGroup.name = "Static(Outline)";

    this.#dynamicGroup = new Group();
    this.#dynamicGroup.name = "Dynamic";
    this.#dynamicOutlineGroup = new Group();
    this.#dynamicOutlineGroup.name = "Dynamic(Outline)";

    scene.add(this.#lightGroup);
    scene.add(this.#outlineGroup);
    scene.add(this.#noOutlineGroup);

    this.#noOutlineGroup.add(this.#staticGroup);
    this.#noOutlineGroup.add(this.#dynamicGroup);

    this.#outlineGroup.add(this.#staticOutlineGroup);
    this.#outlineGroup.add(this.#dynamicOutlineGroup);

    const helpGroup = new Group();
    helpGroup.name = "Help";
    this.#staticGroup.add(helpGroup);
    //GRID
    if (infos.grid.isShowGrid) {
      const GI = Object.assign(SceneManager.static_Infos, infos.grid);
      const grid = new GridHelper(GI.size, GI.segment, GI.color1, GI.color2);
      this.#helper.grid = grid;
      helpGroup.add(grid);
    }
    //Fog
    if (infos.fog.isShow) {
      const FI = infos.fog;
      const fog = new Fog(FI.color, FI.near, FI.far);
      this.#fog.fog = fog;
      this.#fog.toUniform();
    }
    //Mirro
    if (infos.mirror.isShow) {
      const MI = infos.mirror;
      const mirrorPlane = new PlaneBufferGeometry(MI.width, MI.width);
      const size = new Vector2().copy(this.event.screenSizeManager.screenSize).multiplyScalar(0.5);
      const mirror = createMirror(mirrorPlane, size, MI.color, MI.bias);
      mirror.mesh.rotateX(-Math.PI / 2);
      mirror.mesh.name = "GroundMirror";
      this.#staticGroup.add(mirror.mesh);
      this.#mirror = mirror;
    }
  }
  #scene;

  #noOutlineGroup;
  #outlineGroup;

  #staticGroup;
  #staticOutlineGroup;

  #dynamicGroup;
  #dynamicOutlineGroup;

  #lightGroup;
  #helperGroup;
  #helper = {
    grid: undefined,
  }

  #fog = {
    fog: undefined,
    uniforms: {
      color: { value: new Color() },
      far: { value: 0 },
      near: { value: 0 }
    },
    toUniform: function () {
      this.uniforms.far.value = this.fog.far;
      this.uniforms.near.value = this.fog.near;
      this.uniforms.color.value.copy(this.fog.color);
    }
  }

  #mirror;
  static static_Infos = {
    grid: {
      isShowGrid: true,
      size: 1000,
      segment: 10,
      color1: 0x444444,
      color2: 0x888888,
    },
    fog: {
      isShow: true,
      color: 0x001433,
      near: 500,
      far: 10000,
    },
    mirror: {
      isShow: true,
      width: 5000,
      color: 0x889999,
      bias: 0.003,
    }
  }
  get scene() { return this.#scene; }

  get lightGroup() { return this.#lightGroup; }

  get noOutlineGroup() { return this.#noOutlineGroup; }
  get outlineGroup() { return this.#outlineGroup; }

  get staticGroup() { return this.#staticGroup; }
  get staticOutlineGroup() { return this.#staticOutlineGroup; }

  get dynamicGroup() { return this.#dynamicGroup; }
  get dynamicOutlineGroup() { return this.#dynamicOutlineGroup; }


}



export { SceneManager }
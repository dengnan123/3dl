import { AmbientLight, DirectionalLight } from 'three';
import { Three3DObject } from '../../../../../Object/Three/Three3DObject';

class LightManager extends Three3DObject {
  constructor(eventComp, three3D, infos = LightManager.static_Infos) {
    super(eventComp, three3D);

    infos = Object.assign(LightManager.static_Infos, infos);

    const group = this.three3D.sceneManager.lightGroup;

    this.#ambient = new AmbientLight(infos.ambient.color, infos.ambient.intensity);
    group.add(this.#ambient);

    this.#directional = new DirectionalLight(infos.directional.color, infos.directional.intensity);
    group.add(this.#directional);

  }
  #ambient;
  #directional;

  get directionalLight() { return this.#directional; }
  get ambientLight() { return this.#ambient; }
  static static_Infos = {
    isEditor: true,
    ambient: {
      color: 0x666666,
      intensity: 0.5
    },
    directional: {
      color: 0x444444,
      intensity: 1,
      position: {
        x: 10, y: 10, z: 10
      },
    }
  };
}
export { LightManager }

import { AmbientLight, Color, DirectionalLight, Vector3 } from 'three';
import { Three3DObject } from '../../../../../Object/Three/Three3DObject';
import { EventSystem } from '../../../Event/EventSystem';
import { Three3D } from '../../Three3D';

interface LIGHTMANAGER_INFOS {
  ambient: {
    color: Color,
    intensity: Number,
  },
  directional: {
    color: Color,
    intensity: Number,
    position: {
      x: Number,
      y: Number,
      z: Number
    }
  }
}
class LightManager extends Three3DObject {
  constructor(eventComp: EventSystem, three3D: Three3D, infos: LIGHTMANAGER_INFOS);
  static static_Infos: LIGHTMANAGER_INFOS;
  directionalLight: DirectionalLight;
  ambientLight: AmbientLight;
}

export { LightManager, LIGHTMANAGER_INFOS }
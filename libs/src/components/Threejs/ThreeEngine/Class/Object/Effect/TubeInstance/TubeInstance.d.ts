import { Group } from "three";

interface TUBEINSTANCE_DATA {
  radius: Number;
  segment: Number;
  radiusSegment: Number;
  count: Number;
}


class TubeInstance {
  constructor(infos: TUBEINSTANCE_DATA);

  readonly group: Group;

  mainVertex_Uni: String;
  mainVertex: String;
  mainFragment_Uni: String;
  mainFragment: String;
  uniforms: Object;

  static static_Infos: TUBEINSTANCE_DATA;
}


export { TubeInstance, TUBEINSTANCE_DATA }
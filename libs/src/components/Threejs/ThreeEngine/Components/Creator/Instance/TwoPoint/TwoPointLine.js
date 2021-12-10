import { Group } from "three";
import { createTextureFromPath } from "../../Texture/CreateTextureFromPath";

function TwoPointLine(baseOption, texData, geo) {
  this.baseObj = {
    curve: undefined,
    geometry: undefined,
    mesh: undefined,
    material: undefined,
    pathTex: undefined,
  }
  const group = new Group();

  init(texData);

  this.dispose = function () {
    const baseObj = this.baseObj;
    for (var key in baseObj) {
      if (baseObj[key] && baseObj[key].dispose) {
        baseObj[key].dispose();
      }
    }
  }

  function init(texData) {
    if (!texData) {
      let texPath = [];
      for (var key in baseOption.path) {
        var s = baseOption.path[key].start;
        var e = baseOption.path[key].end;
        texPath.push(s.x, s.y, s.z);
        texPath.push(e.x, e.y, e.z);
      }
      var texShader = `
      PTS getOffsetPosition(float z){
        float offset = float(gl_InstanceID);
        vec3 start = samplerPathTex(offset*2.);
        vec3 end = samplerPathTex(offset*2.+1.);
        PTS p;
        p.position = mix(start,end,z);
  
        return p;
      }
      `
      texData = createTextureFromPath(texPath, texShader);
      this.baseObj.pathTex = texData;
    }





  }
  Object.defineProperty(this, "group", {
    get: function () { return group },
  })
}


export { TwoPointLine }
import { Group } from "three";
import { TrailLine } from "./TrailLine";

function TrailLineManager(json, option, root, animate) {
  const group = new Group();
  const scope = this;
  const trailDic = {};

  init();
  function init() {

    animate.addListener("TrailLineManager", () => {
      // for (var key in trailDic) {
      //   const son = trailDic[key].son;
      //   for (var sonKey in son) {
      //     son[sonKey].animate();
      //   }
      // }
      return true;
    })
    group.manager = scope;

    group.position.set(11.5, 5, 7.2);

    //创建根
    group.name = "TrailLineManager";
    root.add(group);

    for (var key in json.sonRoot) {
      const data = json.sonRoot[key];


      if (trailDic[data.name]) {
        console.log(`trail line ${data.name}重复`)
        continue;
      }
      const trailData = { name: data.name, son: [] };
      trailDic[data.name] = trailData;


      const selfOption = { path: data.path }
      const totalOption = Object.assign(option, selfOption);
      const tl = new TrailLine(totalOption);
      trailData.son.push(tl);
      group.add(tl.mesh);

    }
  }

}

export { TrailLineManager }
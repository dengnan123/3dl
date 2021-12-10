import { Frustum, Group, Matrix4, Vector3 } from 'three';
import { CityBuildObject } from '../City/CityLayer/Object/CityBuildObject';
import { CitySegmentObject } from '../City/CityLayer/Object/CitySegmentObject';
import { LoaderStore } from './LoaderStore';
import axios from 'axios';

// import {CityBuildObject} from

function UnityTileLoader(urls, camera, isDracoy, root, animate, onFinished, distance, count = 1) {
  let loader = LoaderStore.getLoader(isDracoy);

  const startTime = Date.now();
  let finishCount = 0;
  let showAreaFinishCount = 0;
  const objDic = {};

  const frustum = new Frustum();
  const group = new Group({ name: 'TileLoaderGroup' });
  const buildGroup = new Group({ name: 'Build' });

  //CityBuild
  const cityBuildObject = new CityBuildObject();
  group.add(cityBuildObject.group);

  //CitySegment
  const citySegmentObject = new CitySegmentObject();
  group.add(citySegmentObject.group);

  if (root) {
    root.add(group);
  }

  objDic['builds'] = [];
  objDic['floors'] = [];
  objDic['cityBuilds'] = [];
  objDic['segments'] = [];

  urls.forEach(element => {
    axios.get(element).then(function (res) {
      loaderFromJson(element, res.data);
    });
    // .catch(function(){
    //     console.log('路径'+element+"不存在")
    // })
  });

  function loaderFromJson(url, json) {
    const { filesPath } = json;
    const filesData = {};

    filesPath.forEach(element => {
      const data = {};
      let folderPath = url.substring(0, url.lastIndexOf('/') + 1);
      // console.log(folderPath);
      data['url'] = folderPath + (isDracoy ? element.replace('gltf', 'gltfDraco') : element);

      let fileName = element.substring(element.lastIndexOf('/') + 1);
      fileName = fileName.substring(0, fileName.indexOf('.'));
      var splits = fileName.split('_');
      var strX = splits[1].replace('m', '-');
      var strY = splits[2].replace('m', '-');
      data['pos'] = [Number(strX), Number(strY)];
      data['states'] = State.None;
      filesData[data.pos] = data;
    });
    let tileDis = 9999999;
    let lastY;
    for (var key in filesData) {
      const element = filesData[key];
      if (lastY === undefined) {
        lastY = element.pos[1];
      }
      const dis = Math.abs(element.pos[1] - lastY);
      if (dis !== 0 && dis < tileDis) {
        tileDis = dis;
      }
    }

    const lastTilePos = [undefined, undefined];
    let lastSortList;
    let forwardList;

    loadTile();

    function loadTile() {
      let posX = Math.floor(camera.position.x / tileDis);
      let posY = Math.floor(camera.position.z / tileDis);
      const pos = [posX, posY];

      loadTileFromData();

      //***************************本方法摄像机包围计算有点问题 */
      function getNextTile() {
        let next;
        if (lastTilePos[0] !== pos[0] || lastTilePos[1] !== pos[1]) {
          lastTilePos[0] = pos[0];
          lastTilePos[1] = pos[1];
          const matrix = new Matrix4();
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();
          matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
          frustum.setFromProjectionMatrix(matrix);
          const posV3 = new Vector3();
          lastSortList = [];
          forwardList = [];
          if (filesData[pos].states === 0) {
            next = filesData[pos];
            filesData[pos].states = -1;
          }
          // var cullCount = 0;
          for (var key in filesData) {
            const element = filesData[key];
            if (element.states === 0) {
              posV3.set(element.pos[0], 0, element.pos[1]);
              posV3.subScalar(pos[0], 0, pos[1]);
              const dis = posV3.length() + Math.random() * Math.random();

              if (distance) {
                var isOut = true;
                posV3.set(element.pos[0] - pos[0], 0, element.pos[1] - pos[1]);
                if (posV3.length() < distance) {
                  isOut = false
                }
                else {
                  posV3.set(element.pos[0] + tileDis - pos[0], 0, element.pos[1] - pos[1]);
                  if (posV3.length() < distance) {
                    isOut = false;
                  }
                  else {
                    posV3.set(element.pos[0] - pos[0], 0, element.pos[1] + tileDis - pos[1]);
                    if (posV3.length() < distance) {
                      isOut = false;
                    }
                    else {
                      posV3.set(element.pos[0] + tileDis - pos[0], 0, element.pos[1] + tileDis - pos[1]);
                      if (posV3.length() < distance) {
                        isOut = false;
                      }
                    }
                  }
                }

                if (isOut) {
                  // cullCount++;
                  continue;
                };
                console.log(element.pos);
              }
              //检测摄像机范围
              //P11
              posV3.set(element.pos[0], 0, element.pos[1]);
              // console.log(posV3);
              if (frustum.containsPoint(posV3)) {
                forwardList.push({ dis, data: element });
                continue;
              }
              //p12
              posV3.set(element.pos[0] + tileDis, 0, element.pos[1]);
              if (frustum.containsPoint(posV3)) {
                forwardList.push({ dis, data: element });
                continue;
              }
              //p21
              posV3.set(element.pos[0], 0, element.pos[1] - tileDis);
              if (frustum.containsPoint(posV3)) {
                forwardList.push({ dis, data: element });
                continue;
              }
              //p22
              posV3.set(element.pos[0] + tileDis, 0, element.pos[1] - tileDis);
              if (frustum.containsPoint(posV3)) {
                forwardList.push({ dis, data: element });
                continue;
              }

              lastSortList.push({ dis, data: element });
            }
          }
          // console.log("剔除了" + cullCount + "个");
          forwardList.sort((a, b) => {
            return b.dis - a.dis;
          });
          lastSortList.sort((a, b) => {
            return b.dis - a.dis;
          });
        }
        if (next) {
          return next;
        }
        if (forwardList.length !== 0) {
          const data = forwardList.pop();
          if (forwardList.length === 0) {
            loadShowAreaEnd();
          }
          if (animate) {
            animate.needsUpdate = true;
          }
          return data.data;
        }

        if (lastSortList.length !== 0) {
          const data = lastSortList.pop();
          // console.log(data, lastSortList.length);

          //******* */
          if (animate) {
            animate.needsUpdate = true;
          }
          //******* */
          return data.data;
        }

        loadEnd();
      }

      async function loadTileFromData() {
        let tileData = getNextTile();
        while (tileData) {
          const data = tileData;
          if (data.states > 0) {
            console.log('重复加载:', tileData);
            return;
          }
          tileData.states = 1;
          var result = await loader.load(data.url);

          dealLoadResult(result);
          tileData = getNextTile();
        }

        function dealLoadResult({ url, gltf, dic }) {

          const { builds, cityBuilds, segments } = dic;
          objDic.builds.push(...builds);
          objDic.cityBuilds.push(...cityBuilds);
          objDic.segments.push(...segments);
          builds.forEach(element => {
            buildGroup.add(element.group);
          });
          cityBuilds.forEach(element => {
            cityBuildObject.add(element);
          });
          segments.forEach(element => {
            citySegmentObject.add(element);
          });
        }
      }
      function loadEnd() {
        finishCount++;
        if (finishCount === urls.length) {
          console.log(`加载Tiles总时间:${(Date.now() - startTime) / 1000}s`);
        }
        cityBuildObject.loadFinish();
        // console.log(cityBuildObject.group);
      }
      function loadShowAreaEnd() {
        showAreaFinishCount++;
        if (showAreaFinishCount === urls.length) {
          console.log(`屏幕内区域加载完成:${(Date.now() - startTime) / 1000}s`);
        }
      }
    }
  }

  Object.defineProperty(this, 'group', {
    get: function () {
      return group;
    },
  });

  this.drawGUI = function (folder) {
    cityBuildObject.drawGUI(folder);
    citySegmentObject.drawGUI(folder);
  };
}
var State = {
  None: 0,
  Loading: 1,
  complet: 2,
};

export { UnityTileLoader };



import fengmapSDK from 'fengmap';

// 设置地图上点的颜色
export const setMapItemColor = ({ map, fids, mapHash }) => {
  if (!map) return;
    let searchRequest = new fengmapSDK.FMSearchRequest();
    let searchAnalyser = new fengmapSDK.FMSearchAnalyser(map);
    searchRequest.FID = fids;
    let sortResl = searchAnalyser.query(searchRequest, function(result) {
      return result;
    });
    console.log('sortReslsortResl', sortResl);
    for (const item of sortResl) {
      const { target } = item;
      console.log('targettargettarget', target);
      const color = mapHash[target.fid];
      target.setColor(color, 1);
    }

  // const groupId = map.focusGroupID;
  // const request = {
  //   types: ['model'],
  // };
  // fengmapSDK.MapUtil.search(map, groupId, request, function(result) {
  //   var models = result;
  //   if (models.length <= 0) return;
  //   for (let model of models) {
  //     const { FID } = model;
  //     const color = mapHash[FID];
  //     if (color) {
  //       model.setColor(color, 1);
  //     }
  //   }
  // });
};

// 把mapList 映射为 以地图ID 为可以的hash对象
export const generateMapHashAndFids = ({ mapList }) => {
  if (!mapList || !mapList.length) {
    return {};
  }
  let mapHash = {};
  let fids = [];
  for (const v of mapList) {
    const { fid } = v;
    if (fid && fid.length) {
      fids = [...fids, ...fid];
      for (const key of fid) {
        mapHash[key] = v.color;
      }
    }
  }
  return {
    mapHash,
    fids,
  };
};

// 设置地图背景色
export const setBackgroundColor = ({ map, backgroundColor }) => {
  if (!map) {
    return;
  }
  if (!backgroundColor) {
    return;
  }
  map.setBackgroundColor(backgroundColor, 1);
};

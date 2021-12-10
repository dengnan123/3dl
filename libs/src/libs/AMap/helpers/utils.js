/**
 * 通过adcode获取地图数据, 目前已经将数据全部下载到本地
 * @param {string} adcode
 * @see http://datav.aliyun.com/tools/atlas/#&lat=31.80289258670676&lng=104.2822265625&zoom=4
 */
export function getMapData(adcode) {
  return new Promise(async resolve => {
    try {
      const res = await import(`./mapData/${adcode}_full.json`);
      resolve(res.default);
    } catch (err) {
      resolve();
    }
  });
}

import { Vector2 } from 'three';
var ScreenSizeManager = function (screenSize, scale) {

    let _screenSize = new Vector2(screenSize[0], screenSize[1]);

    const influenceFuncDic = {};

    this.addListener = function (key, func) {
        // console.log("111",key,func);
        influenceFuncDic[key] = func;
    }
    this.onSizeChange = function (screenSize, isForceUpdate, scale) {
        if (screenSize == null) return;
        if (!isForceUpdate) {
            if (_screenSize.x === screenSize[0] && _screenSize.y === screenSize[1]) {
                return;
            }
        }
        _screenSize.set(screenSize[0], screenSize[1]);
        for (var key in influenceFuncDic) {
            influenceFuncDic[key](_screenSize, isForceUpdate, scale);
        }
    }


    Object.defineProperty(this, "size", {
        get: function () { return _screenSize },
    })
}
export { ScreenSizeManager }
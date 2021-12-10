import * as THREE from 'three';
import { Vector2, Vector3, Vector4 } from 'three';
import { ShaderMaterial } from 'three';
// import{GUIManager,ValueLayout} from './GUIManager.js';
// var GUIInit =
// {
//     initPointsEllipse:initPointsEllipse,
//     initColor:initColor,
// }

// function initPointsEllipse(gui,posArr,abAngleArr,foldPath)
// {
//      //点

//      for (let index = 0; index < posArr.length; index++)
//      {
//          var p = posArr[index];
//          var ps = abAngleArr[index];
//          var dataP =
//          {
//              name:'xyzShow',
//              displayName:['X','Y','Z','是否绘制'],
//              foldPath:[...foldPath,{name:'点'+(index+1)}],
//              value:p,
//              ranges:[{min:-1,max:2},{min:-1,max:2},{min:-1,max:2},{isBool:true}]

//          }

//          var dataPS =
//          {
//              name:'abAngle',
//              displayName:['短半轴','畸变率','角度'],
//              foldPath:[...foldPath,{name:'点'+(index+1)}],
//              value:ps,
//              ranges:[{max:1},{min:0.7,max:1.4,delta:0.001},{min:0,max:360},{isNULL:true}]

//          }
//          var pl = new ValueLayout(gui,dataP);
//          var psl = new ValueLayout(gui,dataPS);
//      }
// }

// function initColor(gui,value,name,displayName,foldPath,a)
// {
//     var data =
//     {
//         name:name,
//         displayName:[displayName],
//         foldPath:foldPath,
//         value:value,
//         Color:a?a:{},
//     }
//     return new ValueLayout(gui,data);
// }

// export{GUIInit}

function GUIInitEllipsePoints(gui, shaderCreator, pass, pName, psName, folder) {
  var pStore = [];
  var psStore = [];
  var uniforms = pass.uniforms;
  var ps = uniforms[pName].value;
  var pss = uniforms[psName].value;
  var sonFolders = [];
  init();
  initGUI();

  function init() {
    for (let index = 0; index < 10; index++) {
      pStore.push(new Vector4(0.5, 0.5, 0, 1));
      psStore.push(new Vector4(0.2, 1, 0, 0));
    }
    if (!ps) {
      throw `${pName}为空`;
    }
    if (!pss) {
      throw `${psName}为空`;
    }
    if (ps.length != pss.length) {
      throw `${pName}和${psName}数组数目不一致`;
    }
    for (let index = 0; index < ps.length; index++) {
      pStore[index] = ps[index];
      psStore[index] = pss[index];
    }
  }
  function initGUI() {
    var pData = {
      uniform: null,
      infos: [
        { displayName: 'X', order: 1, isSlider: true, min: -1, max: 2 },
        { displayName: 'Y', order: 1, isSlider: true, min: -1, max: 2 },
        { displayName: 'Z', order: 1, isSlider: true, min: -1, max: 2 },
        { displayName: '是否绘制', order: 8, isBoolean: true },
      ],
    };
    var psData = {
      uniform: null,
      infos: [
        { displayName: '短半轴', order: 1, isSlider: true, min: 0, max: 1 },
        { displayName: '畸变率', order: 1, isSlider: true, min: 0.7, max: 1.4 },
        { displayName: '角度', order: 1, isSlider: true, min: 0, max: 360 },
        { isPass: true },
      ],
    };
    for (let index = 0; index < 10; index++) {
      var fold_Level1 = gui.addFolder({
        folderName: `第${index + 1}个椭圆点`,
        order: 0,
        parent: folder,
        isHide: index >= ps.length,
      });
      sonFolders.push(fold_Level1);
      pData.uniform = { value: pStore[index] };
      psData.uniform = { value: psStore[index] };
      gui.addValue(pData, fold_Level1);
      gui.addValue(psData, fold_Level1);
    }
    var pointsNum = { value: ps.length };
    var pointsNumData = {
      uniform: pointsNum,
      infos: [{ displayName: '点列数目', order: 99, isSlider: true, max: 10, delta: 1 }],
      func: [onPointsNumChange],
    };
    gui.addValue(pointsNumData, folder);
    var globalRScaleData = {
      uniform: pass.uniforms.globalRScale,
      infos: [{ displayName: '全局半径缩放', order: 10, isSlider: true, max: 2 }],
    };
    gui.addValue(globalRScaleData, folder);

    function onPointsNumChange(value) {
      if (value != ps.length) {
        ps.splice(0, ps.length);
        pss.splice(0, pss.length);
        ps.push(...pStore.slice(0, value));
        pss.push(...psStore.slice(0, value));
        resetPointsGUI(value);
        var shader = shaderCreator({}, { pointsCount: value });
        pass.material = new ShaderMaterial({
          defines: Object.assign({}, shader.defines),
          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader,
        });
      }
    }
  }

  function resetPointsGUI(value) {
    for (let index = 0; index < value; index++) {
      var sonFolder = sonFolders[index].folder;
      sonFolder.show();
    }
    for (let index = value; index < 10; index++) {
      var sonFolder = sonFolders[index].folder;
      sonFolder.hide();
    }
  }
}
function GUIInitScreenNoise(gui, pass, folder) {
  var noiseData = {
    uniform: pass.uniforms.screenNoise,
    infos: [
      { displayName: '噪声尺寸', isSlider: true, max: 500 },
      { displayName: '噪声强度（乘）', isSlider: true },
      { displayName: '噪声强度（加）', isSlider: true },
    ],
  };
  var noiseL = gui.addValue(noiseData, folder);
}
function GUIInitFloorFade(gui, uniform, folder) {
  var data = {
    uniform: uniform,
    infos: [
      { displayName: '阶数', isSlider: true, max: 40, name: 'FloorFade阶数' },
      { displayName: '指数', isSlider: true, max: 4, name: 'FloorFade指数' },
      { displayName: '速度', isSlider: true, min: -1, max: 1, name: 'FloorFade速度' },
    ],
  };
  gui.addValue(data, folder);
}
function GUIInitHisRange(gui, uniform, folder) {
  var data = {
    uniform: uniform,
    infos: [
      { displayName: '偏移', isSlider: true, name: 'hisRange偏移' },
      { displayName: '长度', isSlider: true, name: 'hisRange长度' },
    ],
  };
  gui.addValue(data, folder);
}
function GUIInitBezier4P(gui, uniform, folder) {
  var data = {
    uniform: uniform,
    infos: [
      { displayName: 'P1X', isSlider: true },
      { displayName: 'P1Y', isSlider: true },
      { displayName: 'P2X', isSlider: true },
      { displayName: 'P2Y', isSlider: true },
    ],
  };
  gui.addValue(data, folder);
}

export {
  GUIInitEllipsePoints,
  GUIInitScreenNoise,
  GUIInitFloorFade,
  GUIInitHisRange,
  GUIInitBezier4P,
};

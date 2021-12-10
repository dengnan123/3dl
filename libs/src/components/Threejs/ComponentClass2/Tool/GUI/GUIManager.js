import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Vector2, Vector3, Vector4 } from 'three';
import { Color } from 'three';
import { GUIStack } from './GUIStack';

function GUIManager(mainContainer, data) {
  let gui;

  //GUI缓存栈
  const guiStack = new GUIStack();
  //性能窗口
  const stats = new Stats();
  const statsID = data.domID + 'Stats';
  let isShowStats = false;
  stats.dom.id = statsID;
  const isForceClose = data.isForceClose;
  // const isForceClose = true;
  console.log(data);
  console.log(data.isForceClose);

  let isHideGUI = true;
  let isHideStats = true;

  this.addFolder = function (data, folder) {
    if (isForceClose) return;
    return guiStack.addFolder(data, folder);
  };
  var addFolder = this.addFolder;

  this.addValue = function (data, folder) {
    if (isForceClose) return;
    return guiStack.addValue(data, folder);
  };
  var addValue = this.addValue;

  this.animate = function () {
    if (isShowStats) stats.update();
    if (isForceClose) return;
  };

  this.clear = function clear(type, level) {
    if (isForceClose) return;
    guiStack.clear(type, level);
  };

  this.clearGUI = () => {
    if (isForceClose) return;
    const deleteArr = [];
    const deleteFolder = [];
    for (var key in gui.__controllers) {
      const con = gui.__controllers[key];
      deleteArr.push(con);
    }
    for (var key in gui.__folders) {
      const fo = gui.__folders[key];
      deleteFolder.push(fo);
    }
    for (var key in deleteArr) {
      gui.remove(deleteArr[key]);
      // console.log(gui.__controllers);
    }
    for (var key in deleteFolder) {
      gui.removeFolder(deleteFolder[key]);
      // console.log(gui.__folders);
    }
  };

  this.display = function display() {
    if (isForceClose) return;
    this.clearGUI();
    guiStack.drawGUI(gui);
  };
  this.refreshGUI = function refreshGUI() {
    // if (isForceClose) return;
    // console.log(gui);
    // gui.updateGUI();
  };
  this.updateGUI = function updateGUI() { };

  this.show = function show() {
    if (!isForceClose) {
      gui.show();
    }
  };
  var show = this.show;
  this.hide = function hide() {
    if (!isForceClose) {
      gui.hide();
    }
  };

  this.showStats = function showStats() {
    if (isShowStats) return;
    console.log('显示Stats');
    var std = document.getElementById(statsID);
    if (std) {
      std.remove();
    }
    mainContainer.appendChild(stats.dom);
    isShowStats = true;
  };
  var showStats = this.showStats;
  this.hideStats = function hideStats() {
    console.log('隐藏Stats');
    var std = document.getElementById(statsID);
    if (std) {
      std.remove();
    }
    isShowStats = false;
  };

  init();
  function init() {
    //初始化GUI
    initGUI();
    //初始化Stats
    initStats();

    function initGUI() {
      if (isForceClose) return;

      if (document.getElementById('guiController')) {
        document.getElementById('guiController').remove();
      }
      gui = new GUI();
      gui.domElement.id = 'guiController';

      if (!isHideGUI) {
        if (!isForceClose) {
          show();
        }
      }
    }
    function initStats() {
      if (!isHideStats) {
        showStats();
      }
    }
  }
}

export { GUIManager };

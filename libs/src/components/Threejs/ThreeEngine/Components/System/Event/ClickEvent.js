import { Raycaster, Vector2 } from 'three';

var ClickEvent = function (eventComp) {
  let container;
  let domPos;
  let _camera;
  const isClick = true;
  const { screenSize } = eventComp;
  const raycaster = new Raycaster();
  const point = new Vector2();
  let _clickLayer = undefined;
  let isStopClick = false;
  let _selectObject;
  let lastClickTime = -1;
  let clickOffset = 400; //ms

  this.setContainer = function (dom) {
    if (container) {
      console.warn('ClickEvent:Container已存在');
      return;
    }
    container = dom;
    domPos = container.getBoundingClientRect();
  };
  this.setCamera = function (camera) {
    _camera = camera;
  };
  this.onReacChange = function () {
    domPos = container.getBoundingClientRect();
  };
  this.remove = function () {
    document.removeEventListener('click', onClick);
    document.removeEventListener('touchstart', onClick, false);
  }
  init();
  function init() {
    screenSize.addListener('ClickEvent', p => {
      // domPos = container.getBoundingClientRect();
      domPos.width = p.x;
      domPos.height = p.y;
    });
    if (!isClick) return;
    document.addEventListener('click', onClick);
    document.addEventListener('touchstart', onClick, false);
  }

  function getPos(e) {
    if (e.changedTouches) {
      const touch = e.changedTouches[0];
      console.log(touch);
      point.x = ((touch.clientX - domPos.x) / domPos.width) * 2 - 1;
      point.y = -((touch.clientY - domPos.y) / domPos.height) * 2 + 1;
    }
    else {
      point.x = ((e.clientX - domPos.x) / domPos.width) * 2 - 1;
      point.y = -((e.clientY - domPos.y) / domPos.height) * 2 + 1;
    }
    return point;
  }
  function onClick(e) {
    if (e.shiftKey && e.altKey) {
      isStopClick = !isStopClick;
    }
    if (isStopClick) {
      return;
    }
    domPos = container.getBoundingClientRect();
    var pos = getPos(e);
    raycaster.setFromCamera(pos, _camera);

    if (_clickLayer) {
      var so = _clickLayer.onClick(raycaster, pos, e);
      // console.log("onClick", so);
      // console.log("onClick S", _selectObject);
      if (so && _selectObject === so) {
        if (Date.now() - lastClickTime < clickOffset) {
          _clickLayer.onClickChecked(so, e);
        }
      }
      else {
        if (Date.now() - lastClickTime < clickOffset) {
          _clickLayer.onClickChecked();
        }
      }
      // console.log("set", so);
      _selectObject = so;
      lastClickTime = Date.now();

    }
  }

  Object.defineProperty(this, 'clickLayer', {
    get: function () {
      return _clickLayer;
    },
    set: function (val) {
      _clickLayer = val;
    },
  });
};

export { ClickEvent };

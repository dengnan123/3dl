var AnimateManager = function () {
  let animateQueue = {};
  const animateStack = {};
  let isStartAnimate = false;
  let _stopRender = false;
  let _pause = false;
  let _frameRenderStep = 1;


  let renderAnimate = null;
  let frameIndex = 0;

  let _needsUpdate = true;

  let _stopAnimate = false;
  let _isForceAnimate = true;

  let time = { value: 0 };

  this.SetRenderAnimate = function (ra) {
    if (!ra) console.error("SetRenderAnimate参数为空");
    renderAnimate = ra;
    if (!isStartAnimate) {
      animate();
      isStartAnimate = true;
    }
  }
  this.addListener = function (key, func) {
    if (animateQueue[key]) {
      console.log(`AnimateManager Key:${key}已存在`);
    }
    animateQueue[key] = func;
  }
  this.addAnimateStack = function (key, anim, start, time, onFinish) {
    if (animateStack[key]) {
      console.log(`Animate Manager function addAnimateStack:Key ${key}已存在`);
      return;
    }
    const ani = {
      duration: start,
      time,
      alpha: 0,
      isForceEnd: false,
      animate: function (deltaTime) {
        if (this.isForceEnd) {
          return true;
        }
        this.duration += deltaTime;
        this.alpha = this.duration / this.time;
        const deltaP = deltaTime / this.time;
        if (this.alpha > 1) {
          anim(1, deltaP);
          onFinish && onFinish();
          return true;
        }
        else {
          anim(this.alpha, deltaP);
        }
        return false;
      },
      get end() {
        return this.alpha >= 1;
      }

    }
    animateStack[key] = ani;
    return ani;

  }
  init();
  function init() {

  }

  function animate() {
    if (_stopAnimate) {
      console.log("关闭 animate");
      return;
    }
    requestAnimationFrame(animate);
    if (frameIndex > 300) {
      if (_pause) return;
    }
    //获取时间
    // var time = new Date().getTime();
    // const deltaTime = (time - lastAnimateTime) / 1000;
    // lastAnimateTime = time;
    const deltaTime = 1 / 60;
    time.value += deltaTime;
    //开始更新Stack
    const deleteKey = [];
    for (let key in animateStack) {
      _needsUpdate = true;
      if (animateStack[key].animate(deltaTime, time.value)) {
        deleteKey.push(key);
      }
    }
    for (let index in deleteKey) {
      delete animateStack[deleteKey[index]];
    }

    //开始Animate
    for (let key in animateQueue) {
      if (animateQueue[key](deltaTime, time.value) === true) {
        _needsUpdate = true;
      }

    }
    //最后进行渲染
    if (_stopRender) return;

    if (!_needsUpdate) {
      if (!_isForceAnimate) {
        return;
      }
    }
    _needsUpdate = false;
    if (frameIndex % _frameRenderStep === 0) {
      // console.log("Render");
      renderAnimate(deltaTime * _frameRenderStep)
    }

    frameIndex++;

  }

  Object.defineProperty(this, "stopRender", {
    get: function () { return _stopRender },
    set: function (val) {
      if (val === undefined) return;
      _stopRender = val ? true : false;
    }
  })

  Object.defineProperty(this, "time", {
    get: function () { return time },
  })

  Object.defineProperty(this, "pause", {
    get: function () { return _pause },
    set: function (val) {
      if (val === undefined) return;
      _pause = val ? true : false;
    }
  })

  Object.defineProperty(this, "frameRenderStep", {
    get: function () { return _frameRenderStep },
    set: function (val) {
      if (val === undefined) return;
      _frameRenderStep = Math.max(parseInt(val), 1);
    },
  })

  Object.defineProperty(this, "needsUpdate", {
    get: function () { return _needsUpdate },
    set: function (val) {
      if (val === undefined) return;
      // console.log("SetAnimate")
      _needsUpdate = val;
    },
  })

  Object.defineProperty(this, "stopAnimate", {
    get: function () { return _stopAnimate },
    set: function (val) {
      if (val === undefined) return;
      _stopAnimate = val;
    },
  })
}

export { AnimateManager }
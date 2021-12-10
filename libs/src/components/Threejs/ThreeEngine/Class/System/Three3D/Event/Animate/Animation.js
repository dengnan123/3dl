import { ThreeObject } from "../../../../Object/ThreeObject";

class Animation extends ThreeObject {
  constructor() {
    super();
    // const a = this.createQueueAnimation();

    this.#animate();
  }


  //私有
  #states = {
    /** 强制渲染 */
    forceRender: false,
    /**暂停整个animate */
    pause: false,

    /** 渲染间隔 */
    frameStep: 1,
    /** 渲染帧总数 */
    frameIndex: 0,

    lastAnimateTime: Date.now(),
    time: { value: 0 },
    needsUpdate: false,
    speed: 1,
  }
  #animations = {
    render: undefined,
    stack: {},
    queue: {},
    values: {},
  }
  #animate = () => {
    if (this.disposed) {
      console.log("Animate终止");
      return;
    }
    requestAnimationFrame(this.#animate);
    if (this.#states.pause) {
      console.log('暂停中');
      return;
    };
    //计算时间
    const deltaTime = (Date.now() - this.#states.lastAnimateTime) / 1000 * this.#states.speed;
    const time = this.#states.time.value + deltaTime;
    this.#states.time.value = time;
    //读取外设置渲染状态
    let needsUpdate = this.#states.needsUpdate;
    this.#states.needsUpdate = false;
    //渲染Stack
    const deleteKey = [];
    const animationStack = this.#animations.stack;
    for (let key in animationStack) {
      needsUpdate = true;
      if (animationStack[key].animate(deltaTime, time.value)) {
        deleteKey.push(key);
      }
    }
    for (let index in deleteKey) {
      delete animationStack[deleteKey[index]];
    }
    //渲染queue
    const animateQueue = this.#animations.queue;
    const queueArray = Object.values(animateQueue).sort((a, b) => { return a.order > b.order });
    queueArray.forEach(element => {
      if (element.animate(deltaTime, time)) {
        needsUpdate = true;
      }
    });


    if (!this.#states.forceRender) {
      if (!needsUpdate) {
        // console.log("Jump");
        return;
      };
    }
    if (this.#states.frameIndex % this.#states.frameStep === 0) {
      //更新数据
      const values = this.#animations.values;
      for (var key in values) {
        values[key].value += values[key].speed * deltaTime;
      }
      //渲染
      if (this.#animations.render) {
        this.#animations.render.animate(deltaTime, time);
      }
    }
    else {
      // console.log("Jump Step");
    }

    this.#states.frameIndex++;


  }

  //公有

  addQueueAnimation(key, value) {
    if (!value.isQueueAnimation) return false;
    if (this.#animations.queue[key]) {
      console.log(`Queue Animation ${key} 已存在`);
      return false;
    }
    this.#animations.queue[key] = value;
    return true;
  }
  addStackAnimation(key, value) {
    if (!value.isStackAnimation) return false;
    if (this.#animations.stack[key]) {
      console.log(`Stack Animation ${key} 已存在`);
      return false;
    }
    this.#animations.stack[key] = value;
    return true;
  }
  addValueAnimation(key, value) {
    if (!value.isValueAnimation) return false;
    if (this.#animations.values[key]) {
      console.log(`Values Animation ${key} 已存在`);
      return false;
    }
    this.#animations.values[key] = value;
    return true;
  }

  createBaseAnimation() {
    return {
      animate: undefined,
      isBaseAnimation: true,
    };
  }
  createStackAnimation() {
    return {
      animate: undefined,
      duration: 0,
      time: 0,
      alpha: 0,
      isForceEnd: false,
      isStackAnimation: true,
      get end() {
        return this.alpha >= 1;
      }
    }
  }
  createQueueAnimation() {
    return {
      animate: undefined,
      order: 0,
      isQueueAnimation: true,
    }
  }
  createValueAnimation() {
    return { value: 0, speed: 1, isValueAnimation: true };
  }

  removeQueueAnimation(key) {
    if (this.#animations.queue[key]) {
      delete this.#animations.queue[key];
      return true;
    }
  }
  removeStackAnimation(key) {
    if (this.#animations.stack[key]) {
      delete this.#animations.stack[key];
      return true;
    }
  }
  removeValueAnimation(key) {
    if (this.#animations.values[key]) {
      delete this.#animations.values[key];
      return true;
    }
  }



  set renderAnimation(val) {
    this.#animations.render = val;
  }

  get timeSpeed() {
    return this.#states.speed;
  }
  set timeSpeed(val) {
    // console.log(typeof (val));
    // if (typeof (val) === "Number") {

    // }
    this.#states.speed = val;
  }

  get needsUpdate() {
    return this.#states.needsUpdate;
  }
  set needsUpdate(val) {
    this.#states.needsUpdate = val || false;
  }

  get pause() {
    return this.#states.pause;
  }
  set pause(val) {
    this.#states.pause = val || false;
  }

  get forceRender() {
    return this.#states.forceRender;
  }
  set forceRender(val) {
    this.#states.forceRender = val || false;
  }

  dispose() {
    super.dispose();
  }
}





export { Animation }
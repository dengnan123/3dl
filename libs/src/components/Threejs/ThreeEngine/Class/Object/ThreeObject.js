class ThreeObject {
  // constructor() {


  // }


  object = {
  }
  #disposed = false;
  dispose() {
    if (this.#disposed) return;
    // console.log('dispose');
    for (var key in this.object) {
      var obj = this.object[key];
      if (obj === undefined || obj === null) continue;
      if (Array.isArray(obj)) {
        obj.forEach(element => {
          if (element && element.dispose) {
            element.dispose();
          }
        });
      }
      else {
        if (obj && obj.dispose) {
          obj.dispose();
        }
      }
    }
    this.#disposed = true;
  }
  get disposed() { return this.#disposed };
  test() {
    console.log('test', this.object);
  }
}

export { ThreeObject }
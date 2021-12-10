var MathTool = {
  random: value => {
    if (Array.isArray(value)) {
      return Math.random() * (value[1] - value[0]) + value[0];
    }
    return Math.random() * value;
  },
  pikeRandom: arr => {
    if (Array.isArray(arr)) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    return arr;
  },
  lerp: (current, target, speed = 0.1, limit = 0.001) => {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
      change = target - current;
    }
    return change;
  },
  getPathLength: (path) => {
    let dis = 0;
    let lastP = [path[0], path[1], path[2]];
    for (let i = 1; i < path.length / 3; i++) {
      let x = path[3 * i];
      let x2 = Math.pow(x - lastP[0], 2);

      let y = path[3 * i + 1];
      let y2 = Math.pow(y - lastP[1], 2);

      let z = path[3 * i + 2];
      let z2 = Math.pow(z - lastP[2], 2);

      dis += Math.sqrt(x2 + y2 + z2);
      lastP[0] = x;
      lastP[1] = y;
      lastP[2] = z;
    }
    return dis;
  }
}


export { MathTool };
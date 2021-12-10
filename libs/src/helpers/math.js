// 弧度 = 角度 * Math.PI / 180
// 角度 = 弧度 * 180 / Math.PI

//根据角度 和圆的半径得到  对边大小
export const getY = (angle, radius) => {
  const radians = getRadiansByRadius(angle);
  return Math.sin(radians) * radius;
};

//根据角度 和圆的半径得到  临边大小
export const getX = (angle, radius) => {
  const radians = getRadiansByRadius(angle);
  return Math.cos(radians) * radius;
};

// 根据角度得到弧度
export const getRadiansByRadius = angle => {
  return (angle * Math.PI) / 180;
};

// 根据数据生成 圆上点的坐标
export const generateLeftAndBottom = (arr, R, r) => {
  // 根据arr长度确定不同的角度
  if (!arr || !arr.length) {
    return;
  }
  const leng = arr.length;
  if (leng === 4) {
    const number = arr.length - 1;
    const everyAngle = 90 / number;
    return arr.map((v, index) => {
      if (index === 0) {
        return {
          ...v,
          left: 0,
          bottom: R + r,
        };
      }
      if (index === arr.length - 1) {
        return {
          ...v,
          left: R + r,
          bottom: 0,
        };
      }
      const angle = everyAngle * (number - index);
      const left = getX(angle, R) + r / 2;
      const bottom = getY(angle, R) + r / 2;
      return {
        ...v,
        left,
        bottom,
      };
    });
  }
  if (leng === 3) {
    return arr.map((v, index) => {
      let angle;
      const smallAng = 10;
      if (index === 0) {
        angle = 90 - smallAng;
      } else if (index === 1) {
        angle = 45;
      } else {
        angle = smallAng;
      }

      const left = getX(angle, R) + r / 2;
      const bottom = getY(angle, R) + r / 2;
      return {
        ...v,
        left,
        bottom,
      };
    });
  }
  if (leng === 2) {
    return arr.map((v, index) => {
      let angle;
      const smallAng = 20;
      if (index === 0) {
        angle = 90 - smallAng;
      } else {
        angle = smallAng;
      }
      const left = getX(angle, R) + r / 2;
      const bottom = getY(angle, R) + r / 2;
      return {
        ...v,
        left,
        bottom,
      };
    });
  }
  return arr.map((v, index) => {
    const angle = 45;
    const left = getX(angle, R) + r / 2;
    const bottom = getY(angle, R) + r / 2;
    return {
      ...v,
      left,
      bottom,
    };
  });
};

import { reap } from '../../../components/SafeReaper';
import { isArray, cloneDeep, isString } from 'lodash';
import { getLocale } from 'umi-plugin-react/locale';
import { message } from 'antd';
// import { Function as EvFuc } from 'eval5';

const initColors = [
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];

export const stack = '重合显示';

export const filterDataFunc = (filterFunc, data, des) => {
  const lang = getLocale();
  try {
    // const filterByRule = filterFunc.replace(/[\r\n]/g, '');
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', 'lang', `${filterFunc}`);
    return filter(data, lang);
  } catch (err) {
    console.error('过滤器代码有误', err.message);
    console.error('描述des', des);
    message.warn('过滤数据失败');
    return data;
  }
};

export const getTooltip = opts => {
  const { tooltip = {} } = opts;
  if (!tooltip.show) {
    return {
      show: false,
    };
  }
  const data = cloneDeep(tooltip);
  const formatter = reap(data, `formatter`, null);
  // if (formatter) {
  // eslint-disable-next-line no-new-func
  // const func = new Function('params', formatter);
  data.formatter = params => {
    return formatterFunc(params, formatter);
  };
  // }

  return data;
};

export const formatterFunc = (params, formatterFunc) => {
  if (isArray(params)) {
    const filterArr = params.filter(v => {
      if (v.seriesName.includes('help')) {
        return false;
      }
      return true;
    });
    if (!formatterFunc) {
      const title = `${filterArr[0].name}<br/>`;
      return filterArr.reduce((pre, next) => {
        return pre + next.marker + '    ' + next.seriesName + '  ' + next.value + '<br/>';
      }, title);
    }
    return newFunc(filterArr, formatterFunc);
  }

  if (isString(params)) {
    if (!params.includes('help')) {
      if (!formatterFunc) {
        return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
      }
      return newFunc(params, formatterFunc);
    }
    return;
  }

  if (!params.name.includes('help')) {
    if (!formatterFunc) {
      return params.name + '<br/>' + params.seriesName + ' : ' + params.value;
    }
    return newFunc(params, formatterFunc);
  }
  return '';
  // return func(params);
};

const newFunc = (params, formatterFunc) => {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function('params', formatterFunc);
    return func(params);
  } catch (err) {}
};

export function getOptColor(option) {
  if (!option.color) {
    return initColors;
  }
  if (!isArray(option.color)) {
    return;
  }

  const res = initColors.map((v, index) => {
    const color = reap(option, `color`, []);
    if (color && color.length) {
      if (color[index]) {
        return color[index];
      }
    }

    return v;
  });

  return res;
}

/**
 * 颜色转换为rgba形式
 * @param {string} colorStr 颜色值
 */
export function color2Rgba(colorStr) {
  if (!colorStr) {
    return 'rgba(0,0,0,0)';
  }
  if (colorStr.startsWith('rgba')) {
    return colorStr;
  }
  // 把颜色值变成小写
  let color = colorStr.toLowerCase();

  if (color.length === 4) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    let colorNew = '#';
    for (var i = 1; i < 4; i += 1) {
      colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
    }
    color = colorNew;
  }
  // 处理六位的颜色值，转为RGB
  let colorChange = [];
  for (let i = 1; i < 7; i += 2) {
    colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
  }
  return 'rgba(' + colorChange.join(',') + ',1)';
}

/**
 * 获取渐变色
 */
export function getGradientColor(color) {
  const colorRgbaStr = color2Rgba(color);
  const [red, green, blue] = colorRgbaStr
    .substring(5, colorRgbaStr.length - 1)
    .split(',')
    .map(n => Number(n));
  const colorStops = new Array(10).fill(1).map((v, index) => {
    const last = (index + 1) / 10;
    const offset = 1 - last;
    return {
      offset,
      color: `rgba(${red},${green},${blue},${last})`, // 0% 处的颜色
    };
  });
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops,
    global: false, // 缺省为 false
  };
}

/**
 * 获取图表配色
 */
export function getGraphColor(option) {
  const isOpenGradient = option?.graphColor?.isOpenGradient || false;
  const isCustomColor = option?.graphColor?.isCustomColor || false;
  const customColorFilterFunc = option?.graphColor?.customColorFilterFunc;
  const optionColors = option?.color;

  let finalColor = [...initColors];
  // 自定义颜色优先级最高
  if (isCustomColor) {
    finalColor = customColorFilterFunc ? filterDataFunc(customColorFilterFunc) : initColors;
    return finalColor;
  }

  if (!optionColors || !isArray(optionColors)) {
    finalColor = isOpenGradient ? initColors.map(color => getGradientColor(color)) : initColors;
    return finalColor;
  }

  finalColor = isOpenGradient
    ? [...optionColors, ...initColors].map(color => getGradientColor(color))
    : [...optionColors, ...initColors];
  return finalColor;
}

export function getLegend(series, optL = {}) {
  const data = series.map(v => {
    const value = {
      name: v.name,
    };
    const icon = reap(optL, `data.icon`, '');
    if (icon) {
      value.icon = `path://${icon}`;
    }
    return value;
  });

  let legend = {
    ...optL,
  };
  legend.data = data;
  if (legend.position === 'top') {
    legend.top = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'left') {
    legend.left = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'right') {
    legend.right = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  if (legend.position === 'bottom') {
    legend.bottom = reap(optL, `distance`, 0);
    legend.orient = reap(optL, `orient`, 0);
  }
  return legend;
}

export function getGird(optG) {
  if (!optG) {
    return {};
  }
  const defaultOptG = { leftType: '%', topType: 'px', rightType: '%', bottomType: 'px', ...optG };
  const data = {};
  ['left', 'top', 'right', 'bottom'].forEach(key => {
    data[key] = parseFloat(defaultOptG[key]) + defaultOptG[`${key}Type`];
  });
  return data;
}

/**
 * 根据数据计算出刻度轴的范围
 * @param {Number} splitNumber 理想的刻度间隔段数，即希望刻度区间有多少段
 * @param {Array} data
 * @returns {Object} max, min, interval
 */
export function getAxisData(splitNumber = 4, data = [0.4, 0.2, 0.5, 0.23, 0.67, 0.8, -0.92]) {
  /*
    刻度计算算法，基于魔术数组 [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
    解释：魔数数组是理想间隔数组，即我们希望每个刻度的间隔都是魔数数组中某个数的整数倍。（准确的来说是整10倍）
*/
  //新增，解决js的浮点数存在精度问题，在计算出最后结果时可以四舍五入一次，因为刻度太小也没有意义，所以这里忽略设置精度为8位
  function fixedNum(num) {
    if (('' + num).indexOf('.') >= 0) num = parseFloat(num.toFixed(8));
    return num;
  }
  //1.初始化
  const symmetrical = false; //是否要求正负刻度对称。默认为false，需要时请设置为true
  const deviation = false; //是否允许误差，即实际分出的段数不等于splitNumber
  const magic = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100]; //魔数数组经过扩充，放宽魔数限制避免出现取不到魔数的情况。
  const arr = data.length ? [...data] : [0, 1000]; //测试数据
  let max;
  let min;
  max = Math.max.apply(null, arr); //调用js已有函数计算出最大值
  min = Math.min.apply(null, arr); //计算出最小值
  if (max === min) {
    min = max === 0 ? -1 : 0;
  }

  if (max < min) {
    [max, min] = [min, max];
  }
  //2.计算出初始间隔tempGap和缩放比例multiple
  const tempGap = (max - min) / splitNumber; //初始刻度间隔的大小。
  //设tempGap除以multiple后刚刚处于魔数区间内，先求multiple的幂10指数，例如当tempGap为120，想要把tempGap映射到魔数数组（即处理为10到100之间的数），则倍数为10，即10的1次方。
  let multiple = Math.floor(Math.log10(tempGap) - 1); //这里使用Math.floor的原因是，当Math.log10(tempGap)-1无论是正负数都需要向下取整。不能使用parseInt或其他取整逻辑代替。
  multiple = Math.pow(10, multiple); //刚才是求出指数，这里求出multiple的实际值。分开两行代码避免有人看不懂
  //3.取出邻近较大的魔数执行第一次计算
  const tempStep = tempGap / multiple; //映射后的间隔大小
  let estep; //期望得到的间隔
  let lastIndex = -1; //记录上一次取到的魔数下标，避免出现死循环

  let tempSplitNumber;
  let i = 0;
  for (let j = 0; j < magic.length; j++) {
    if (magic[j] > tempStep) {
      estep = magic[j] * multiple; //取出第一个大于tempStep的魔数，并乘以multiple作为期望得到的最佳间隔
      i = j;
      break;
    }
  }
  //4.求出期望的最大刻度和最小刻度，为estep的整数倍
  let maxi;
  let mini;
  function countDegree(estep) {
    //这里的parseInt是我无意中写出来的，本来我是想对maxi使用Math.floor，对mini使用Math.ceil的。这样能向下取到邻近的一格，不过后面发现用parseInt好像画出来图的比较好看
    maxi = parseInt(max / estep + 1) * estep; //最终效果是当max/estep属于(-1,Infinity)区间时，向上取1格，否则取2格。
    mini = parseInt(min / estep - 1) * estep; //当min/estep属于(-Infinity,1)区间时，向下取1格，否则取2格。
    //如果max和min刚好在刻度线的话，则按照上面的逻辑会向上或向下多取一格
    if (max === 0) maxi = 0; //这里进行了一次矫正，优先取到0刻度
    if (min === 0) mini = 0;
    if (symmetrical && maxi * mini < 0) {
      //如果需要正负刻度对称且存在异号数据
      const tm = Math.max(Math.abs(maxi), Math.abs(mini)); //取绝对值较大的一方
      maxi = tm;
      mini = -tm;
    }
  }
  countDegree(estep);
  if (deviation) {
    //如果允许误差，即实际分段数可以不等于splitNumber，则直接结束
    const interval = fixedNum(estep);
    return { max: maxi, min: mini, interval };
  }
  //5.当正负刻度不对称且0刻度不在刻度线上时，重新取魔数进行计算//确保其中一条分割线刚好在0刻度上。
  else if (!symmetrical || maxi * mini > 0) {
    outter: do {
      //计算模拟的实际分段数
      tempSplitNumber = Math.round((maxi - mini) / estep);
      //当趋势单调性发生变化时可能出现死循环，需要进行校正
      if ((i - lastIndex) * (tempSplitNumber - splitNumber) < 0) {
        //此处检查单调性变化且未取到理想分段数
        //此处的校正基于合理的均匀的魔数数组，即tempSplitNumber和splitNumber的差值较小如1和2，始终取大刻度
        while (tempSplitNumber < splitNumber) {
          //让maxi或mini增大或减少一个estep直到取到理想分段数
          if ((mini - min <= maxi - max && mini !== 0) || maxi === 0) {
            //在尽量保留0刻度的前提下，让更接近最值的一边扩展一个刻度
            mini -= estep;
          } else {
            maxi += estep;
          }
          tempSplitNumber++;
          if (tempSplitNumber === splitNumber) break outter;
        }
      }
      //当魔数下标越界或取到理想分段数时退出循环
      if (i >= magic.length - 1 || i <= 0 || tempSplitNumber === splitNumber) break;
      //记录上一次的魔数下标
      lastIndex = i;
      //尝试取符合趋势的邻近魔数
      if (tempSplitNumber > splitNumber) estep = magic[++i] * multiple;
      else estep = magic[--i] * multiple;
      //重新计算刻度
      countDegree(estep);
    } while (tempSplitNumber !== splitNumber);
  }
  //6.无论计算始终把maxi-mini分成splitNumber段，得到间隔interval。不过前面的算法已经尽量的保证刻度最优了，即interval接近或等于理想刻度estep。
  maxi = fixedNum(maxi);
  mini = fixedNum(mini);
  const interval = fixedNum((maxi - mini) / splitNumber);
  return { max: maxi, min: mini, interval };
}

export function getDataZoomOpt(option) {
  const dataZoom = reap(option, 'dataZoom', []);
  return dataZoom;
}

export function getToolboxOpt(option) {
  const toolbox = reap(option, 'toolbox');

  return toolbox;
}

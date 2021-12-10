/** CONST **/
const AXIS_LINEWIDTH = 1.0;
const AXIS_COLOR = '#042549';
const TICKS_LINEWIDTH = 0.5;
const TICKS_COLOR = '#042549';
const TICKS_SPACE = 5;
const FONT_SIZE = '8px';
const FONT_FAMILY = 'arial';
/** CONST **/

/****** 坐标轴 ******/
function drawAxisTicks(context, config, type) {
  const { ruleWidth, itemHeight } = config;
  const space = TICKS_SPACE;
  const ticksWidth = ruleWidth;
  const TICKS_NUMBER = Math.ceil(ticksWidth / space);
  for (let i = 0; i <= TICKS_NUMBER; i++) {
    context.beginPath();
    if (i % 10 === 0) {
      const startValue = space * i;
      context.moveTo(startValue, 0);
      context.lineTo(startValue, itemHeight);
      context.textAlign = 'left';
      context.font = `${FONT_SIZE} ${FONT_FAMILY}`;
      context.fillText(`${i * space}`, startValue + 2, 8);
    } else {
      const endY = Math.ceil(itemHeight / 2);
      context.moveTo(i * space, itemHeight);
      context.lineTo(i * space, endY);
    }
    context.stroke();
  }
}

function drawAxis(context, config, type) {
  const { ruleWidth, itemHeight } = config;
  const lineWidth = Math.ceil(ruleWidth / TICKS_SPACE) * TICKS_SPACE;
  context.beginPath();
  context.moveTo(0, itemHeight);
  context.lineTo(lineWidth, itemHeight);
  context.closePath();
  context.stroke();
}
/****** 坐标轴 ["vertical","horizontal"]******/

// 绘制标尺
export const drawRules = (id, config) => {
  const { scale } = config;
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.scale(scale, 1);
  context.lineWidth = AXIS_LINEWIDTH;
  context.strokeStyle = AXIS_COLOR;
  drawAxis(context, config);
  context.lineWidth = TICKS_LINEWIDTH;
  context.strokeStyle = TICKS_COLOR;
  drawAxisTicks(context, config);
  context.restore();
};

// 获取元素距离文档顶部的距离
export const getElementToPageTop = el => {
  if (el.parentElement) {
    return getElementToPageTop(el.parentElement) + el.offsetTop;
  }
  return el.offsetTop;
};

// 获取元素距离文档左侧的距离
export const getElementToPageLeft = el => {
  if (el.parentElement) {
    return getElementToPageLeft(el.parentElement) + el.offsetLeft;
  }
  return el.offsetLeft;
};

/**
 * 返回loading html字符串
 * @param {object} styleConfig
 */
export function loadingStyle2HtmlStr(styleConfig) {
  // 基础配置
  const basic = { backgroundColor: 'rgba(255,255,255,1)', ...styleConfig?.basic };
  const basicStyleStr = `background-color: ${basic.backgroundColor};`;

  // loading容器配置
  const container = { width: 120, height: 180, ...styleConfig?.container };
  const containerStyleStr = `width: ${container.width}px;height:${container.height}px;`;

  // loading图形配置
  const loadingGraph = {
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 2,
    borderTopColor: 'rgba(241, 143, 91, 0)',
    borderRightColor: 'rgba(241, 143, 91, 1)',
    borderBottomColor: 'rgba(241, 143, 91, 0)',
    borderLeftColor: 'rgba(241, 143, 91, 1)',
    animationDirection: 'initial',
    ...styleConfig?.loadingGraph,
  };

  const loadingGraphStyleStr =
    `width: ${loadingGraph.width}px;` +
    `height:${loadingGraph.height}px;` +
    `border-radius: ${loadingGraph.borderRadius}px;` +
    `border-width:${loadingGraph.borderWidth}px;` +
    `border-top-color: ${loadingGraph.borderTopColor};` +
    `border-right-color: ${loadingGraph.borderRightColor};` +
    `border-bottom-color: ${loadingGraph.borderBottomColor};` +
    `border-left-color: ${loadingGraph.borderLeftColor};` +
    `animation-direction: ${loadingGraph.animationDirection};`;

  // loading文字配置
  const loadingText = {
    show: true,
    text: 'LOADING...',
    color: 'rgba(241, 143, 91, 1)',
    fontSize: 14,
    fontWeight: 700,
    ...styleConfig?.loadingText,
  };

  const loadingTextStyleStr =
    `color: ${loadingText.color};` +
    `font-size: ${loadingText.fontSize}px;` +
    `font-weight: ${loadingText.fontWeight};` +
    `line-height: ${loadingGraph.height}px;` +
    `display: ${loadingText.show ? 'block' : 'none'};`;

  // 底部文字配置
  const desc = {
    show: true,
    text: 'DFOCUS 3DL',
    color: 'rgba(241, 143, 91, 1)',
    fontSize: 14,
    fontWeight: 700,
    ...styleConfig?.desc,
  };

  const descStyleStr =
    `color: ${desc.color};` +
    `font-size: ${desc.fontSize}px;` +
    `font-weight: ${desc.fontWeight};` +
    `display: ${desc.show ? 'block' : 'none'};`;

  return `<div id='loading' style='${basicStyleStr}'>
            <div style='${containerStyleStr}'>
              <div class='circle-loading' style='${loadingGraphStyleStr}'></div>
              <div class='text-loading' style='${loadingTextStyleStr}'>
                ${loadingText.text}
              </div>
              <p class='text-tip-loading' style='${descStyleStr}'>
                ${desc.text}
              </p>
            </div>
          </div>`;
}

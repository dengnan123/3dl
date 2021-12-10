import html2canvas from 'html2canvas';

export const enableResizingData = {
  top: false,
  right: false,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

export const disableResizingData = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
};

// export const getEditCanvasModalConfirmLoading = (loading) => {
//     const loading
// };

/**
 * @param {Element} element 需要截图的dom节点
 * @param {object} options html2canvas配置
 * @param {string} type 图片类型
 * @param {number} quality 图片质量 0 - 1
 * @returns {Promise} base64字符串
 */
export const html2CanvasBase64 = (element, options = {}, type, quality) => {
  return new Promise(resolve => {
    html2canvas(element, options).then(canvas => {
      const base64 = canvas.toDataURL(type, quality);
      resolve(base64);
    });
  });
};

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * 监听dom节点一定时间内无操作后触发回调
 */
function WatchNoAction(props) {
  const { onChange, style, isHidden } = props;

  const { elementId, interval = 60 * 1000 } = style || {};

  const domRef = useRef(null);
  const onChangeRef = useRef(() => {});
  const timerRef = useRef(null);

  onChangeRef.current = onChange;

  useEffect(() => {
    const clearTimer = () => timerRef.current && clearTimeout(timerRef.current);
    const clearFunc = () => {
      clearTimer();
      if (domRef.current) {
        domRef.current.onmousemove = null;
        domRef.current.onmousedown = null;
        domRef.current.onkeydown = null;
        domRef.current.onkeypress = null;
      }
    };

    clearFunc();

    const currentDom = document.getElementById(elementId);
    domRef.current = isDOM(currentDom) ? currentDom : document.body;

    if (isNaN(Number(interval)) || interval < 0 || !domRef.current || isHidden) {
      return clearFunc;
    }

    const startWatching = () => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        onChangeRef.current && onChangeRef.current();
        clearTimer();
      }, interval);
    };

    startWatching();

    domRef.current.onmousemove = startWatching;
    domRef.current.onmousedown = startWatching;
    domRef.current.onkeydown = startWatching;
    domRef.current.onkeypress = startWatching;

    return clearFunc;
  }, [interval, elementId, isHidden]);

  return null;
}

WatchNoAction.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  isHidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default WatchNoAction;

function isDOM(item) {
  // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
  return typeof HTMLElement === 'function'
    ? item instanceof HTMLElement
    : item && typeof item === 'object' && item.nodeType === 1 && typeof item.nodeName === 'string';
}

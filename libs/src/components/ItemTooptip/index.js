import React from 'react';
import { Tooltip } from 'antd';

/**
 *
 * @param {any} a 文字内容
 * @param {any} b 提示框内容
 * @param {方位} c 提示框方位 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom
 */
function ItemTooptips(a, b, c) {
  return (
    <Tooltip placement={c || 'top'} title={b}>
      <span>{a}</span>
    </Tooltip>
  );
}

export default ItemTooptips;

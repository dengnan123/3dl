import React from 'react';

import ItemCompRender from '@/components/ItemCompRender';
import ReferenceLine from '@/components/ReferenceLine';
// import styles from './index.less';

const ItemDom = props => {
  const { id, canvasId, compRenderProps } = props;
  const { onMouseUp } = compRenderProps;

  return (
    <>
      {/* <div className={styles.delete}>
        <img src={DeleteIcon} alt="delete" onClick={() => onDelete(item)} />
      </div> */}
      <div
        onMouseDown={e => {
          // 鼠标右击
          if (e.button === 2) {
            onMouseUp({
              id,
              top: e.clientY,
              left: e.clientX,
            });
          }
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        id={canvasId}
      >
        <ItemCompRender {...compRenderProps}></ItemCompRender>
        <ReferenceLine id={id}></ReferenceLine>
      </div>
    </>
  );
};

export default ItemDom;

// const onLayoutChange = (properties, layout) => {
//   /**** 栅格列表排序先按照Y轴排序，再根据X轴排序 ****/
//   let yHash = {};
//   for (let item of properties) {
//     const { y } = item.grid || {};
//     if (!y && y !== 0) {
//       continue;
//     }
//     if (!yHash[y]) {
//       yHash[y] = [];
//     }
//     yHash[y].push(item);
//   }
//   let list = [];
//   for (let i in yHash) {
//     const itemList = yHash[i].sort((a, b) => {
//       return a.grid.x - b.grid.x;
//     });
//     list = [...list, ...itemList];
//   }
//   /**** 排序结束 ****/
//   const { colsNum } = layout;
//   const newProperties = list.map((n, index) => {
//     const obj = n;
//     if (colsNum) {
//       const w = 12 / colsNum;
//       const x = (index % colsNum) * w;
//       const y = Math.ceil((index + 1) / colsNum) - 1;
//       obj['grid'] = { ...n.grid, w, x, y };
//     }
//     return obj;
//   });
//   return newProperties;
// };

import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classnames from 'classnames';

// import EditRender from '@/components/EditRenderNew';
// import { useScreenCtx } from '../context';

import ItemDom from './ItemDom';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function LayoutContent(props) {
  const {
    properties,
    pageConfig,
    gridFlatArrBatchUpdate,
    showClickStatus,
    percentageValue,
    isSelectCompInfo,
  } = props;

  const { gridLayout } = pageConfig || {};
  const { rowHeight, marginX, marginY, compactType = 'null' } = gridLayout || {};

  const [selectedParentId, setParentId] = useState(null);
  const [, setSelected] = useState(null);
  const [hoverItem, setHover] = useState(null);

  const GridLayouts = useMemo(() => {
    // let gridObj = { lg: [], md: [], sm: [], xs: [] };
    const d = properties.map(n => {
      return { ...n.grid, i: n.id };
    });
    return { lg: d, md: d, sm: d, xs: d };
  }, [properties]);

  // 组件点击选中
  const onItemClick = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      if (!!selectedParentId) {
        return;
      }
      const item = properties.find(n => n.id === newItem.i);
      setSelected && setSelected(item);
    },
    [selectedParentId, properties],
  );

  // 组件改变尺寸、位置
  const onChange = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      if (!!selectedParentId) {
        return;
      }
      const { w: prevW, h: prevH } = oldItem || {};
      const { i, w, h } = newItem || {};
      const newProperties = properties.map(n => {
        const layoutItem = layout.find(m => m.i === n.id);
        return { ...n, grid: { ...layoutItem } };
      });
      const widthRate = w / prevW;
      const heightRate = h / prevH;

      gridFlatArrBatchUpdate &&
        gridFlatArrBatchUpdate({ list: newProperties, id: i, widthRate, heightRate });
    },
    [properties, selectedParentId, gridFlatArrBatchUpdate],
  );

  const itemHeight = rowHeight + marginY;

  return (
    <div className={styles.wrapper}>
      <ResponsiveReactGridLayout
        className={classnames('layout', styles.mainLayout)}
        transformScale={percentageValue / 100}
        measureBeforeMount={true}
        layouts={GridLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 2 }}
        rowHeight={rowHeight || 0}
        margin={[marginX || 0, marginY || 0]}
        containerPadding={[0, 0]}
        // verticalCompact={true}
        compactType={compactType}
        onDragStart={onItemClick}
        onDragStop={onChange}
        onResizeStart={onItemClick}
        onResizeStop={onChange}
        isDraggable={!selectedParentId}
        isResizable={!selectedParentId}
      >
        {properties.map(item => {
          const { id } = item;
          const active = hoverItem?.id === id;
          const canvasId = `item-${id}`;
          const compRenderProps = {
            ...props,
            setParentId,
            canvasId,
            parentId: id,
            v: item,
          };
          return (
            <div
              data-key={id}
              data-type={'div'}
              key={id}
              className={classnames(styles.gridItem, { [styles.active]: active })}
              onClick={e => {
                e.stopPropagation();
                showClickStatus(item);
              }}
              onMouseEnter={() => {
                if (isSelectCompInfo.id === id) {
                  return;
                }
                setHover(item);
              }}
              onMouseLeave={() => {
                setHover(null);
              }}
              style={{
                zIndex: item.zIndex,
              }}
            >
              <ItemDom id={id} canvasId={canvasId} compRenderProps={compRenderProps} />
            </div>
          );
        })}
      </ResponsiveReactGridLayout>

      {/* 网格线 */}
      <div
        className={styles.lines_2}
        style={{
          backgroundSize: `${100 / 12}% 5px`,
        }}
      ></div>
      <div
        className={styles.lines}
        style={{
          backgroundSize: `5px ${itemHeight}px`,
        }}
      ></div>
    </div>
  );
}

LayoutContent.propTypes = {
  properties: PropTypes.array,
};

export default LayoutContent;
// left = colWidth * x + margin * x + containerPadding; containerPadding?=margin

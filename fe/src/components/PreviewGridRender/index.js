import React, { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classnames from 'classnames';
import Wrap from './wrap';
import CompLogicRender from '@/components/CompLogicRender';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const getGridH = (height, rowHeight, marginY) => {
  // height = Math.round(rowHeight * h + Math.max(0, h - 1) * margin[1])
  const h = Math.round((height + marginY) / (rowHeight + marginY));
  return h;
};

function PreviewGridRender(props) {
  const { data, pageConfig, dataSource } = props;
  const { gridLayout } = pageConfig || {};
  const { rowHeight, marginX, marginY, compactType = 'null' } = gridLayout || {};
  console.log('pageConfig', pageConfig);
  const GridLayouts = useMemo(() => {
    // const newData = data.filter(i => !i.isHidden);
    const newData = data;
    const d = newData.map(n => {
      if (n.isHidden) {
        return { ...n.grid, i: n.id, w: 0, h: 0 };
      }
      if (n.gridHeight) {
        const h = getGridH(n.gridHeight, rowHeight, marginY);
        return { ...n.grid, i: n.id, h };
      }
      return { ...n.grid, i: n.id };
    });

    return { lg: d };
  }, [data, rowHeight, marginY]);

  const RenderLayoutDom = useMemo(() => {
    let comps = [];

    for (let item of data) {
      if (!item.grid) {
        continue;
      }
      // if (item.isHidden) {
      //   continue;
      // }
      console.log('item', item);
      const { id } = item;
      const itemProps = {
        ...props,
        data: [{ ...item, left: 0, top: 0, width: '100%', height: '100%' }],
      };
      const compValue = (
        <div
          data-key={id}
          data-type={'div'}
          key={id}
          className={classnames(styles.gridItem)}
          style={{
            zIndex: item.zIndex,
            display: item.isHidden ? 'none' : 'block',
          }}
        >
          <CompLogicRender {...itemProps}></CompLogicRender>
        </div>
      );

      comps.push(compValue);
    }

    return comps;
  }, [data, dataSource, props]);

  return (
    <div className={styles.wrapper}>
      <ResponsiveReactGridLayout
        className={classnames('layout', styles.mainLayout)}
        measureBeforeMount={true}
        layouts={GridLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 2 }}
        rowHeight={rowHeight || 0}
        margin={[marginX || 0, marginY || 0]}
        containerPadding={[0, 0]}
        compactType={compactType}
        isDraggable={false}
        isResizable={false}
      >
        {RenderLayoutDom}
      </ResponsiveReactGridLayout>
    </div>
  );
}
export default Wrap(PreviewGridRender);

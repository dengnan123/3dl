import React, { useMemo } from 'react';
import classnames from 'classnames';
import { Button } from 'antd';

import { staticPath } from '@/config';
import NoPicture from '../../../../../assets/no-pic.png';

import styles from './index.less';

export default props => {
  const { data, currentPageId, visible, onItemClick, onAddClick } = props;
  const classifyHeight = window.innerHeight - 60;

  const { list, total = 0 } = data || [];

  // 列表展示
  const RenderList = useMemo(() => {
    const isNone = !visible || !list || !list.length;
    let contentArr = null;
    if (list) {
      contentArr = list.map(item => {
        const { id, name, pageCoverImg } = item;
        const src = pageCoverImg ? `${staticPath}/${id}/${pageCoverImg}` : NoPicture;
        const isCurrent = currentPageId + '' === id + '';
        return (
          <div
            key={id}
            className={classnames(styles.childItem, { [styles.active]: isCurrent })}
            onClick={() => !isCurrent && onItemClick(id)}
          >
            <div className={styles.info}>
              <div>
                <img src={src} alt={name} />
              </div>
              <p>
                {name} / {id}
              </p>
            </div>
          </div>
        );
      });
    }
    return (
      <div
        className={styles.box}
        style={{
          maxHeight: classifyHeight,
          display: isNone ? 'none' : 'block',
        }}
      >
        <h2>
          页面总数: {total}
          <Button
            size="small"
            type="primary"
            onClick={() => {
              onAddClick && onAddClick();
            }}
          >
            + 添加子页面
          </Button>
        </h2>
        <div className={styles.listWrapper}>{contentArr}</div>
      </div>
    );
  }, [visible, list, total, currentPageId, classifyHeight, onItemClick, onAddClick]);

  return <div className={styles.content}>{RenderList}</div>;
};

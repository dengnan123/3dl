import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Spin, Icon, Popover, Button } from 'antd';

import { toTop, toBottom, toUpperLevel, toLowLevel } from '@/helpers/zIndex';

import { ALL_MENU } from '../../helper';
import styles from './index.less';

const OperateList = [
  {
    id: 1,
    name: '置顶',
    formatData: toTop,
  },
  {
    id: 2,
    name: '置底',
    formatData: toBottom,
  },
  {
    id: 3,
    name: '上移',
    formatData: toUpperLevel,
  },
  {
    id: 4,
    name: '下移',
    formatData: toLowLevel,
  },
];

function SideList(props) {
  const { data, selectedItem, onItemClick, onItemEdit, onSortClick, onAdd } = props;
  const { id } = selectedItem || {};
  const { list } = data || {};

  let menuList = [];
  if (list && list.length) {
    menuList = [ALL_MENU, ...list];
  }

  const onClick = record => {
    if (record.id === id) return;
    onItemClick(record);
  };

  // 操作列表
  const operateContent = useCallback(
    current => {
      return (
        <ul className={styles.operateList}>
          {OperateList.map(n => {
            return (
              <li
                key={n.id}
                onClick={() =>
                  onSortClick &&
                  onSortClick(
                    n?.formatData({ arr: list, id: current?.id, isSelectCompInfo: current }),
                    current,
                  )
                }
              >
                {n.name}
              </li>
            );
          })}
        </ul>
      );
    },
    [onSortClick, list],
  );

  return (
    <section className={styles.sideContent}>
      <div className={styles.classify}>
        <Button type="primary" onClick={onAdd}>
          添加分类
        </Button>
      </div>
      <Spin spinning={false} size="small">
        <div className={styles.listContent}>
          {menuList.map(i => {
            const { id: itemId } = i;
            return (
              <div
                key={itemId}
                className={classnames(styles.menuItem, { [styles.selected]: itemId === id })}
              >
                <p onClick={() => onClick(i)}>
                  <Icon type="code" />
                  {i.name}
                </p>
                {itemId !== 'ALL' && (
                  <div className={styles.itemIcon}>
                    <Icon type="edit" onClick={() => onItemEdit(i)} />
                    <Popover
                      content={operateContent(i)}
                      placement="right"
                      getPopupContainer={trigger => trigger}
                    >
                      <Icon type="more" rotate={90} />
                    </Popover>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Spin>
    </section>
  );
}

SideList.propTypes = {
  data: PropTypes.object,
  selectedItem: PropTypes.object,
  onItemClick: PropTypes.func,
  onItemEdit: PropTypes.func,
  onAdd: PropTypes.func,
};

export default SideList;

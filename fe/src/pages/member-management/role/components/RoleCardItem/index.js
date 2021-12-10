import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import styles from './index.less';

function RoleCardItem(props) {
  const { item, deleteRole, onItemClick, editRole } = props;
  const { id, name, des } = item || {};

  const RenderOperateIcon = useMemo(() => {
    if (id === 1) {
      return null;
    }
    const EditDom = <Icon type="edit" onClick={event => editRole && editRole({ id: id })} />;
    // const DeleteDom = (
    //   <Icon
    //     type="delete"
    //     style={{ marginLeft: 10 }}
    //     onClick={event => deleteRole && deleteRole({ id: id })}
    //   />
    // );
    return (
      <React.Fragment>
        {EditDom}
        {/* {DeleteDom} */}
      </React.Fragment>
    );
  }, [deleteRole, editRole, id]);

  let description = des || '--';
  if (id === 1) {
    description = '拥有所有的数据权限';
  }

  return (
    <div
      className={styles.itemWrap}
      onClick={() => onItemClick && onItemClick({ id: id, detailsItem: item })}
    >
      <div className={styles.item}>
        <div className={styles.title}>
          <h3>{name}</h3>
          <div className={styles.oparete}>{RenderOperateIcon}</div>
        </div>

        <p className={styles.permsRemark}>{description}</p>
        {/* <p className={styles.permsCount}>
          拥有 <span>{total || 0}</span> 个页面权限
        </p> */}
      </div>
    </div>
  );
}

RoleCardItem.propTypes = {
  item: PropTypes.object,
  onItemClick: PropTypes.func,
  editRole: PropTypes.func,
  deleteRole: PropTypes.func,
};

export default RoleCardItem;

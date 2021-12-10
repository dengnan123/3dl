import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './index.less';

function RoleHeaderFilter(props) {
  const { total, onAddClick } = props;

  return (
    <div className={styles.topContainer}>
      <div className={styles.topTotal}>
        共 <i>{total}</i> 个角色
      </div>
      <div className={styles.topBtns}>
        <Button type="primary" onClick={onAddClick}>
          新增角色
        </Button>
      </div>
    </div>
  );
}

RoleHeaderFilter.propTypes = {
  total: PropTypes.number,
  onAddClick: PropTypes.func,
};

export default RoleHeaderFilter;

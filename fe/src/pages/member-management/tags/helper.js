import React from 'react';
import { Button, Icon } from 'antd';
import classnames from 'classnames';

import styles from './index.less';

export const _getColumns = props => {
  const { onDeleted, onEdit } = props || {};
  return [
    {
      title: '标签名称',
      dataIndex: 'name',
      align: 'center',
      width: 300,
    },
    {
      title: '是否默认标签',
      dataIndex: 'isDefault',
      align: 'center',
      render: text => {
        if (text) {
          return <span className={classnames(styles.defaultClass, styles.runningTag)}>是</span>;
        }
        return <span className={classnames(styles.defaultClass)}>否</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      className: styles.tableLastColumn,
      render: (text, record) => {
        const { isDefault } = record;

        return (
          <React.Fragment>
            <Button
              type="link"
              style={{ marginRight: '15px' }}
              onClick={() => {
                onEdit && onEdit(record);
              }}
              disabled={isDefault}
            >
              <Icon type="edit" />
            </Button>
            <Button
              type="link"
              onClick={() => {
                onDeleted && onDeleted(record);
              }}
              disabled={isDefault}
            >
              <Icon type="delete" />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];
};

export const pageParams = { pageSize: 9999, current: 1 };

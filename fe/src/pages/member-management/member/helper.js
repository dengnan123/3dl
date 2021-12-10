import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';

import styles from './index.less';

export const _getColumns = props => {
  const { onDisabled, onReset, onEdit } = props || {};
  return [
    {
      title: '姓名',
      dataIndex: 'userName',
      align: 'center',
      width: 300,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      render: text => {
        return text || '--';
      },
    },
    {
      title: '角色',
      dataIndex: 'roleList',
      align: 'center',
      render: text => {
        if (!text || text.length === 0) {
          return '--';
        }
        const roles = text.map(i => i.name) || [];
        return roles.join('、');
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: text => {
        if (text) {
          return <span className={classnames(styles.tags, styles.runningTag)}>启用中</span>;
        }
        return <span className={classnames(styles.tags)}>禁用中</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      className: styles.tableLastColumn,
      render: (text, record) => {
        const { status } = record;
        return (
          <React.Fragment>
            <Button
              type="link"
              style={{ marginRight: '15px' }}
              onClick={() => {
                onDisabled && onDisabled(record);
              }}
            >
              {status ? '禁用' : '启用'}
            </Button>
            <Button
              type="link"
              style={{ marginRight: '15px' }}
              onClick={() => {
                onEdit && onEdit(record);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                onReset && onReset(record);
              }}
            >
              重置密码
            </Button>
            {/* <Dropdown
              overlay={
                <Menu onClick={e => {}}>
                  <Menu.Item key="reset">重置密码</Menu.Item>
                  <Menu.Item key="delete">删除</Menu.Item>
                </Menu>
              }
              trigger={['click']}
              getPopupContainer={() => document.getElementById('memberListDropdown')}
            >
              <Button
                id="memberListDropdown"
                className={classnames('ant-dropdown-link', styles.memberListDropdown)}
                type="link"
              >
                更多
              </Button>
            </Dropdown> */}
          </React.Fragment>
        );
      },
    },
  ];
};

export const pageParams = { pageSize: 10, current: 1, keyword: null };

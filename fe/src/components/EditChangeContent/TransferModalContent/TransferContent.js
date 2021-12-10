import React, { useState, useEffect, useCallback } from 'react';
import { Transfer, Icon, Button, Tree } from 'antd';

import styles from './index.less';
const TransferContent = props => {
  const {
    dataSource,
    treeSource,
    targetKeys,
    showSetting,
    onEdit,
    onModalCancel,
    onModalConfirm,
    transferTitle,
    setFunc,
  } = props;
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    setKeys(targetKeys);
  }, [targetKeys]);

  const handleChange = useCallback((nextTargetKeys, direction, moveKeys) => {
    // setTarget && setTarget(nextTargetKeys);
  }, []);

  const onSelectChange = useCallback(
    (sourceSelectedKeys, targetSelectedKeys) => {
      setKeys([...keys, ...sourceSelectedKeys]);
    },
    [keys],
  );

  const onRemove = useCallback(
    key => {
      const newKeys = keys.filter(i => i !== key);
      setKeys(newKeys);
      setFunc &&
        setFunc(list => {
          return list.filter(i => i.id !== key);
        });
    },
    [keys, setFunc],
  );

  const onEditItem = useCallback(
    item => {
      onEdit && onEdit(item);
    },
    [onEdit],
  );

  const generateTree = useCallback((treeNodes = [], checkedKeys = []) => {
    return treeNodes.map(({ child, key, transferTitle }) => (
      <Tree.TreeNode disabled={checkedKeys.includes(key)} key={key} title={transferTitle}>
        {generateTree(child, checkedKeys)}
      </Tree.TreeNode>
    ));
  }, []);

  const isChecked = (selectedKeys, eventKey) => {
    return selectedKeys.indexOf(eventKey) !== -1;
  };

  return (
    <React.Fragment>
      <h2>{transferTitle || '选择内容'}</h2>
      <div className={styles.listContent}>
        <Transfer
          titles={['未选择', '已选择']}
          showSearch
          showSelectAll={false}
          locale={{ itemUnit: '项', itemsUnit: '项', searchPlaceholder: '请输入搜索内容' }}
          listStyle={{
            width: 240,
            height: 560,
          }}
          operations={['', '']}
          dataSource={dataSource}
          targetKeys={keys}
          onChange={handleChange}
          onSelectChange={onSelectChange}
          render={item => `${item.transferTitle}`}
          selectedKeys={[]}
          footer={null}
        >
          {({ direction, filteredItems, onItemSelect, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...keys];
              return (
                <Tree
                  blockNode
                  checkable
                  checkStrictly
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  selectable={false}
                  onCheck={(
                    selectedKey,
                    {
                      node: {
                        props: { eventKey },
                      },
                    },
                  ) => {
                    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
                  }}
                >
                  {generateTree(treeSource, keys)}
                </Tree>
              );
            }

            return filteredItems.map(i => {
              return (
                <div key={i.key} className={styles.rightItem}>
                  {i.transferTitle}
                  {showSetting && (
                    <span className={styles.itemEdit} onClick={() => onEditItem(i)}>
                      <Icon type="setting" />
                    </span>
                  )}
                  <span className={styles.itemDelete} onClick={() => onRemove(i.key)}>
                    <Icon type="delete" />
                  </span>
                </div>
              );
            });
          }}
        </Transfer>
      </div>
      <div className={styles.footer}>
        <Button onClick={onModalCancel} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={() => onModalConfirm(keys)}>
          OK
        </Button>
      </div>
    </React.Fragment>
  );
};

export default TransferContent;

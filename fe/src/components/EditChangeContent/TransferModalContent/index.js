import React, { useState, useCallback, useEffect } from 'react';
import { Button, Modal } from 'antd';
import classnames from 'classnames';

import AceEditor from '@/components/AceEditor';
import TransferContent from './TransferContent';

import styles from './index.less';

export default ({
  showSetting = false,
  visible,
  treeSource,
  dataSource,
  onCancel,
  onModalConfirm,
  targetKeys,
  dynamicExpandValue,
  transferTitle,
}) => {
  // 编辑设置
  const [showEdit, setEditVisible] = useState(false);
  const [editItem, setItem] = useState({});
  const [itemCode, setCode] = useState('');
  const [funcs, setFunc] = useState([]);

  useEffect(() => {
    setFunc(dynamicExpandValue || []);
  }, [dynamicExpandValue]);

  const _onComfirm = useCallback(
    selectedKeys => {
      onModalConfirm && onModalConfirm(selectedKeys, funcs);
    },
    [onModalConfirm, funcs],
  );

  // 回调函数
  const onEdit = useCallback(
    item => {
      const { id } = item;
      const filterItem = funcs.find(i => i.id === id) || {};
      const { filterFunc } = filterItem;
      setEditVisible(true);
      setItem(item);
      setCode(filterFunc);
    },
    [funcs],
  );

  const onEditCancel = useCallback(() => {
    setEditVisible(false);
    setCode(null);
  }, []);

  const onEditConfirm = useCallback(() => {
    const { id } = editItem;
    const filterItem = funcs.find(i => i.id === id);
    if (!filterItem) {
      setFunc([...funcs, { id, filterFunc: itemCode }]);
    } else {
      setFunc(list => {
        return list.map(i => {
          if (i.id === id) {
            return {
              ...i,
              filterFunc: itemCode,
            };
          }
          return i;
        });
      });
    }
    setCode(null);
    setEditVisible(false);
  }, [funcs, itemCode, editItem]);

  const editProps = {
    language: 'javascript',
    showFooter: false,
    value: itemCode,
    height: 460,
    onChange: val => setCode(val),
  };

  return (
    <Modal
      title={null}
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      className={styles.compModal}
    >
      <div className={styles.mainContent}>
        {visible && (
          <TransferContent
            treeSource={treeSource}
            dataSource={dataSource}
            targetKeys={targetKeys}
            showSetting={showSetting}
            onEdit={onEdit}
            onModalCancel={onCancel}
            onModalConfirm={_onComfirm}
            transferTitle={transferTitle}
            setFunc={setFunc}
          />
        )}

        {/* 编辑回调函数部分 */}
        <div className={classnames(styles.editContent, { [styles.showEdit]: showEdit })}>
          <Button className={styles.returnBtn} onClick={onEditCancel}>
            返回
          </Button>
          <Button type="primary" className={styles.confirmBtn} onClick={onEditConfirm}>
            保存
          </Button>
          <h3>回调函数（{editItem.transferTitle}）</h3>
          <div>{showEdit && <AceEditor {...editProps}></AceEditor>}</div>
        </div>
      </div>
    </Modal>
  );
};

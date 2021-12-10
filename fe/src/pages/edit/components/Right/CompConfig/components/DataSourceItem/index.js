import React, { Fragment, useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Button, Modal, Icon, Tooltip } from 'antd';
import classnames from 'classnames';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'fast-deep-equal';

import AceEditor from '@/components/AceEditor';
import ListContent from './ListContent';

import styles from './index.less';
const { Item } = Form;

export default ({
  form,
  form: { getFieldDecorator, setFieldsValue },
  formItemLayout,
  data = {},
  dataSource,
  formItemConfig: { label, keyValue, initialValue, funcKey, tooltip },
  showSetting = false,
}) => {
  // 树状结构组件平铺
  const transferDataSource = getDataSource(dataSource);

  const { dynamicExpand = {} } = data || {};
  const [showComps, setCompsVisible] = useState(false);
  const [showEdit, setEditVisible] = useState(false);
  const [targetKeys, setTarget] = useState([]);
  const [editItem, setItem] = useState({});
  const [itemCode, setCode] = useState('');
  const [funcs, setFunc] = useState([]);

  useCustomCompareEffect(
    () => {
      setTarget(initialValue || []);
    },
    [initialValue],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[2];
      const nextProps = nextDeps[2];
      return isEqual(preProps, nextProps);
    },
  );

  useEffect(() => {
    setFunc(dynamicExpand[funcKey] || []);
  }, [data, funcKey]);

  /*** 组件选择 Modal ***/
  const onModalCancel = useCallback(() => {
    setCompsVisible(false);
  }, []);

  const onModalConfirm = useCallback(
    selectedKeys => {
      if (funcKey) {
        setFieldsValue({
          [keyValue]: selectedKeys,
          [`dynamicExpand.${funcKey}`]: funcs,
        });
      } else {
        setFieldsValue({ [keyValue]: selectedKeys });
      }
      setTarget(selectedKeys);
      setCompsVisible(false);
    },
    [keyValue, funcKey, funcs, setFieldsValue],
  );
  /*** 组件选择 Modal ***/

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
    onChange: val => setCode(val),
  };

  const RenderItems = useMemo(() => {
    let list = [];
    for (let i of transferDataSource) {
      if (!targetKeys.includes(i.id)) {
        continue;
      }
      const item = <div key={i.id}>{i.transferTitle}</div>;
      list.push(item);
    }
    const addItem = (
      <div key="addItem" className={styles.addItem} onClick={() => setCompsVisible(!showComps)}>
        <Icon type="edit" />
      </div>
    );
    return [...list, addItem];
  }, [transferDataSource, targetKeys, showComps]);

  const RenderLabel = useMemo(() => {
    if (!tooltip) {
      return label;
    }
    return (
      <span>
        {label}
        <Tooltip title={tooltip}>
          <Icon type="question-circle-o" style={{ color: '#999999', marginLeft: 5 }} />
        </Tooltip>
      </span>
    );
  }, [label, tooltip]);

  return (
    <Fragment>
      <Item {...formItemLayout} label={RenderLabel}>
        {getFieldDecorator(keyValue, {
          initialValue: initialValue,
        })(<div className={styles.itemsList}>{RenderItems}</div>)}
      </Item>

      {funcKey && (
        <Item {...formItemLayout} label={''} style={{ height: 0, marginBottom: 0 }}>
          {getFieldDecorator(`dynamicExpand.${funcKey}`, {
            initialValue: dynamicExpand[funcKey] || [],
          })(<span></span>)}
        </Item>
      )}

      <Modal
        title={null}
        maskClosable={false}
        visible={showComps}
        onCancel={onModalCancel}
        className={styles.compModal}
      >
        <div className={styles.mainContent}>
          {showComps && (
            <ListContent
              treeSource={dataSource}
              dataSource={transferDataSource}
              targetKeys={targetKeys}
              showSetting={showSetting}
              onEdit={onEdit}
              onModalCancel={onModalCancel}
              onModalConfirm={onModalConfirm}
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
    </Fragment>
  );
};

const getDataSource = (list = []) => {
  let arr = [];
  list.forEach(item => {
    arr.push(item);
    if (item.child && item.child.length) {
      arr = [...arr, ...getDataSource(item.child)];
    }
  });
  return arr;
};

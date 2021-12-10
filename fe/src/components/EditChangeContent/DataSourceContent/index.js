import React, { Fragment, useState, useCallback, useMemo } from 'react';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'fast-deep-equal';
import { Form } from 'antd';

import DataList from './DataList';

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
  const { dynamicExpand = {} } = data || {};
  const [targetKeys, setTarget] = useState([]);

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

  /*** 组件选择 Modal ***/
  const onModalConfirm = useCallback(
    list => {
      if (funcKey) {
        setFieldsValue({
          [keyValue]: list,
          [`dynamicExpand.${funcKey}`]: funcs,
        });
      } else {
        setFieldsValue({ [keyValue]: list });
      }
      setTarget(list);
    },
    [funcs, keyValue, funcKey, setFieldsValue],
  );
  /*** 组件选择 Modal ***/

  const RenderItems = useMemo(() => {
    if (targetKeys.length === 0) {
      return <div className={styles.noSetting}>未设置</div>;
    }
    let list = [];
    for (let i of dataSource) {
      if (!targetKeys.includes(i.id)) {
        continue;
      }
      const item = (
        <div key={i.id} className={styles.itemDiv}>
          {i.transferTitle}
        </div>
      );
      list.push(item);
    }
    return [...list];
  }, [dataSource, targetKeys]);

  return (
    <Fragment>
      <Item {...formItemLayout} label={''}>
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

      <DataList
        options={dataSource}
        checkedList={targetKeys}
        onChangeClick={onModalConfirm}
        showSetting={showSetting}
        funcs={funcs}
        setFunc={setFunc}
      />
    </Fragment>
  );
};

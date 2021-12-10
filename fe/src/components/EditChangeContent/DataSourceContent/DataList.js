import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Icon, Checkbox, Divider } from 'antd';
import classnames from 'classnames';

import AceEditor from '@/components/AceEditor';

import styles from './index.less';

const DataList = props => {
  const { onChangeClick, options = [], checkedList = [], funcs, setFunc, showSetting } = props;
  // 编辑设置
  const [showEdit, setEditVisible] = useState(false);
  const [editItem, setItem] = useState({});
  const [itemCode, setCode] = useState('');

  const _onSettingClick = useCallback(
    (ev, item) => {
      ev.preventDefault();
      const { id } = item;
      const filterItem = funcs.find(i => i.id === id) || {};
      const { filterFunc } = filterItem;
      setEditVisible(true);
      setItem(item);
      setCode(filterFunc);
    },
    [funcs],
  );

  const RenderOptions = useMemo(() => {
    const optionsArr = options.map(i => {
      return {
        label: (
          <>
            <span>{i.transferTitle}</span>
            {showSetting && (
              <Button type="link" onClick={e => _onSettingClick(e, i)}>
                <Icon type="setting" />
              </Button>
            )}
          </>
        ),
        value: i.id,
      };
    });
    return optionsArr;
  }, [showSetting, options, _onSettingClick]);


  const _onChangeClick = useCallback(
    list => {
      onChangeClick && onChangeClick(list);
    },
    [onChangeClick],
  );

  // 编辑数据源设置
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
  }, [funcs, setFunc, itemCode, editItem]);

  const editProps = {
    language: 'javascript',
    showFooter: false,
    value: itemCode,
    onChange: val => setCode(val),
  };

  if (!options || !options.length) {
    return null;
  }

  return (
    <div className={styles.dataList}>
      <Divider dashed={true} />
      <h3>数据源列表：</h3>
      <div>
        <Checkbox.Group
          options={RenderOptions}
          value={checkedList}
          onChange={list => _onChangeClick(list)}
        />
      </div>

      <Modal
        title={null}
        maskClosable={false}
        visible={showEdit}
        onCancel={onEditCancel}
        className={styles.compModal}
      >
        <div className={styles.mainContent}>
          {/* 编辑回调函数部分 */}
          <div className={classnames(styles.editContent, styles.showEdit)}>
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
    </div>
  );
};

export default DataList;

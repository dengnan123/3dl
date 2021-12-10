import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Icon, Tooltip, Spin } from 'antd';
import classnames from 'classnames';
import { isArray } from 'lodash';

import { fetchPageUseCompList } from '@/service';
import TransferModalContent from '../TransferModalContent';

import styles from './index.less';
const { Item } = Form;

export default ({
  form,
  form: { getFieldDecorator, setFieldsValue },
  formItemLayout,
  data = {},
  formItemConfig: { label, keyValue, initialValue, funcKey, tooltip },
  showSetting = false,
  pages = [],
  currentPageId,
  currentPageComps,
  showAllPages,
}) => {
  const { dynamicExpand = {} } = data || {};
  // loading
  const [compsLoading, setCompsLoading] = useState(false);

  // 各个页面组件数据
  const [compsListObject, setCompList] = useState({});
  // 各个页面选择的组件数据
  const [selectedAllData, setSelectedAllData] = useState({});
  const [selectedId, setCurrentId] = useState(null);
  const [selectedPageItem, setSelectedPageItem] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isArray(initialValue)) {
      setSelectedAllData({ [currentPageId]: initialValue });
    } else {
      setSelectedAllData(initialValue || {});
    }
  }, [currentPageId, initialValue]);

  useEffect(() => {
    let listObj = { [currentPageId]: currentPageComps };

    if (initialValue && !isArray(initialValue)) {
      const idsArr = Object.keys(initialValue) || [];
      for (let id of idsArr) {
        if (id + '' === currentPageId) {
          setCompList(list => {
            return {
              ...list,
              [currentPageId]: currentPageComps,
            };
          });
          continue;
        }
        setCompsLoading(true);
        fetchPageUseCompList({ pageId: id, type: 'edit' }).then(res => {
          const { errorCode, data } = res || {};
          if (errorCode === 200) {
            setCompList(list => {
              return {
                ...list,
                [id]: data || [],
              };
            });
          }
          setCompsLoading(false);
        });
      }

      return;
    }

    setCompList(listObj);
  }, [currentPageId, initialValue, currentPageComps]);

  /** 请求数据(组件列表) **/
  useEffect(() => {
    if (!selectedId || compsListObject[selectedId]) {
      return;
    }
    fetchPageUseCompList({ pageId: selectedId, type: 'edit' }).then(res => {
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        setCompList(list => {
          return {
            ...list,
            [selectedId]: data || [],
          };
        });
      }
    });
  }, [selectedId, compsListObject]);
  /** 请求数据(组件列表) **/

  /*** 组件选择 Modal ***/
  const onModalCancel = useCallback(() => {
    setShowModal(false);
    setCurrentId(null);
    setSelectedPageItem({});
  }, []);

  const onAddComps = useCallback(item => {
    setShowModal(true);
    setCurrentId(item.id);
    setSelectedPageItem(item);
  }, []);

  const onModalConfirm = useCallback(
    (selectedKeys, funcs) => {
      const keys = {
        ...selectedAllData,
        [selectedId]: selectedKeys,
      };
      if (!selectedKeys.length) {
        delete keys[selectedId];
      }
      if (funcKey) {
        setFieldsValue({
          [keyValue]: keys,
          [`dynamicExpand.${funcKey}`]: funcs,
        });
      } else {
        setFieldsValue({ [keyValue]: keys });
      }
      setSelectedAllData(keys);
      setShowModal(false);
    },
    [keyValue, funcKey, setFieldsValue, selectedAllData, selectedId],
  );
  /*** 组件选择 Modal ***/

  // 渲染每个页面的选择的组件
  const renderItems = useCallback(
    item => {
      const { id } = item;
      const currentTags = selectedAllData[id] || [];
      const currentCompsArr = compsListObject[id] || [];
      const compsListData = getDataSource(currentCompsArr);
      let list = [];
      for (let i of compsListData) {
        if (!currentTags.includes(i.id)) {
          continue;
        }
        const item = <div key={i.id}>{i.aliasName || i.compName}</div>;
        list.push(item);
      }
      const addItem = (
        <div key="addItem" className={styles.addItem} onClick={() => onAddComps(item)}>
          <Icon type="edit" />
        </div>
      );
      return [...list, addItem];
    },
    [selectedAllData, compsListObject, onAddComps],
  );

  // 页面列表
  const RenderPageListContent = useMemo(() => {
    let pagesArr = [];
    let currentPage = null;

    for (let page of pages) {
      const { id, name } = page;
      const isCurrentPage = id + '' === currentPageId;
      const itemContent = (
        <div className={styles.pageItem} key={id}>
          <Tooltip title={`${id} - ${name}`}>
            <label className={classnames({ [styles.current]: isCurrentPage })}>
              {isCurrentPage ? `当前页(${id})` : `${id} - ${name}`}
            </label>
          </Tooltip>
          <div className={styles.pageItemComps}>{renderItems(page)}</div>
        </div>
      );
      if (isCurrentPage) {
        currentPage = itemContent;
        continue;
      }

      pagesArr.push(itemContent);
    }
    if (!showAllPages) {
      return currentPage;
    }

    return [currentPage, ...pagesArr];
  }, [pages, currentPageId, showAllPages, renderItems]);

  // 组件选择框需要的数据
  const RenderModalArr = useMemo(() => {
    if (!selectedId) {
      return { targetKeys: [], treeSource: [], dataSource: [] };
    }
    const selectedCompArr = compsListObject[selectedId] || [];
    const targetKeys = selectedAllData[selectedId] || [];
    const treeSource = getCompTransferTitle(selectedCompArr);
    const dataSource = getDataSource(treeSource);

    return { targetKeys, treeSource, dataSource };
  }, [selectedId, selectedAllData, compsListObject]);

  const { id, name } = selectedPageItem || {};
  let transferTitle = null;
  if (id) {
    transferTitle = `${id}-${name}`;
  }

  return (
    <React.Fragment>
      <Item {...formItemLayout} label={''}>
        {getFieldDecorator(keyValue, {
          initialValue: initialValue,
        })(<div></div>)}
      </Item>

      {funcKey && (
        <Item {...formItemLayout} label={''} style={{ height: 0, marginBottom: 0 }}>
          {getFieldDecorator(`dynamicExpand.${funcKey}`, {
            initialValue: dynamicExpand[funcKey] || [],
          })(<span></span>)}
        </Item>
      )}

      <Spin spinning={compsLoading}>
        <div className={styles.pageListContent}>{RenderPageListContent}</div>
      </Spin>
      <TransferModalContent
        visible={showModal}
        onCancel={onModalCancel}
        showSetting={showSetting}
        onModalConfirm={onModalConfirm}
        treeSource={RenderModalArr.treeSource}
        dataSource={RenderModalArr.dataSource}
        targetKeys={RenderModalArr.targetKeys}
        dynamicExpandValue={funcKey && dynamicExpand[funcKey]}
        transferTitle={transferTitle}
      />
    </React.Fragment>
  );
};

//=====
const getCompTransferTitle = list => {
  return list.map(v => {
    let child = v.child;
    if (v.child && v.child.length) {
      child = getCompTransferTitle(v.child);
    }
    return {
      ...v,
      transferTitle: v.aliasName || v.compName,
      key: v.id,
      child,
    };
  });
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

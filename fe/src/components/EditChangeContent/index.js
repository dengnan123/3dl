import React, { useState, useMemo, useEffect } from 'react';
import { Drawer, Button, Form, Switch } from 'antd';
import { isArray } from 'lodash';
import { useAsyncFn, useEffectOnce } from 'react-use';
import { isFunction } from 'lodash';
// import classnames from 'classnames';

import { fetchPageUseCompList, getAllDataSource, fetchPageList } from '@/service';
import { getFormDefValue } from '@/helpers/form';
import { copyToClip } from '@/helpers/screen';
import { getParseSearch } from '@/helpers/utils';
import ModalWrapFooter from '@/components/ModalWrapFooter';
// import { useDoApi } from '@/hooks/apihost';

import PageListContent from './PageListContent';
import DataSourceContent from './DataSourceContent';
import ItemHighConfig from './ItemHighConfig';
import CompsDrawerList from './CompsDrawerList';

import styles from './index.less';

const { Item } = Form;

const formItemLayout = {
  labelCol: { span: 1 },
  wrapperCol: { span: 23 },
};

const useDoApi = (apiFunc, initFetch = false, params = {}) => {
  const [state, doApi] = useAsyncFn(
    async v => {
      if (!isFunction(apiFunc)) {
        throw new Error('apiFunc must a  function');
      }
      const response = await apiFunc(v);
      return response;
    },
    [apiFunc],
  );
  useEffectOnce(() => {
    if (initFetch) {
      doApi(params);
    }
  });
  return {
    doApi,
    state,
  };
};

export default ({
  form,
  form: { getFieldDecorator, setFieldsValue, getFieldValue },
  data,
  // initUseCompList: initArr,
  onCancel,
  onOk,
  childType,
}) => {
  const [drawerType, setVis] = useState(null);
  // 显示其他页面组件
  const [isShowAll, setShowAllPages] = useState(false);
  const { pageId, tagId } = getParseSearch();

  const { key, isCustomize, openKey, sourceType } = childType || {};
  const openHighConfig = isCustomize ? getFormDefValue(data, form, openKey, 0) : false;
  const openValues = openKey && data[openKey];
  const currentInitValue = data[key];

  useEffect(() => {
    if (sourceType === 'component' && (!isCustomize || !openValues)) {
      if (currentInitValue && !isArray(currentInitValue)) {
        const idsArr = Object.keys(currentInitValue) || [];
        const isShow = idsArr.length > 1 || (idsArr.length === 1 && !idsArr.includes(pageId));
        setShowAllPages(isShow);
      }
    }
  }, [sourceType, isCustomize, openValues, currentInitValue, pageId]);

  /** 请求数据(组件列表+数据源列表+页面列表) **/
  const { state: compState } = useDoApi(fetchPageUseCompList, true, {
    pageId,
    type: 'edit',
  });

  const { state } = useDoApi(getAllDataSource, true, {
    // pageId,
    tagId,
    isEdit: true,
  });

  // 页面列表
  const { state: pageState } = useDoApi(fetchPageList, true, {
    pageSize: 999,
    current: 1,
    tagId,
  });

  const initUseCompList = useMemo(() => compState?.value?.data || [], [compState]);
  const dataSourceList = state?.value?.data || [];
  const pageList = useMemo(() => pageState?.value?.data?.list || [], [pageState]);
  /** 请求数据(组件列表+数据源列表+页面列表) **/

  /*** 穿梭框需要的数据格式 ***/
  const getTransferTitle = v => {
    if (v.tagId) {
      return `${v.dataSourceName}--(公共)`;
    }
    return v.dataSourceName;
  };

  const transferDataSource = dataSourceList.map(v => {
    return {
      ...v,
      transferTitle: getTransferTitle(v),
      key: v.id,
    };
  });
  /*** 穿梭框需要的数据格式 ***/

  /** 组件ID+数据源ID */
  const renderDataSourceDiv = () => {
    return dataSourceList.map(v => {
      const { dataSourceName, id } = v;
      return (
        <div>
          <span>{dataSourceName}</span>
          --
          <Button
            type="link"
            onClick={() => {
              copyToClip(id);
            }}
          >
            {id}
          </Button>
        </div>
      );
    });
  };
  /** 组件ID+数据源ID */

  // 渲染内容
  const RenderContent = useMemo(() => {
    const { key, label, sourceType, showSetting, funcKey, isCustomize, customizeKey } =
      childType || {};
    // 高级配置 + 回调函数
    if ((isCustomize && openHighConfig) || sourceType === 'callback') {
      const editProps = {
        form,
        formItemLayout,
        data,
        field: customizeKey || key,
        titleFiledArr: [
          {
            key: 'data',
            des: '数据源数据',
          },
        ],
      };
      return <ItemHighConfig {...editProps} />;
    }

    const commonParams = {
      form,
      formItemLayout,
      data,
      showSetting,
      formItemConfig: {
        label,
        keyValue: key,
        initialValue: data[key],
        funcKey,
      },
    };

    // 组件类 和 数据源类 显示内容有差别
    if (sourceType === 'component') {
      return (
        <PageListContent
          pages={pageList}
          currentPageId={pageId}
          currentPageComps={initUseCompList}
          showAllPages={isShowAll}
          {...commonParams}
        />
      );
    }

    return <DataSourceContent dataSource={transferDataSource} {...commonParams} />;
  }, [
    form,
    data,
    transferDataSource,
    childType,
    openHighConfig,
    pageList,
    pageId,
    initUseCompList,
    isShowAll,
  ]);

  return (
    <ModalWrapFooter onCancel={onCancel} onOk={onOk}>
      <div className={styles.topDiv}>
        <div className={styles.btnWrapper}>
          <Button onClick={() => setVis('comp')}>查看组件ID</Button>
          <Button onClick={() => setVis('dataSource')}>查看数据源ID</Button>
        </div>

        <div className={styles.leftWrapper}>
          {isCustomize && (
            <div style={{ lineHeight: '30px' }}>
              <Item className={styles.hideItem} label={'高级'}>
                {getFieldDecorator(openKey, {
                  initialValue: data?.[openKey],
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
              </Item>
            </div>
          )}

          {sourceType === 'component' && (
            <div style={{ lineHeight: '30px' }}>
              展示其他页面：
              <Switch
                checked={isShowAll}
                onChange={checked => setShowAllPages(checked)}
                disabled={isCustomize && openHighConfig}
              />
            </div>
          )}
        </div>
      </div>

      {RenderContent}

      <Drawer
        visible={drawerType ? true : false}
        title={drawerType === 'dataSource' ? '数据源列表' : '组件列表'}
        placement="right"
        mask={false}
        width={500}
        className={styles.drawer}
        onClose={() => {
          setVis(null);
        }}
      >
        {drawerType === 'dataSource' ? (
          renderDataSourceDiv()
        ) : (
          <CompsDrawerList
            pages={pageList}
            currentPageId={pageId}
            currentPageComps={initUseCompList}
          />
        )}
      </Drawer>
    </ModalWrapFooter>
  );
};

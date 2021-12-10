import React, { useState } from 'react';
import { Drawer, Button, Form, Divider, Row, Col } from 'antd';
import { reap } from '@/components/SafeReaper';
import { getFormDefValue } from '@/helpers/form';
import { copyToClip } from '@/helpers/screen';
import ModalWrapFooter from '@/components/ModalWrapFooter';
import OnChangeItem from '@/components/OnChangeItem';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import DataSourceItem from '../DataSourceItem';
import { useDoApi } from '@/hooks/apihost';
// import { flattenArrByKey } from '@/helpers/arrayUtil';
import { getParseSearch } from '@/helpers/utils';
import { fetchPageUseCompList, getAllDataSource } from '@/service';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const formItemLayoutS = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};

export default ({
  form,
  form: { getFieldDecorator },
  data,
  // initUseCompList: initArr,
  onCancel,
  onOk,
}) => {
  const [drawerType, setVis] = useState(null);

  const { pageId, tagId } = getParseSearch();
  const { state: compState } = useDoApi(fetchPageUseCompList, true, {
    pageId,
    type: 'edit',
  });

  const { state } = useDoApi(getAllDataSource, true, {
    pageId,
    tagId,
    isEdit: true,
  });

  const initUseCompList = compState?.value?.data || [];
  const dataSourceList = state?.value?.data || [];
  // const initUseCompList = flattenArrByKey(initArr);

  const options = dataSourceList.map(v => {
    return {
      label: v.dataSourceName,
      value: v.id,
    };
  });

  /*** 穿梭框需要的数据格式 ***/
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
  const transferCompsSource = getCompTransferTitle(initUseCompList);

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

  // const clearCompParamsOptions = initUseCompList
  //   .map((v) => {
  //     return {
  //       label: v.aliasName || v.compName,
  //       value: v.id,
  //     };
  //   })
  //   .filter((v) => v.value !== data.id);

  const hiddenCompsOpts = initUseCompList.map(v => {
    return {
      label: v.aliasName || v.compName,
      value: v.id,
    };
  });

  const renderCompDiv = () => {
    const finalArr = [];
    const formatArr = (result = [], arr = []) => {
      arr.forEach(n => {
        if (n?.child?.length) {
          formatArr(result, n?.child);
        }
        result.push(n);
      });
    };

    formatArr(finalArr, initUseCompList);

    return finalArr.map(v => {
      const name = v.aliasName || v.compName;
      return (
        <div>
          <span>{name}</span>
          --
          <Button
            type="link"
            onClick={() => {
              copyToClip(v.id);
            }}
          >
            {v.id}
          </Button>
        </div>
      );
    });
  };

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

  const openHiddenCompsFilterFunc = getFormDefValue(data, form, 'openHiddenCompsFilterFunc', 0);
  const openShowCompsFilterFunc = getFormDefValue(data, form, 'openShowCompsFilterFunc', 0);
  const openDepsFilterFunc = getFormDefValue(data, form, 'openDepsFilterFunc', 0);
  const openClearApiDepsFunc = getFormDefValue(data, form, 'openClearApiDepsFunc', 0);
  const openClearParamsCompsFunc = getFormDefValue(data, form, 'openClearParamsCompsFunc', 0);
  const openCacheParamsDepsFunc = getFormDefValue(data, form, 'openCacheParamsDepsFunc', 0);
  const openClearApiParamsDepsFunc = getFormDefValue(data, form, 'openClearApiParamsDepsFunc', 0);

  const depProps = {
    form,
    formItemLayout,
    openHighConfig: openDepsFilterFunc,
    data,
    options,
    setVis,
    _key: 'deps',
    keyLabel: '联动数据源',
    openKey: 'openDepsFilterFunc',
    openKeyLabel: '联动数据源高配',
    funcKey: 'depsFilterFunc',
    // btnLabel: '数据源ID',
  };

  const showCompsProps = {
    form,
    formItemLayout,
    openHighConfig: openShowCompsFilterFunc,
    data,
    options: hiddenCompsOpts,
    setVis,
    _key: 'showComps',
    keyLabel: '显示组件',
    openKey: 'openShowCompsFilterFunc',
    openKeyLabel: '显示组件高配',
    funcKey: 'showCompsFilterFunc',
    // btnLabel: '组件ID',
  };

  const hiddenCompsProps = {
    form,
    formItemLayout,
    openHighConfig: openHiddenCompsFilterFunc,
    data,
    options: hiddenCompsOpts,
    setVis,
    _key: 'hiddenComps',
    keyLabel: '隐藏组件',
    openKey: 'openHiddenCompsFilterFunc',
    openKeyLabel: '隐藏组件高配',
    funcKey: 'hiddenCompsFilterFunc',
    // btnLabel: '组件ID',
  };

  const clearApiDataProps = {
    form,
    formItemLayout,
    openHighConfig: openClearApiDepsFunc,
    data,
    options,
    setVis,
    _key: 'clearApiDeps',
    keyLabel: '清理数据源',
    openKey: 'openClearApiDepsFunc',
    openKeyLabel: '清理数据源高配',
    funcKey: 'clearApiDepsFunc',
    // btnLabel: '数据源ID',
  };

  const clearApiDataParamsProps = {
    form,
    formItemLayout,
    openHighConfig: openClearApiParamsDepsFunc,
    data,
    options,
    setVis,
    _key: 'clearApiParamsDeps',
    keyLabel: '清理数据源条件',
    openKey: 'openClearApiParamsDepsFunc',
    openKeyLabel: '清理数据源高配',
    funcKey: 'clearApiParamsDeps',
    // btnLabel: '数据源ID',
  };

  const clearParamsCompsProps = {
    form,
    formItemLayout,
    openHighConfig: openClearParamsCompsFunc,
    data,
    options: hiddenCompsOpts,
    setVis,
    _key: 'clearParamsComps',
    keyLabel: '清除组件条件',
    openKey: 'openClearParamsCompsFunc',
    openKeyLabel: '清除组件条件高配',
    funcKey: 'clearParamsCompsFunc',
  };

  const cacheParamsDepsProps = {
    form,
    formItemLayout,
    openHighConfig: openCacheParamsDepsFunc,
    data,
    options,
    setVis,
    _key: 'cacheParamsDeps',
    keyLabel: '缓存条件数据源',
    openKey: 'openCacheParamsDepsFunc',
    openKeyLabel: '缓存条件数据源高配',
    funcKey: 'cacheParamsDepsFunc',
  };

  const wrapProps = {
    onCancel,
    onOk,
  };

  const clickCallbackFuncProps = {
    form,
    formItemLayout: formItemLayoutS,
    data,
    btnText: '设置',
    btnSize: 'small',
    field: 'clickCallbackFunc',
    formLabel: '回调函数',
    titleFiledArr: [
      {
        key: 'data',
        des: '数据源数据',
      },
    ],
  };
  return (
    <ModalWrapFooter {...wrapProps}>
      <Row>
        <Col span={6}>
          <Form.Item {...formItemLayoutS} label="组件ID">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setVis('comp');
              }}
            >
              查看
            </Button>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item {...formItemLayoutS} label="数据源ID">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setVis('dataSource');
              }}
            >
              查看
            </Button>
          </Form.Item>
        </Col>
        <Col span={6}>
          <ModalCodeEdit {...clickCallbackFuncProps}></ModalCodeEdit>
        </Col>
        <Col span={6}>
          <Form.Item {...formItemLayoutS} label="页面跳转">
            {getFieldDecorator('pageSwitch', {
              initialValue: reap(data, 'pageSwitch', ''),
            })(
              <Button type="primary" size="small" disabled={true}>
                设置
              </Button>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed={true} />

      <DataSourceItem
        form={form}
        formItemLayout={formItemLayout}
        data={data}
        dataSource={transferCompsSource}
        showSetting={true}
        formItemConfig={{
          label: '传参到其他组件',
          keyValue: 'passParamsComps',
          initialValue: data?.passParamsComps || [],
          funcKey: 'otherCompParamsFilterFuncArr',
          tooltip: `如果需要传参到其他页面请写代码`,
        }}
      ></DataSourceItem>

      <Divider dashed={true} />

      <OnChangeItem {...hiddenCompsProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferCompsSource}
          showSetting={false}
          formItemConfig={{
            label: '隐藏组件',
            keyValue: 'hiddenComps',
            initialValue: reap(data, 'hiddenComps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>

      <Divider dashed={true} />
      <OnChangeItem {...showCompsProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferCompsSource}
          showSetting={false}
          formItemConfig={{
            label: '显示组件',
            keyValue: 'showComps',
            initialValue: reap(data, 'showComps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>

      <Divider dashed={true} />
      <OnChangeItem {...clearParamsCompsProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferCompsSource.filter(i => i.id !== data.id)}
          showSetting={false}
          formItemConfig={{
            label: '清除组件条件',
            keyValue: 'clearParamsComps',
            initialValue: reap(data, 'clearParamsComps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>

      <Divider dashed={true} />
      <OnChangeItem {...depProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferDataSource}
          showSetting={false}
          formItemConfig={{
            label: '联动数据源',
            keyValue: 'deps',
            initialValue: reap(data, 'deps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>

      <Divider dashed={true} />
      <OnChangeItem {...clearApiDataProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferDataSource}
          showSetting={false}
          formItemConfig={{
            label: '清理数据源',
            keyValue: 'clearApiDeps',
            initialValue: reap(data, 'clearApiDeps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>


      {/* <OnChangeItem {...clearApiDataParamsProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferDataSource}
          showSetting={false}
          formItemConfig={{
            label: '清理数据源',
            keyValue: 'clearApiParamsDeps',
            initialValue: reap(data, 'clearApiParamsDeps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem> */}

      <Divider dashed={true} />
      <OnChangeItem {...cacheParamsDepsProps}>
        <DataSourceItem
          form={form}
          formItemLayout={formItemLayout}
          data={data}
          dataSource={transferDataSource}
          showSetting={false}
          formItemConfig={{
            label: '缓存条件数据源',
            keyValue: 'cacheParamsDeps',
            initialValue: reap(data, 'cacheParamsDeps', []),
          }}
        ></DataSourceItem>
      </OnChangeItem>

      <Divider dashed={true} />
      <DataSourceItem
        form={form}
        formItemLayout={formItemLayout}
        data={data}
        dataSource={transferDataSource}
        showSetting={false}
        formItemConfig={{
          label: 'loading关联数据源',
          keyValue: 'loadingDeps',
          initialValue: reap(data, 'loadingDeps', []),
        }}
      ></DataSourceItem>

      {/* <Item {...formItemLayout} label="回调函数">
        {getFieldDecorator('clickCallbackFunc', {
          initialValue: reap(data, 'clickCallbackFunc', ''),
        })(<AceEditor {...editProps}></AceEditor>)}
      </Item> */}
      {/* <ModalCodeEdit {...clickCallbackFuncProps}></ModalCodeEdit> */}

      <Drawer
        visible={drawerType ? true : false}
        title="Basic Drawer"
        placement="right"
        mask={false}
        width={500}
        className={styles.drawer}
        onClose={() => {
          setVis(null);
        }}
      >
        {drawerType === 'dataSource' ? renderDataSourceDiv() : renderCompDiv()}
      </Drawer>
    </ModalWrapFooter>
  );
};

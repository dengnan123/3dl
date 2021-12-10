import React from 'react';
import { Form, Switch, Button } from 'antd';
import { reap } from '@/components/SafeReaper';
import { getFormDefValue } from '@/helpers/form';
import { copyToClip } from '@/helpers/screen';
import styles from './index.less';
import AceEditor from '@/components/AceEditor';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import { getAllDataSource } from '@/service';
import { useDoApi } from '@/hooks/apihost';
import { getParseSearch } from '@/helpers/utils';
import DataSourceItem from '../DataSourceItem';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const DataConfig = props => {
  const {
    form,
    form: { getFieldDecorator },
    data,
    staticData,
  } = props;
  const { tagId } = getParseSearch();
  const { state } = useDoApi(getAllDataSource, true, {
    // pageId,
    tagId,
    isEdit: true,
  });
  const dataSourceList = state?.value?.data || [];

  const exampleEditProps = {
    language: 'javascript',
    value: JSON.stringify(staticData, null, 2),
    titleFiledArr: [],
    showFooter: false,
    disCode: true,
  };

  const basicProps = {
    form,
    formItemLayout,
    data,
    btnText: '设置',
    btnSize: 'small',
  };

  const filterFuncProps = {
    ...basicProps,
    field: 'filterFunc',
    formLabel: '数据过滤器',
    titleFiledArr: [
      {
        key: 'data',
        des: '数据源数据',
      },
    ],
  };

  const high = getFormDefValue(data, form, 'openHighConfig', 0);
  const openDataExample = getFormDefValue(data, form, 'openDataExample', false);
  const dataSourceId = getFormDefValue(data, form, 'dataSourceId', []);
  const openMultipleDataConfig = getFormDefValue(data, form, 'openMultipleDataConfig', 0);
  const dataSourceIdConfigArr = dataSourceList.filter(v => {
    const { id } = v;
    if (dataSourceId.includes(id)) {
      return true;
    }
    return false;
  });

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

  console.log('data', data);

  return (
    <div className={styles.apiConfig}>
      {/* <Form.Item label="选择数据源" {...formItemLayout}>
        {getFieldDecorator('dataSourceId', {
          initialValue: data?.dataSourceId || [],
        })(
          <Select style={{ width: '100%' }} placeholder="选择数据源" mode="multiple">
            {dataSourceList.map(v => {
              return (
                <Option key={v.id} value={v.id}>
                  {v.dataSourceName}
                </Option>
              );
            })}
          </Select>,
        )}
      </Form.Item> */}

      <DataSourceItem
        form={form}
        formItemLayout={formItemLayout}
        data={data}
        dataSource={transferDataSource}
        showSetting={false}
        formItemConfig={{
          label: '选择数据源',
          keyValue: 'dataSourceId',
          initialValue: data?.dataSourceId || [],
        }}
      ></DataSourceItem>

      <Form.Item label="多数据源设置" {...formItemLayout}>
        {getFieldDecorator('openMultipleDataConfig', {
          initialValue: reap(data, 'openMultipleDataConfig', 0),
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {openMultipleDataConfig ? (
        <Form.Item label="数据源" {...formItemLayout}>
          {dataSourceIdConfigArr.map(v => {
            return (
              <div key={v.id}>
                <span>{v.dataSourceName}</span>
                ---
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    copyToClip(v.id);
                  }}
                >
                  复制ID
                </Button>
              </div>
            );
          })}
        </Form.Item>
      ) : null}

      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: reap(data, 'openHighConfig', 0) ? true : false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {high ? (
        // <Form.Item label="过滤器" {...formItemLayout}>
        //   {getFieldDecorator('filterFunc', {
        //     initialValue: reap(data, 'filterFunc', ''),
        //   })(<AceEditor {...editProps}></AceEditor>)}
        // </Form.Item>
        <ModalCodeEdit {...filterFuncProps}></ModalCodeEdit>
      ) : null}
      <Form.Item label="查看数据示例" {...formItemLayout}>
        {getFieldDecorator('openDataExample', {
          initialValue: false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openDataExample ? (
        <Form.Item label="数据格式" {...formItemLayout}>
          <AceEditor {...exampleEditProps}></AceEditor>
        </Form.Item>
      ) : null}
    </div>
  );
};

export default DataConfig;

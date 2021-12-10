import React, { useState, useEffect, useCallback } from 'react';
import useForceUpdate from 'use-force-update';
import { Form, Select, Button, Modal } from 'antd';
// import { useDebounceFn } from '@umijs/hooks';
import { reap } from '../SafeReaper';
import styles from './index.less';
import CodeEdit from '../CodeEditExa';

const { Option } = Select;

const DataConfig = props => {
  const {
    form: { getFieldDecorator, resetFields, getFieldValue },
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    compName,
    data,
  } = props;

  const forceUpdate = useForceUpdate();

  const [{ vis, code, disCode }, setState] = useState({
    vis: false,
    code: {},
    disCode: false,
    btnDebuggLoading: false,
  });

  const getCode = useCallback(
    () => {
      let _code = {};
      if (JSON.stringify(propsMockData) !== '{}') {
        _code = propsMockData;
      }
      return _code;
    },
    [propsMockData],
  );

  useEffect(
    () => {
      setState(pre => {
        return {
          ...pre,
          code: getCode(),
        };
      });
    },
    [propsMockData, compName, setState, getCode],
  );

  useEffect(
    () => {
      resetFields();
      forceUpdate();
      console.log('重置表单刷新');
    },
    [resetFields, data, forceUpdate],
  );

  const handleChange = v => {
    setState(pre => {
      return {
        ...pre,
        selKey: v,
        disCode: false,
        code: getCode(),
      };
    });
  };

  const handleCancel = () => {
    setState(v => {
      return {
        ...v,
        vis: false,
      };
    });
  };

  const update = newCode => {
    updateMockData({
      mockData: newCode,
    });
    setState(v => {
      return {
        ...v,
        vis: false,
      };
    });
  };

  const editProps = {
    update,
    code,
    disCode,
  };

  const showModal = () => {
    setState(v => {
      return {
        ...v,
        vis: true,
      };
    });
  };

  console.log('editProps is', editProps);
  const useDataType = getFieldValue('useDataType');

  return (
    <div className={styles.compConfig}>
      <Form.Item label="数据绑定方式" {...formItemLayout}>
        {getFieldDecorator('useDataType', {
          initialValue: reap(data, 'useDataType', 'JSON'),
        })(
          <Select style={{ width: 120 }} onChange={handleChange}>
            {/* <Option value="sel">请选择</Option> */}
            <Option value="JSON">静态JSON</Option>
          </Select>,
        )}
      </Form.Item>

      {useDataType === 'JSON' && (
        <div>
          <Button type="primary" onClick={showModal}>
            使用数据创建JSON
          </Button>
        </div>
      )}

      <Modal
        visible={vis}
        centered={true}
        title={'静态JSON'}
        footer={null}
        onCancel={handleCancel}
        width={1000}
        destroyOnClose={true}
      >
        <CodeEdit {...editProps} />
      </Modal>
    </div>
  );
};

export default Form.create()(DataConfig);

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Button, Modal, notification, Empty } from 'antd';
import { CompInfoInstant } from '@/helpers/screen';
import { validateFunc } from '@/components/AceEditor/util';
import JsonDataConfig from '../JsonDataConfig';
import styles from './index.less';

const { Option } = Select;

const DataConfig = props => {
  const {
    form: { getFieldDecorator, getFieldsValue, getFieldValue },
    form,
    formItemLayout,
    updateMockData,
    compName,
    selectedCompInfo,
    attributeUpdate,
  } = props;

  const staticData = CompInfoInstant.getCompStaticDataByCompName(compName);

  const useDataType = getFieldValue('useDataType') || selectedCompInfo?.useDataType;

  const [{ vis }, setState] = useState({ vis: false });

  const handleCancel = useCallback(() => {
    setState(v => {
      return {
        ...v,
        vis: false,
      };
    });
  }, []);

  const showModal = useCallback(() => {
    setState(v => {
      return {
        ...v,
        vis: true,
      };
    });
  }, []);

  const handleOk = useCallback(() => {
    const newFields = getFieldsValue() || {};

    const validateMsg = validateFunc('json', newFields.mockData);
    if (validateMsg) {
      notification.open({
        message: 'Error',
        description: 'json格式错误',
      });
      return;
    }
    const mockDataNew = JSON.parse(newFields.mockData);
    updateMockData({
      ...selectedCompInfo,
      mockData: mockDataNew,
      useDataType: 'JSON',
    });
    handleCancel();
  }, [handleCancel, updateMockData, getFieldsValue]);

  const jsonConfigProps = {
    form,
    data: selectedCompInfo,
    staticData,
  };

  const modalProps = {
    JSON: <JsonDataConfig {...jsonConfigProps} />,
  };

  const onUseDataTypeChange = useCallback(
    v => {
      attributeUpdate({
        id: selectedCompInfo.id,
        useDataType: v,
      });
    },
    [attributeUpdate, selectedCompInfo],
  );

  if (!selectedCompInfo) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div className={styles.compConfig}>
      <Form.Item label="数据绑定来源" {...formItemLayout}>
        {getFieldDecorator('useDataType', {
          initialValue: 'JSON',
        })(
          <Select onChange={onUseDataTypeChange}>
            <Option value="JSON">静态JSON</Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="数据绑定" colon={false}>
        <Button type="primary" onClick={showModal}>
          配置
        </Button>
      </Form.Item>

      <Modal
        title="配置"
        visible={vis}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1300}
        destroyOnClose={true}
        maskClosable={false}
      >
        {modalProps[useDataType]}
      </Modal>
    </div>
  );
};

DataConfig.propTypes = {
  attributeUpdate: PropTypes.func,
  updateMockData: PropTypes.func,
  form: PropTypes.object,
  formItemLayout: PropTypes.object,
  compName: PropTypes.string,
  selectedCompInfo: PropTypes.object,
};

export default Form.create()(DataConfig);

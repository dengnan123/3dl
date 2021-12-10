import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Form, Select, Button, Modal, notification } from 'antd';

import { CompInfoInstant, transformCode } from '@/helpers/screen';
import { validateFunc } from '@/components/AceEditor/util';
// import ExcelDataConfig from '../ExcelDataConfig';
import StaticDataConfig from '../JsonDataConfig';
import ApiConfig from '../ApiConfig';
import DatabaseConfig from '../DatabaseConfig';
// import { useDoApi } from '@/hooks/apiHost';
// import { updatePageComp } from '@/service';

import styles from './index.less';
const { Option } = Select;

const DataTypeEnum = {
  JSON: 'JSON',
  API: 'API',
  DATABASE: 'DATABASE',
};

const DataTypeLabelEnum = {
  [DataTypeEnum.JSON]: '静态数据',
  [DataTypeEnum.API]: '动态数据',
  [DataTypeEnum.DATABASE]: '数据库',
};

const DataConfig = props => {
  const {
    form: { getFieldDecorator, getFieldsValue, getFieldValue },
    form,
    formItemLayout,
    updateMockData,
    data,
    // getAllDataSourceByPageId,
    // dataSourceList,
    compName,
    isSelectCompInfo,
  } = props;

  const staticData = CompInfoInstant.getCompStaticDataByCompName(compName);

  const useDataType = getFieldValue('useDataType') || data.useDataType;

  const [{ vis }, setState] = useState({
    vis: false,
    code: {},
    disCode: false,
    btnDebuggLoading: false,
    selKey: useDataType,
    modalKey: '',
  });

  const handleCancel = () => {
    setState(v => {
      return {
        ...v,
        vis: false,
      };
    });
  };

  const showModal = () => {
    setState(v => {
      return {
        ...v,
        vis: true,
      };
    });
  };

  const handleOk = () => {
    const newFields = getFieldsValue();
    if ([DataTypeEnum.JSON, 'Excel'].includes(newFields.useDataType)) {
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
        ...isSelectCompInfo,
        mockData: mockDataNew,
        useDataType: DataTypeEnum.JSON,
      });
      handleCancel();
      return;
    }

    if (newFields.useDataType === DataTypeEnum.DATABASE) {
      updateMockData(newFields);
      handleCancel();
      return;
    }

    const _newFileds = {
      ...newFields,
    };

    if (_newFileds.filterFunc) {
      const validateMsg = validateFunc('javascript', _newFileds.filterFunc);
      if (validateMsg) {
        notification.open({
          message: 'Error',
          description: JSON.stringify(validateMsg),
        });
        return;
      }
      const es5code = transformCode(_newFileds.filterFunc);
      _newFileds.filterFuncEs5Code = es5code;
    }
    updateMockData(_newFileds);
    handleCancel();
  };

  const jsonConfigProps = {
    form,
    data,
    staticData,
  };

  // const excelConfigProps = {
  //   form,
  //   data,
  //   staticData,
  // };

  const apiConfigProps = {
    form,
    data,
    staticData,
  };

  const databaseConfigProps = {
    form,
    data,
    staticData,
  };

  const modalProps = {
    [DataTypeEnum.JSON]: <StaticDataConfig {...jsonConfigProps} />,
    [DataTypeEnum.API]: <ApiConfig {...apiConfigProps} />,
    [DataTypeEnum.DATABASE]: <DatabaseConfig {...databaseConfigProps} />,
  };

  const selChange = v => {
    const { attributeUpdate, isSelectCompInfo } = props;
    attributeUpdate({
      id: isSelectCompInfo.id,
      data: {
        useDataType: v,
      },
    });
  };

  const modalTitle = {
    [DataTypeEnum.JSON]: '静态配置',
    [DataTypeEnum.API]: 'API配置',
    [DataTypeEnum.DATABASE]: '直连数据库配置',
  };

  return (
    <div className={styles.compConfig}>
      <Form.Item label="数据绑定来源" {...formItemLayout}>
        {getFieldDecorator('useDataType', {
          initialValue: data.useDataType,
        })(
          <Select style={{ width: 120 }} onChange={selChange}>
            {Object.keys(DataTypeEnum).map(key => (
              <Option key={key} value={key}>
                {DataTypeLabelEnum[key]}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="">
        <Button type="primary" onClick={showModal}>
          数据绑定配置
        </Button>
      </Form.Item>

      <Modal
        title={modalTitle[useDataType]}
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

export default Form.create({})(DataConfig);

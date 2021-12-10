import React, { useEffect } from 'react';
import { Form, Input, InputNumber } from 'antd';

const MobileRegionalCascadeConfig = props => {
  const { formItemLayout, form, id, style } = props;

  const { getFieldDecorator, resetFields } = form;

  const {
    compKey,
    domId = '',
    paddingTop = 0,
    apiHostEnvKey = 'API_HOST_COMP_PLACEHOLDER__',
    apiHost = 'https://www.fastmock.site/mock/29adb8c7e763fd69d52f9c23f533f21e/test',
    apiPath = '/list',
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="下拉框挂载的dom节点id">
        {getFieldDecorator(`domId`, {
          initialValue: domId,
        })(<Input placeholder="domId" />)}
      </Form.Item>

      <Form.Item label="下拉列表上边距">
        {getFieldDecorator(`paddingTop`, {
          initialValue: paddingTop,
        })(<InputNumber placeholder="上边距" min={0} />)}
      </Form.Item>

      <Form.Item label="环境变量key值,用来打包后替换下面接口api_host">
        {getFieldDecorator(`apiHostEnvKey`, {
          initialValue: apiHostEnvKey,
        })(<Input placeholder="打包需要替换的环境变量key值" />)}
      </Form.Item>

      <Form.Item label="接口 api_host">
        {getFieldDecorator(`apiHost`, {
          initialValue: apiHost,
        })(<Input placeholder="打包需要替换的环境变量key值" />)}
      </Form.Item>

      <Form.Item label="接口路径">
        {getFieldDecorator(`apiPath`, {
          initialValue: apiPath,
        })(<Input placeholder="接口路径" />)}
      </Form.Item>

      <Form.Item label="compKey" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input placeholder="compKey" />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(MobileRegionalCascadeConfig);

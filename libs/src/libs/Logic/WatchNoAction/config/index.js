import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, Input, InputNumber } from 'antd';

const WatchNoActionConfig = props => {
  const {
    style = {},
    form: { getFieldDecorator, resetFields },
    formItemLayout,
    id,
  } = props;

  const { elementId, interval = 60 * 1000 } = style;

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="监听操作dom节点id(默认监听body)" {...formItemLayout}>
        {getFieldDecorator('elementId', {
          initialValue: elementId,
        })(<Input placeholder="请输入dom节点id" />)}
      </Form.Item>

      <Form.Item label="无操作时间间隔(毫秒)" {...formItemLayout}>
        {getFieldDecorator('interval', {
          initialValue: interval,
          rules: [{ type: 'integer', message: '请输入整数' }],
        })(<InputNumber placeholder="请输入时间间隔" min={0} />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(WatchNoActionConfig);

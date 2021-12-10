import React, { useEffect } from 'react';
import { Form, Input, Switch, Select, InputNumber } from 'antd';
import { debounce } from 'lodash';

const {TextArea} = Input
const IframeConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    iframeUrl,
    openBale = false,
    iframeUrlHostKey = '',
    frameborder = false,
    scrolling = 'yes',
    noRefreshSwitch,
    useOverflowHiddenY = false,
    useMinWidth = false,
    minWidth = 0,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="链接" {...formItemLayout}>
        {getFieldDecorator('iframeUrl', {
          initialValue: iframeUrl,
        })(<TextArea />)}
      </Form.Item>

      <Form.Item label="开启打包部署动态替换链接" {...formItemLayout}>
        {getFieldDecorator('openBale', {
          initialValue: openBale,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="环境变量key值,用来打包后替换链接">
        {getFieldDecorator(`iframeUrlHostKey`, {
          initialValue: iframeUrlHostKey,
        })(<Input placeholder="打包需要替换的环境变量key值" />)}
      </Form.Item>

      <Form.Item label="开启最小宽度" {...formItemLayout}>
        {getFieldDecorator('useMinWidth', {
          initialValue: useMinWidth,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="开启超出高度隐藏" {...formItemLayout}>
        {getFieldDecorator('useOverflowHiddenY', {
          initialValue: useOverflowHiddenY,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="最小宽度" {...formItemLayout}>
        {getFieldDecorator('minWidth', {
          initialValue: minWidth,
        })(<InputNumber disabled={!useMinWidth} min={0} />)}
      </Form.Item>

      <Form.Item label="无刷新切换" {...formItemLayout}>
        {getFieldDecorator('noRefreshSwitch', {
          initialValue: noRefreshSwitch,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="是否显示边框" {...formItemLayout}>
        {getFieldDecorator('frameborder', {
          initialValue: frameborder,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="是否显示滚动条" {...formItemLayout}>
        {getFieldDecorator('scrolling', {
          initialValue: scrolling,
        })(
          <Select>
            <Select.Option value="yes">是</Select.Option>
            <Select.Option value="no">否</Select.Option>
            <Select.Option value="auto">自动</Select.Option>
          </Select>,
        )}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
    } = props;
    const newFields = getFieldsValue();

    // 处理数据
    updateStyle &&
      updateStyle({
        ...newFields,
      });
  }, 500),
})(IframeConfig);

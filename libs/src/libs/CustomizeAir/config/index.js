import { useEffect } from 'react';
import { Form, InputNumber, Input } from 'antd';
import { debounce } from 'lodash';
function CustomizeAirConfig(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    style,
    id,
  } = props;

  const {
    // showTitle = false,
    // showMore = false,
    width = 223,
    height = 1000,
    tempTop = 224,
    humidityTop = 535,
    densityTop = 833,
    valueFontSize = 46,
    perFontSize = 24,
    BgImg = '',
  } = style || {};

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="容器宽度" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width || null,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="容器高度" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height || null,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="温度 Top值" {...formItemLayout}>
        {getFieldDecorator('tempTop', {
          initialValue: tempTop || null,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="湿度 Top值" {...formItemLayout}>
        {getFieldDecorator('humidityTop', {
          initialValue: humidityTop || null,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="PM2.5 Top值" {...formItemLayout}>
        {getFieldDecorator('densityTop', {
          initialValue: densityTop || null,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="value 字体大小" {...formItemLayout}>
        {getFieldDecorator('valueFontSize', {
          initialValue: valueFontSize || null,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="单位 字体大小" {...formItemLayout}>
        {getFieldDecorator('perFontSize', {
          initialValue: perFontSize || null,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="组件背景图URL" {...formItemLayout}>
        {getFieldDecorator('BgImg', {
          initialValue: BgImg || null,
        })(<Input />)}
      </Form.Item>

      {/* <Form.Item label="是否显示标题" {...formItemLayout}>
        {getFieldDecorator('showTitle', {
          initialValue: showTitle,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="是否显示更多按钮" {...formItemLayout}>
        {getFieldDecorator('showMore', {
          initialValue: showMore,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item> */}
      {/* <Form.Item label="是否显示边框" {...formItemLayout}>
        {getFieldDecorator('showBorder', {
          initialValue: showBorder,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="是否显示阴影" {...formItemLayout}>
        {getFieldDecorator('showBoxShadow', {
          initialValue: showBoxShadow,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item> */}
    </div>
  );
}

CustomizeAirConfig.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();

    delete newFields['initialPopoverContentList'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(CustomizeAirConfig);

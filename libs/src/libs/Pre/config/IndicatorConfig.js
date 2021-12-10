import { Fragment } from 'react';
import { Form, InputNumber, Switch } from 'antd';
import InputColor from '../../../components/InputColor';

function IndicatorConfig({ form: { getFieldDecorator }, data, formItemLayout }) {
  const { show, bottom, width, height, distance, borderRadius, bgColor, highlightBgColor } =
    data || {};
  return (
    <Fragment>
      <Form.Item label="开启" {...formItemLayout}>
        {getFieldDecorator('indicatorData.show', {
          initialValue: show ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="距离底部位置(bottom)" {...formItemLayout}>
        {getFieldDecorator('indicatorData.bottom', {
          initialValue: bottom ?? 30,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="宽度" {...formItemLayout}>
        {getFieldDecorator('indicatorData.width', {
          initialValue: width ?? 8,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="高度" {...formItemLayout}>
        {getFieldDecorator('indicatorData.height', {
          initialValue: height ?? 8,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="间距" {...formItemLayout}>
        {getFieldDecorator('indicatorData.distance', {
          initialValue: distance ?? 8,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="圆角" {...formItemLayout}>
        {getFieldDecorator('indicatorData.borderRadius', {
          initialValue: borderRadius ?? 4,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="背景色" {...formItemLayout}>
        {getFieldDecorator('indicatorData.bgColor', {
          initialValue: bgColor ?? 'rgba(255,255,255,0.3)',
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="高亮背景色" {...formItemLayout}>
        {getFieldDecorator('indicatorData.highlightBgColor', {
          initialValue: highlightBgColor ?? 'rgba(255,255,255,1)',
        })(<InputColor />)}
      </Form.Item>
    </Fragment>
  );
}

export default IndicatorConfig;

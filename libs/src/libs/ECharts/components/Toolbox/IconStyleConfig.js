import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Select } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;
const { Option } = Select;

const IconStyleConfig = props => {
  const { data, form, formItemLayout } = props;
  const { getFieldDecorator } = form;

  return (
    <>
      <FormItem label="图标颜色" {...formItemLayout}>
        {getFieldDecorator('iconStyle.color', {
          initialValue: data?.iconStyle?.color ?? 'rgba(255,255,255,0)',
        })(<InputColor />)}
      </FormItem>

      <FormItem label="透明度" {...formItemLayout}>
        {getFieldDecorator('iconStyle.opacity', {
          initialValue: data?.iconStyle?.opacity ?? 1,
        })(<InputNumber min={0} max={1} step={1} />)}
      </FormItem>

      <FormItem label="边框粗细" {...formItemLayout}>
        {getFieldDecorator('iconStyle.borderWidth', {
          initialValue: data?.iconStyle?.borderWidth ?? 1,
        })(<InputNumber min={0} step={1} />)}
      </FormItem>

      <FormItem label="边框颜色" {...formItemLayout}>
        {getFieldDecorator('iconStyle.borderColor', {
          initialValue: data?.iconStyle?.borderColor ?? '#666666',
        })(<InputColor />)}
      </FormItem>

      <FormItem label="边框类型" {...formItemLayout}>
        {getFieldDecorator('iconStyle.borderType', {
          initialValue: data?.iconStyle?.borderType ?? 'solid',
        })(
          <Select style={{ width: '100%' }}>
            <Option value="solid">实线</Option>
            <Option value="dashed">虚线</Option>
            <Option value="dotted">点</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="阴影颜色" {...formItemLayout}>
        {getFieldDecorator('iconStyle.shadowColor', {
          initialValue: data?.iconStyle?.shadowColor,
        })(<InputColor />)}
      </FormItem>

      <FormItem label="阴影模糊距离" {...formItemLayout}>
        {getFieldDecorator('iconStyle.shadowBlur', {
          initialValue: data?.iconStyle?.shadowBlur,
        })(<InputNumber step={1} />)}
      </FormItem>

      <FormItem label="阴影水平方向上的偏移距离" {...formItemLayout}>
        {getFieldDecorator('iconStyle.shadowOffsetX', {
          initialValue: data?.iconStyle?.shadowOffsetX,
        })(<InputNumber step={1} />)}
      </FormItem>

      <FormItem label="阴影垂直方向上的偏移距离" {...formItemLayout}>
        {getFieldDecorator('iconStyle.shadowOffsetY', {
          initialValue: data?.iconStyle?.shadowOffsetY,
        })(<InputNumber step={1} />)}
      </FormItem>
    </>
  );
};

IconStyleConfig.propTypes = {
  data: PropTypes.object,
  form: PropTypes.shape({ getFieldDecorator: PropTypes.func }),
  formItemLayout: PropTypes.object,
};

export default IconStyleConfig;

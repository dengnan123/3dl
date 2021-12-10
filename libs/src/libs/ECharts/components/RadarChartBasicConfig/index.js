import React, { Fragment } from 'react';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';

import { Form, InputNumber, Switch, Select } from 'antd';

const FormItem = Form.Item;

const RadarChartBasicConfig = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  style,
}) => {
  return (
    <Fragment>
      <FormItem label="是否只显示一个坐标轴" {...formItemLayout}>
        {getFieldDecorator(`showOneAxisLine`, {
          initialValue: reap(style, `showOneAxisLine`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {reap(style, `showOneAxisLine`, false) && (
        <>
          <FormItem label="坐标轴颜色" {...formItemLayout}>
            {getFieldDecorator(`oneAxisLine.axisLine.lineStyle.color`, {
              initialValue: reap(style, `oneAxisLine.axisLine.lineStyle.color`, ''),
            })(<InputColor />)}
          </FormItem>
        </>
      )}

      <FormItem label="显示面积图" {...formItemLayout}>
        {getFieldDecorator(`showArea`, {
          initialValue: reap(style, `showArea`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="面积透明度" {...formItemLayout}>
        {getFieldDecorator(`areaStyle.opacity`, {
          initialValue: reap(style, `areaStyle.opacity`, 0.2),
        })(<InputNumber min={0} max={1} />)}
      </FormItem>

      <FormItem label="折线宽度" {...formItemLayout}>
        {getFieldDecorator(`lineStyle.width`, {
          initialValue: reap(style, `lineStyle.width`, 1),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="折线类型" {...formItemLayout}>
        {getFieldDecorator(`lineStyle.type`, {
          initialValue: reap(style, `lineStyle.type`, 'solid'),
        })(
          <Select>
            <Select.Option value="solid">实线</Select.Option>
            <Select.Option value="dashed">虚线</Select.Option>
            <Select.Option value="dotted">点线</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="折线透明度" {...formItemLayout}>
        {getFieldDecorator(`lineStyle.opacity`, {
          initialValue: reap(style, `lineStyle.opacity`, 1),
        })(<InputNumber min={0} max={1} />)}
      </FormItem>

      <FormItem label="折线展示数据" {...formItemLayout}>
        {getFieldDecorator(`showSymbol`, {
          initialValue: reap(style, `showSymbol`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="暂无数据颜色" {...formItemLayout}>
        {getFieldDecorator('notDataColor', {
          initialValue: reap(style, 'notDataColor', '#0089e9'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="暂无数据字体" {...formItemLayout}>
        {getFieldDecorator('notDataFontSize', {
          initialValue: reap(style, 'notDataFontSize', 20),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="暂无数据上边距" {...formItemLayout}>
        {getFieldDecorator('notDataPadding', {
          initialValue: reap(style, 'notDataPadding', 20),
        })(<InputNumber />)}
      </FormItem>
    </Fragment>
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

    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(RadarChartBasicConfig);

import React, { Fragment } from 'react';
import { reap } from '../../../../components/SafeReaper';
import { Form, InputNumber } from 'antd';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;

const CenterBarBasicConfig = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  style,
  mockData,
}) => {
  return (
    <Fragment>
      <FormItem label="柱状宽度比例(%)" {...formItemLayout}>
        {getFieldDecorator('series.barWidth', {
          initialValue: reap(style, 'series.barWidth', 20),
        })(<InputNumber max={100} min={5} />)}
      </FormItem>

      <FormItem label="柱状圆角" {...formItemLayout}>
        {getFieldDecorator('basicSeriesConfig.itemStyle.barBorderRadius', {
          initialValue: reap(style, 'basicSeriesConfig.itemStyle.barBorderRadius', 20),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="柱状颜色" {...formItemLayout}>
        {getFieldDecorator('basicSeriesConfig.itemStyle.color', {
          initialValue: reap(style, 'basicSeriesConfig.itemStyle.color', '#8d94ff'),
        })(<InputColor />)}
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
    console.log('newFields: ', newFields);
    console.log('new style: ', { ...style, ...newFields });
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(CenterBarBasicConfig);

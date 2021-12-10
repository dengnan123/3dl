import React, { Fragment } from 'react';
import { merge } from 'lodash';
import { reap } from '../../../../components/SafeReaper';
import { Form, InputNumber } from 'antd';
import InputColor from '../../../../components/InputColor';
import Label from '../Label';

const FormItem = Form.Item;

const ScatterPlotBasicConfig = ({ form, formItemLayout, style, mockData }) => {
  const { getFieldDecorator } = form;
  // const dataSeries = reap(mockData, 'series', []);

  return (
    <Fragment>
      <FormItem label="散点尺寸" {...formItemLayout}>
        {getFieldDecorator(`basicSeriesConfig.symbolSize`, {
          initialValue: reap(style, `basicSeriesConfig.symbolSize`, 18),
        })(<InputNumber min={1} />)}
      </FormItem>

      <Label form={form} formItemLayout={formItemLayout} data={style} />

      {/* {dataSeries.map((item, index) => {
        return (
          <Fragment key={index}>
            <FormItem label={`数据${index + 1}设置`} {...formItemLayout} />

            <FormItem label="散点颜色" {...formItemLayout}>
              {getFieldDecorator(`series[${index}].itemStyle.color`, {
                initialValue: reap(style, `series[${index}].itemStyle.color`, '#5b8ff9'),
              })(<InputColor />)}
            </FormItem>

            <FormItem label="散点颜色透明度" {...formItemLayout}>
              {getFieldDecorator(`series[${index}].itemStyle.opacity`, {
                initialValue: reap(style, `series[${index}].itemStyle.opacity`, 0.5),
              })(<InputNumber min={0} max={1} />)}
            </FormItem>
          </Fragment>
        );
      })} */}

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

    const finalFields = merge({}, style, newFields);

    updateStyle(finalFields);
  },
})(ScatterPlotBasicConfig);

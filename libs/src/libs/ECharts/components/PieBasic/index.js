import React, { useEffect, Fragment } from 'react';
import { merge } from 'lodash';
import { reap } from '../../../../components/SafeReaper';
import { Form, Switch, InputNumber, Select, Input } from 'antd';
import { getFormDefValue } from '../../../../helpers/utils';
import InputColor from '../../../../components/InputColor';
import styles from './index.less';

const FormItem = Form.Item;

const Legend = props => {
  const {
    style,
    mockData,
    form,
    form: { getFieldDecorator, resetFields, getFieldValue },
    formItemLayout,
  } = props;

  const series = reap(mockData, 'series', []);

  // useEffect(() => {
  //   resetFields();
  // }, [resetFields, style]);

  const initialKeys = series.length ? series : [];

  getFieldDecorator('initialKeys', {
    initialValue: initialKeys,
  });

  const newKeys = getFieldValue('initialKeys');

  const openCustom = getFormDefValue(style, form, 'series.openCustom');

  return (
    <div className={styles.textDiv}>
      <FormItem label="是否显示标签" {...formItemLayout}>
        {getFieldDecorator('showLabel', {
          initialValue: reap(style, 'series.showLabel', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="饼图中心位置x" {...formItemLayout}>
        {getFieldDecorator('series.center[0]', {
          initialValue: reap(style, 'series.center[0]', '50%'),
        })(<Input />)}
      </FormItem>

      <FormItem label="饼图中心位置y" {...formItemLayout}>
        {getFieldDecorator('series.center[1]', {
          initialValue: reap(style, 'series.center[1]', '50%'),
        })(<Input />)}
      </FormItem>

      {reap(style, 'series.showLabel', true) && (
        <>
          <FormItem label="标签位置" {...formItemLayout}>
            {getFieldDecorator('labelPosition', {
              initialValue: reap(style, 'series.labelPosition', 'inside'),
            })(
              <Select style={{ width: '100%' }}>
                <Select.Option key="center">居中</Select.Option>
                <Select.Option key="outside">饼图扇区外侧</Select.Option>
                <Select.Option key="inside">饼图扇区内侧</Select.Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="标签内容formatter" {...formItemLayout}>
            {getFieldDecorator('LabelFormatter', {
              initialValue: reap(style, 'series.LabelFormatter', '{a}\n {d}%'),
            })(<Input />)}
          </FormItem>
        </>
      )}

      {reap(style, 'series.showLabel', false) && (
        <>
          <FormItem label="标签字体大小" {...formItemLayout}>
            {getFieldDecorator('labelFontSize', {
              initialValue: reap(style, 'series.labelFontSize', 12),
            })(<InputNumber min={12} />)}
          </FormItem>

          <FormItem label="标签字体颜色" {...formItemLayout}>
            {getFieldDecorator('labelFontColor', {
              initialValue: reap(style, 'series.labelFontColor', '#424242'),
            })(<InputColor />)}
          </FormItem>
        </>
      )}

      <FormItem label="南丁格尔玫瑰" {...formItemLayout}>
        {getFieldDecorator('roseType', {
          initialValue: reap(style, 'series.roseType', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="开启图表自定义" {...formItemLayout}>
        {getFieldDecorator('openCustom', {
          initialValue: reap(style, 'series.openCustom', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {openCustom &&
        newKeys.map((item, index) => {
          const data = reap(item, 'data', []);

          let initOuterRadius = 100 - index * 20;
          initOuterRadius = initOuterRadius < 0 ? 20 : initOuterRadius;
          let initInnerRadius = initOuterRadius - 10;

          return (
            <Fragment key={index}>
              <FormItem label={`图表${index + 1}设置`} {...formItemLayout} />

              {data.map((n, i) => (
                <FormItem key={i} label={`数据${i + 1}颜色`} {...formItemLayout}>
                  {getFieldDecorator(`series[${index}].data[${i}].itemStyle.color`, {
                    initialValue: reap(
                      style,
                      `series.series[${index}].data[${i}].itemStyle.color`,
                      undefined,
                    ),
                  })(<InputColor />)}
                </FormItem>
              ))}

              <FormItem label="内侧radius百分比" {...formItemLayout}>
                {getFieldDecorator(`series[${index}].radius[0]`, {
                  initialValue: reap(style, `series.series[${index}].radius[0]`, initInnerRadius),
                })(<InputNumber min={0} max={100} />)}
              </FormItem>

              <FormItem label="外侧radius百分比" {...formItemLayout}>
                {getFieldDecorator(`series[${index}].radius[1]`, {
                  initialValue: reap(style, `series.series[${index}].radius[1]`, initOuterRadius),
                })(<InputNumber min={0} max={100} />)}
              </FormItem>
            </Fragment>
          );
        })}

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
    delete newFields['initialKeys'];
    console.log('newFields: ', newFields);
    // 处理数据
    updateStyle({
      ...style,
      series: merge({}, style.series, newFields),
    });
  },
})(Legend);

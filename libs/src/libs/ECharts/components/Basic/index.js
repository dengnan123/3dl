import React, { useEffect } from 'react';
import { merge } from 'lodash';
import { Form, Switch, InputNumber } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import { filterObj } from '../../../../helpers/utils';
import InputColor from '../../../../components/InputColor';
import { reap } from '../../../../components/SafeReaper';
import styles from './index.less';
const FormItem = Form.Item;
// const { Option } = Select;
const Basic = props => {
  const {
    style,
    form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
    formItemLayout,
    updateStyle,
    mockData = {},
  } = props;

  const { series = [] } = mockData;

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  const { run } = useDebounceFn(() => {
    updateSeries();
  }, 500);

  const updateSeries = () => {
    let newFields = getFieldsValue();
    const _obj = filterObj(newFields, ['', undefined]);
    const colors = series.map((v, index) => {
      const key = `customColor${index}`;
      return {
        customColor: _obj[key],
      };
    });

    const zlevels = series.map((v, index) => {
      const key = `zlevel${index}`;
      return _obj[key];
    });
    // merge;
    const newSeries = merge({}, style.series, {
      ..._obj,
      colors,
      zlevels,
    });

    console.log('newSeriesnewSeries', newSeries);
    updateStyle({
      ...style,
      ..._obj,
      series: newSeries,
      color: colors,
    });
  };

  const openCustomColor = getFieldValue('openCustomColor');

  const barGap = getFieldValue('barGap');

  return (
    <div className={styles.textDiv}>
      <FormItem label="X/Y轴翻转" {...formItemLayout}>
        {getFieldDecorator('xyInverse', {
          initialValue: reap(style, 'xyInverse', false),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem>
      <FormItem label="柱状宽度比例(%)" {...formItemLayout}>
        {getFieldDecorator('barWidth', {
          initialValue: reap(style, 'series.barWidth', ''),
        })(<InputNumber onBlur={run} max={100} mix={5} />)}
      </FormItem>
      <FormItem label="开启图表自定义配色" {...formItemLayout}>
        {getFieldDecorator('openCustomColor', {
          initialValue: reap(style, 'series.openCustomColor', false),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem>
      {openCustomColor &&
        series.map((v, index) => {
          return (
            <FormItem label={`数据${index + 1}颜色设置`} {...formItemLayout}>
              {getFieldDecorator(`customColor${index}`, {
                initialValue: reap(style, `series.colors[${index}].customColor`, ''),
              })(<InputColor onBlur={run} />)}
            </FormItem>
          );
        })}
      <FormItem label="数据堆叠显示" {...formItemLayout}>
        {getFieldDecorator('stack', {
          initialValue: reap(style, 'series.stack', false),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem>
      <FormItem label="数据重合显示" {...formItemLayout}>
        {getFieldDecorator('barGap', {
          initialValue: reap(style, 'series.barGap', false),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem>
      {barGap &&
        series.map((v, index) => {
          return (
            <FormItem label={`柱状体${index + 1}level设置`} {...formItemLayout}>
              {getFieldDecorator(`zlevel${index}`, {
                initialValue: reap(style, `series.zlevels[${index}]`, 0),
              })(<InputNumber onBlur={run} mix={0} />)}
            </FormItem>
          );
        })}
    </div>
  );
};

export default Form.create()(Basic);

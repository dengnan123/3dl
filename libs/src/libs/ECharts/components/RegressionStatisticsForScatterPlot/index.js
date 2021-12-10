import React, { Fragment } from 'react';
import { merge } from 'lodash';
import { reap } from '../../../../components/SafeReaper';
import { Form, InputNumber, Switch, Select } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;

const positionList = [
  'top',
  'left',
  'right',
  'bottom',
  'inside',
  'insideLeft',
  'insideRight',
  'insideTop',
  'insideBottom',
  'insideTopLeft',
  'insideBottomLeft',
  'insideTopRight',
  'insideBottomRight',
];

/**
 * 散点图回归统计
 */
const RegressionStatisticsForScatterPlot = ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  style,
  mockData,
}) => {
  const regressionStatisticsConfig = reap(style, 'regressionStatisticsConfig', {});

  return (
    <Fragment>
      <FormItem label="显示散点图回归统计" {...formItemLayout}>
        {getFieldDecorator(`showRegressionStatistics`, {
          initialValue: reap(regressionStatisticsConfig, `showRegressionStatistics`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="颜色" {...formItemLayout}>
        {getFieldDecorator(`series.lineStyle.normal.color`, {
          initialValue: reap(
            regressionStatisticsConfig,
            `series.lineStyle.normal.color`,
            '#A9AEFF',
          ),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="线条圆滑" {...formItemLayout}>
        {getFieldDecorator(`series.smooth`, {
          initialValue: reap(regressionStatisticsConfig, `series.smooth`, true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="线条显示数据" {...formItemLayout}>
        {getFieldDecorator(`series.showSymbol`, {
          initialValue: reap(regressionStatisticsConfig, `series.showSymbol`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="标记点颜色" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.itemStyle.color`, {
          initialValue: reap(
            regressionStatisticsConfig,
            `series.markPoint.itemStyle.color`,
            '#A9AEFF',
          ),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="标记点形状" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.symbol`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.symbol`, 'pin'),
        })(
          <Select>
            <Select.Option key="circle">圆</Select.Option>
            <Select.Option key="rect">矩形</Select.Option>
            <Select.Option key="roundRect">圆角矩形</Select.Option>
            <Select.Option key="triangle">三角形</Select.Option>
            <Select.Option key="diamond">钻石</Select.Option>
            <Select.Option key="pin">气球型</Select.Option>
            <Select.Option key="arrow">箭头</Select.Option>
            <Select.Option key="none">无</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="标记点尺寸" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.symbolSize`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.symbolSize`, 20),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="显示标记点标签" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.label.show`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.label.show`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="标记点标签位置" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.label.position`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.label.position`, 'top'),
        })(
          <Select>
            {positionList.map(p => (
              <Select.Option key={p}>{p}</Select.Option>
            ))}
          </Select>,
        )}
      </FormItem>

      <FormItem label="标记点标签颜色" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.label.color`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.label.color`, '#424242'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="标记点标签字体大小" {...formItemLayout}>
        {getFieldDecorator(`series.markPoint.label.fontSize`, {
          initialValue: reap(regressionStatisticsConfig, `series.markPoint.label.fontSize`, 12),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="自定义线条函数" {...formItemLayout}>
        {getFieldDecorator(`customizeRegression`, {
          initialValue: reap(regressionStatisticsConfig, `customizeRegression`, false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      {reap(regressionStatisticsConfig, `customizeRegression`, false) && (
        <>
          <FormItem label="一次项系数" {...formItemLayout}>
            {getFieldDecorator(`firstOrderCoefficient`, {
              initialValue: reap(regressionStatisticsConfig, `firstOrderCoefficient`, 30),
            })(<InputNumber />)}
          </FormItem>

          <FormItem label="常数项" {...formItemLayout}>
            {getFieldDecorator(`constantTerm`, {
              initialValue: reap(regressionStatisticsConfig, `constantTerm`, 0),
            })(<InputNumber />)}
          </FormItem>
        </>
      )}
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
    const finalFields = merge({}, style?.regressionStatisticsConfig, newFields);
    updateStyle({ ...style, regressionStatisticsConfig: finalFields });
  },
})(RegressionStatisticsForScatterPlot);

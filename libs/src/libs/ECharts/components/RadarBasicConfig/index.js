import React, { Fragment } from 'react';
import { reap } from '../../../../components/SafeReaper';

import { Form, InputNumber, Input, Switch, Select } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;

export default ({
  form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
  formItemLayout,
  data,
}) => {
  return (
    <Fragment>
      <FormItem label="中心(圆心)坐标" {...formItemLayout} />
      <div className={styles.centerItem}>
        <FormItem label="x" {...formItemLayout}>
          {getFieldDecorator(`center[0]`, {
            initialValue: reap(data, `center[0]`, '50%'),
          })(<Input />)}
        </FormItem>
        <FormItem label="y" {...formItemLayout}>
          {getFieldDecorator(`center[1]`, {
            initialValue: reap(data, `center[1]`, '50%'),
          })(<Input />)}
        </FormItem>
      </div>

      <FormItem label="半径" {...formItemLayout}>
        {getFieldDecorator(`radius`, {
          initialValue: reap(data, `radius`, '75%'),
        })(<Input />)}
      </FormItem>

      <FormItem label="坐标起始角度" {...formItemLayout}>
        {getFieldDecorator(`startAngle`, {
          initialValue: reap(data, `startAngle`, 90),
        })(<InputNumber min={-360} max={360} step={1} />)}
      </FormItem>

      <FormItem label="显示指示器名称" {...formItemLayout}>
        {getFieldDecorator(`name.show`, {
          initialValue: reap(data, `name.show`, true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {/* <FormItem label="指示器名称颜色" {...formItemLayout}>
        {getFieldDecorator(`name.textStyle.color`, {
          initialValue: reap(data, `name.color`, '#424242'),
        })(<InputColor />)}
      </FormItem> */}

      <FormItem label="指示器名称字体大小" {...formItemLayout}>
        {getFieldDecorator(`name.textStyle.fontSize`, {
          initialValue: reap(data, `name.fontSize`, 12),
        })(<InputNumber min={12} step={1} />)}
      </FormItem>

      <FormItem label="指示器轴分割段数" {...formItemLayout}>
        {getFieldDecorator(`splitNumber`, {
          initialValue: reap(data, `splitNumber`, 5),
        })(<InputNumber min={1} step={1} />)}
      </FormItem>

      <FormItem label="雷达图绘制类型" {...formItemLayout}>
        {getFieldDecorator(`shape`, {
          initialValue: reap(data, `shape`, 'polygon'),
        })(
          <Select>
            <Select.Option key="polygon">多边形</Select.Option>
            <Select.Option key="circle">圆形</Select.Option>
          </Select>,
        )}
      </FormItem>
    </Fragment>
  );
};

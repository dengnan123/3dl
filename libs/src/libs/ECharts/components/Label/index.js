import React, { Fragment } from 'react';
import { Form, InputNumber, Input, Switch, Select } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';
import FormaterItem from '../../../../components/FormaterItem';

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

export default ({ form, formItemLayout, data }) => {
  const { getFieldDecorator } = form;

  const label = reap(data, 'label', {});
  const formatter = reap(label, 'formatter');

  const formaterItemProps = {
    form,
    style: data,
    formItemLayout,
    field: 'label.formatter',
    data: formatter,
  };

  return (
    <Fragment>
      <FormItem label="是否显示标签" {...formItemLayout}>
        {getFieldDecorator('label.show', {
          initialValue: reap(data, 'label.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="标签位置" {...formItemLayout}>
        {getFieldDecorator('label.position', {
          initialValue: reap(data, 'label.position'),
        })(
          <Select>
            {positionList.map(pos => {
              return (
                <Select.Option key={pos} value={pos}>
                  {pos}
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </FormItem>

      <FormItem label="距离图形元素的距离" {...formItemLayout}>
        {getFieldDecorator('label.distance', {
          initialValue: reap(data, 'label.distance', 0),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="字体大小" {...formItemLayout}>
        {getFieldDecorator('label.fontSize', {
          initialValue: reap(data, 'label.fontSize', 16),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="字体的粗细" {...formItemLayout}>
        {getFieldDecorator('label.fontWeight', {
          initialValue: reap(data, 'label.fontWeight', 'normal'),
        })(<Input />)}
      </FormItem>

      <FormItem label="字体颜色" {...formItemLayout}>
        {getFieldDecorator('label.color', {
          initialValue: reap(data, 'label.color'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="文字行高" {...formItemLayout}>
        {getFieldDecorator('label.lineHeight', {
          initialValue: reap(data, 'label.lineHeight'),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="文字水平对齐方式" {...formItemLayout}>
        {getFieldDecorator('label.align', {
          initialValue: reap(data, 'label.align', 'center'),
        })(
          <Select>
            <Select.Option key="left">左对齐</Select.Option>
            <Select.Option key="center">居中</Select.Option>
            <Select.Option key="right">右对齐</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="文字垂直对齐方式" {...formItemLayout}>
        {getFieldDecorator('label.verticalAlign', {
          initialValue: reap(data, 'label.verticalAlign', 'middle'),
        })(
          <Select>
            <Select.Option key="top">顶部对齐</Select.Option>
            <Select.Option key="middle">居中</Select.Option>
            <Select.Option key="bottom">底部对齐</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormaterItem {...formaterItemProps} />
    </Fragment>
  );
};

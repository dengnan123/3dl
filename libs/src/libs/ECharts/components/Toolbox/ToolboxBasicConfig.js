import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Switch, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

const ToolboxBasicConfig = props => {
  const { data, form, formItemLayout } = props;
  const { getFieldDecorator } = form;

  return (
    <>
      <FormItem label="显示图表工具栏(toolbox)" {...formItemLayout}>
        {getFieldDecorator('basic.show', {
          initialValue: data?.show || false,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="工具栏图标尺寸" {...formItemLayout}>
        {getFieldDecorator('basic.itemSize', {
          initialValue: data?.itemSize ?? 15,
        })(<InputNumber min={0} step={1} />)}
      </FormItem>

      <FormItem label="工具栏图标间隔" {...formItemLayout}>
        {getFieldDecorator('basic.itemGap', {
          initialValue: data?.itemGap ?? 10,
        })(<InputNumber step={1} />)}
      </FormItem>

      <FormItem label="鼠标悬浮显示图标标题" {...formItemLayout}>
        {getFieldDecorator('basic.showTitle', {
          initialValue: data?.showTitle ?? true,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="图形的层级(zlevel)" {...formItemLayout}>
        {getFieldDecorator('basic.zlevel', {
          initialValue: data?.zlevel,
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="工具栏的布局朝向" {...formItemLayout}>
        {getFieldDecorator('basic.orient', {
          initialValue: data?.orient || 'horizontal',
        })(
          <Select style={{ width: '100%' }}>
            <Option value="horizontal">水平</Option>
            <Option value="vertical">垂直</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="工具栏宽度" {...formItemLayout}>
        {getFieldDecorator('basic.width', {
          initialValue: data?.width,
        })(<Input placeholder="20,20%,auto" />)}
      </FormItem>

      <FormItem label="工具栏高度" {...formItemLayout}>
        {getFieldDecorator('basic.height', {
          initialValue: data?.height,
        })(<Input placeholder="20,20%,auto" />)}
      </FormItem>

      <FormItem label="距离容器左侧距离" {...formItemLayout}>
        {getFieldDecorator('basic.left', {
          initialValue: data?.left,
        })(<Input placeholder="20,20%,left,center,right,auto" />)}
      </FormItem>

      <FormItem label="距离容器顶部距离" {...formItemLayout}>
        {getFieldDecorator('basic.top', {
          initialValue: data?.top,
        })(<Input placeholder="20,20%,left,center,right,auto" />)}
      </FormItem>

      <FormItem label="距离容器右侧距离" {...formItemLayout}>
        {getFieldDecorator('basic.right', {
          initialValue: data?.right,
        })(<Input placeholder="20,20%,left,center,right,auto" />)}
      </FormItem>

      <FormItem label="距离容器底部距离" {...formItemLayout}>
        {getFieldDecorator('basic.bottom', {
          initialValue: data?.bottom,
        })(<Input placeholder="20,20%,left,center,right,auto" />)}
      </FormItem>
    </>
  );
};

ToolboxBasicConfig.propTypes = {
  data: PropTypes.object,
  form: PropTypes.shape({ getFieldDecorator: PropTypes.func }),
  formItemLayout: PropTypes.object,
};

export default ToolboxBasicConfig;

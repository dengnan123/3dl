import React from 'react';
import { debounce } from 'lodash';

import { Form, Input, Tooltip, InputNumber, Select, Collapse, Switch } from 'antd';
// import InputColor from '../../../components/InputColor';
import InputColor from '../../../../components/InputColor';

const { Panel } = Collapse;

const DashBoardFinace = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    themeColor = '#e04b1e',
    FontColor = '',
    BgColor = 'white',
    componentWidth = '400',
    FontSize = '60',
    FontHigh = 0,
    externalScale = 'e04b1e',
    internalScale = 'e04b1e',
    numberOfScale = 20,
    // internalHeight = 10,
    // internalWidth = 20,
    // externalHeight = 10,
    // externalWidth = 20,
  } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Tooltip placement="top" title={<span>用法请查看组件xxx.md文档</span>}>
        <span>提示</span>
      </Tooltip>

      <Form.Item label="组件宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('componentWidth', {
          initialValue: componentWidth,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="背景色（要与页面颜色相同）" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('BgColor', {
          initialValue: BgColor || '',
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="主题色" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('themeColor', {
          initialValue: themeColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="字体大小(未包含单位)" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('FontSize', {
          initialValue: FontSize,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="字体高度(未包含单位)" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('FontHigh', {
          initialValue: FontHigh,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('FontColor', {
          initialValue: FontColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="刻度数量" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('numberOfScale', {
          initialValue: numberOfScale,
        })(<Input min />)}
      </Form.Item>
      {/* <Form.Item label="内刻度宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('internalWidth', {
          initialValue: internalWidth,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="内刻度高度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('internalHeight', {
          initialValue: internalHeight,
        })(<Input />)}
      </Form.Item> */}
      <Form.Item label="内刻度颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('internalScale', {
          initialValue: internalScale,
        })(<InputColor />)}
      </Form.Item>
      {/* <Form.Item label="外刻度宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('externalWidth', {
          initialValue: externalWidth,
        })(<Input />)}
        <Form.Item label="外刻度高度" {...formItemLayout} style={{ marginBottom: 0 }}>
          {getFieldDecorator('externalHeight', {
            initialValue: externalHeight,
          })(<Input />)}
        </Form.Item>
      </Form.Item> */}
      <Form.Item label="外刻度颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('externalScale', {
          initialValue: externalScale,
        })(<InputColor />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    delete newFields['tabKeys'];

    updateStyle({
      ...style,
      ...newFields,
    });
    // 处理数据
  }, 500),
})(DashBoardFinace);

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Collapse, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const TimeConfig = (props) => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    timeFontSize,
    color,
    timeFormat,
    timeFontWeight,
    restFormatEN,
    restFormatCN,
    restFontWeight,
    textAlign,
    disableLocalStorage = false,
    isZh = true,
    timeFirst = true,
    isShowDate = true,
    isBig = true,
    isFont = 'font',
    font,
    weekFont,
    upDoMargin = 0,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse>
        <Panel header={'时间设置'}>
          <Form.Item label="不使用localStorage环境配置">
            {getFieldDecorator('disableLocalStorage', {
              valuePropName: 'checked',
              initialValue: disableLocalStorage,
            })(<Switch />)}
          </Form.Item>

          {disableLocalStorage && (
            <Form.Item label="是否为中文环境">
              {getFieldDecorator('isZh', {
                valuePropName: 'checked',
                initialValue: isZh,
              })(<Switch />)}
            </Form.Item>
          )}
          <Form.Item label="大小写">
            {getFieldDecorator('isBig', {
              valuePropName: 'checked',
              initialValue: isBig,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="时间字体颜色" {...formItemLayout}>
            {getFieldDecorator('color', {
              initialValue: color,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="星期 格式(EN)" {...formItemLayout}>
            {getFieldDecorator('restFormatEN', {
              initialValue: restFormatEN,
            })(<Input placeholder="dddd" />)}
          </Form.Item>

          <Form.Item label="星期 格式(CN)" {...formItemLayout}>
            {getFieldDecorator('restFormatCN', {
              initialValue: restFormatCN,
            })(<Input placeholder="d" />)}
          </Form.Item>

          <Form.Item label="时间字体粗细" {...formItemLayout}>
            {getFieldDecorator('timeFontWeight', {
              initialValue: timeFontWeight,
            })(<InputNumber min={100} max={900} step={100} />)}
          </Form.Item>
        </Panel>
        <Panel header={'中文显示 样式调整'}>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('isFont', {
              initialValue: isFont,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="font">星期在前</Select.Option>
                <Select.Option value="back">星期在后</Select.Option>
                <Select.Option value="up">星期在上</Select.Option>
                <Select.Option value="down">星期在下</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('textAlign', {
              initialValue: textAlign,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </Form.Item>
          {(isFont === 'up' || isFont === 'down') && (
            <Form.Item label="上下布局的margin" {...formItemLayout}>
              {getFieldDecorator('upDoMargin', {
                initialValue: upDoMargin,
              })(<InputNumber min={0} />)}
            </Form.Item>
          )}
          <Form.Item label="'星期' 字体大小" {...formItemLayout}>
            {getFieldDecorator('font', {
              initialValue: font,
            })(<InputNumber min={12} />)}
          </Form.Item>
          <Form.Item label="星期字体大小" {...formItemLayout}>
            {getFieldDecorator('weekFont', {
              initialValue: weekFont,
            })(<InputNumber min={12} />)}
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(TimeConfig);

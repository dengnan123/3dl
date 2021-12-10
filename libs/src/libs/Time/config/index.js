import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Collapse, Switch } from 'antd';
import { debounce } from 'lodash';
// import moment from 'dayjs';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const TimeConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    fontSize,
    color,
    timeFontSize,
    timeColor,
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
    isShowTime = true,
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
          <Form.Item label="显示时间">
            {getFieldDecorator('isShowTime', {
              valuePropName: 'checked',
              initialValue: isShowTime,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="时间字体大小" {...formItemLayout}>
            {getFieldDecorator('timeFontSize', {
              initialValue: timeFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="时间字体颜色" {...formItemLayout}>
            {getFieldDecorator('timeColor', {
              initialValue: timeColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="时间显示格式" {...formItemLayout}>
            {getFieldDecorator('timeFormat', {
              initialValue: timeFormat,
            })(<Input placeholder="HH:mm:ss" />)}
          </Form.Item>

          <Form.Item label="时间字体粗细" {...formItemLayout}>
            {getFieldDecorator('timeFontWeight', {
              initialValue: timeFontWeight,
            })(<InputNumber min={100} max={900} step={100} />)}
          </Form.Item>
        </Panel>

        <Panel header={'日期设置'}>
          <Form.Item label="显示日期">
            {getFieldDecorator('isShowDate', {
              valuePropName: 'checked',
              initialValue: isShowDate,
            })(<Switch />)}
          </Form.Item>

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

          <Form.Item label="日期字体大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="日期字体颜色" {...formItemLayout}>
            {getFieldDecorator('color', {
              initialValue: color,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="日期显示格式(EN)" {...formItemLayout}>
            {getFieldDecorator('restFormatEN', {
              initialValue: restFormatEN,
            })(<Input placeholder="ddd D MMMM YYYY" />)}
          </Form.Item>

          <Form.Item label="日期显示格式(CN)" {...formItemLayout}>
            {getFieldDecorator('restFormatCN', {
              initialValue: restFormatCN,
            })(<Input placeholder="ddd MMMM D YYYY" />)}
          </Form.Item>

          <Form.Item label="日期显示粗细" {...formItemLayout}>
            {getFieldDecorator('restFontWeight', {
              initialValue: restFontWeight || 400,
            })(<InputNumber min={100} max={900} step={100} />)}
          </Form.Item>
        </Panel>

        <Panel header={'样式调整'}>
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
          <Form.Item label="时间在前" {...formItemLayout}>
            {getFieldDecorator('timeFirst', {
              initialValue: timeFirst,
              valuePropName: 'checked',
            })(<Switch />)}
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

import React, { useEffect } from 'react';
import { Form, Select, Input, Switch, Collapse, InputNumber } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';
const { Panel } = Collapse;

const CustomizeDatePickerConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    pickerType = 'DatePicker',
    pickerSize = 'default',
    allowClear,
    autoFocus,
    timeColor = '#424242',
    timeBorderColor = '#d9d9d9',
    transparent = false,
    startPlaceholder = '请选择日期',
    startPlaceholderEn = 'Select date',
    endPlaceholder = 'Select date',
    endPlaceholderEn = 'Select date',
    format,
    showTime = false,
    showToday = false,
    startTimeKey,
    endTimeKey,
    initOnChange = true,
    defaultValue,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div>
      <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <Form.Item label="类型" {...formItemLayout}>
            {getFieldDecorator('pickerType', {
              initialValue: pickerType,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="DatePicker">DatePicker</Select.Option>
                <Select.Option value="MonthPicker">MonthPicker</Select.Option>
                <Select.Option value="RangePicker">RangePicker</Select.Option>
                <Select.Option value="WeekPicker">WeekPicker</Select.Option>
                <Select.Option value="TimePicker">TimePicker</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="尺寸" {...formItemLayout}>
            {getFieldDecorator('pickerSize', {
              initialValue: pickerSize,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="large">large</Select.Option>
                <Select.Option value="default">default</Select.Option>
                <Select.Option value="small">small</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="日期显示格式" {...formItemLayout}>
            {getFieldDecorator('format', {
              initialValue: format,
            })(<Input placeholder="YYYY MM DD" />)}
          </Form.Item>

          <Form.Item label="开始日期输入框提示文字(中)" {...formItemLayout}>
            {getFieldDecorator('startPlaceholder', {
              initialValue: startPlaceholder,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="开始日期输入框提示文字(英)" {...formItemLayout}>
            {getFieldDecorator('startPlaceholderEn', {
              initialValue: startPlaceholderEn,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="显示清除按钮" {...formItemLayout}>
            {getFieldDecorator('allowClear', {
              initialValue: allowClear,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="自动获取焦点" {...formItemLayout}>
            {getFieldDecorator('autoFocus', {
              initialValue: autoFocus,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="初始化是否触发事件" {...formItemLayout}>
            {getFieldDecorator('initOnChange', {
              initialValue: initOnChange,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="startTimeKey" {...formItemLayout}>
            {getFieldDecorator('startTimeKey', {
              initialValue: startTimeKey,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="是否透明" {...formItemLayout}>
            {getFieldDecorator('transparent', {
              initialValue: transparent,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>
      </Collapse>

      {pickerType === 'RangePicker' && (
        <>
          <Form.Item label="结束日期输入框提示文字(中)" {...formItemLayout}>
            {getFieldDecorator('endPlaceholder', {
              initialValue: endPlaceholder,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="结束日期输入框提示文字(英)" {...formItemLayout}>
            {getFieldDecorator('endPlaceholderEn', {
              initialValue: endPlaceholderEn,
            })(<Input />)}
          </Form.Item>
        </>
      )}

      {['DatePicker', 'RangePicker'].includes(pickerType) && (
        <Form.Item label="增加时间选择功能" {...formItemLayout}>
          {getFieldDecorator('showTime', {
            initialValue: showTime,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
      )}

      {pickerType === 'DatePicker' && (
        <Form.Item label="是否展示“今天”按钮" {...formItemLayout}>
          {getFieldDecorator('showToday', {
            initialValue: showToday,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
      )}

      {pickerType === 'RangePicker' && (
        <Form.Item label="endTimeKey" {...formItemLayout}>
          {getFieldDecorator('endTimeKey', {
            initialValue: endTimeKey,
          })(<Input />)}
        </Form.Item>
      )}

      {pickerType !== 'TimePicker' && (
        <>
          <Form.Item label="时间字体颜色" {...formItemLayout}>
            {getFieldDecorator('timeColor', {
              initialValue: timeColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="时间输入框边框颜色" {...formItemLayout}>
            {getFieldDecorator('timeBorderColor', {
              initialValue: timeBorderColor,
            })(<InputColor />)}
          </Form.Item>
        </>
      )}

      {pickerType === 'TimePicker' && (
        <>
          <Form.Item label="小时选项间隔" {...formItemLayout}>
            {getFieldDecorator('hourStep', {
              initialValue: hourStep,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item label="分钟选项间隔" {...formItemLayout}>
            {getFieldDecorator('minuteStep', {
              initialValue: minuteStep,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item label="秒选项间隔" {...formItemLayout}>
            {getFieldDecorator('secondStep', {
              initialValue: secondStep,
            })(<InputNumber min={1} />)}
          </Form.Item>
        </>
      )}
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
    delete newFields['legendKeys'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(CustomizeDatePickerConfig);

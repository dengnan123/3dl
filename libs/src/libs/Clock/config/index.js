import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Switch, Select, Input } from 'antd';
import InputColor from '../../../components/InputColor';

const FormItem = Form.Item;
function ClockConfig(props) {
  const {
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    clockCircleBgColor = '#0f1522',
    clockSrc = '',
    clockCircleBgSize,
    showNumber = true,
    fontSize = 20,
    fontColor = '#ccc',
    showTimeStick = true,
    timeStickColor = '#ccc',
    currentTimePointType = 'currentTime',
    currentTimePointSize = 24,
    currentTimePointColor = '#ffffff',
    currentTimePointShadow = true,
    showMeeting = true,
    lineWidth = 14,
    highlightLineWidth = 18,
  } = style || {};

  return (
    <div>
      <FormItem label="表盘圆背景色">
        {getFieldDecorator('clockCircleBgColor', {
          initialValue: clockCircleBgColor,
        })(<InputColor />)}
      </FormItem>

      <FormItem label="自定义表盘链接">
        {getFieldDecorator('clockSrc', {
          initialValue: clockSrc,
        })(<Input.TextArea />)}
      </FormItem>

      <FormItem label="自定义表盘图片尺寸">
        {getFieldDecorator('clockCircleBgSize', {
          initialValue: clockCircleBgSize,
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="当前时间点类型">
        {getFieldDecorator('currentTimePointType', {
          initialValue: currentTimePointType,
        })(
          <Select>
            <Select.Option value="currentTime">当前时间</Select.Option>
            <Select.Option value="second">秒</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="当前时间点尺寸">
        {getFieldDecorator('currentTimePointSize', {
          initialValue: currentTimePointSize,
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="当前时间点背景色">
        {getFieldDecorator('currentTimePointColor', {
          initialValue: currentTimePointColor,
        })(<InputColor />)}
      </FormItem>

      <FormItem label="当前时间点阴影">
        {getFieldDecorator('currentTimePointShadow', {
          initialValue: currentTimePointShadow,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="展示数字">
        {getFieldDecorator('showNumber', {
          initialValue: showNumber,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {showNumber && (
        <>
          <FormItem label="表盘数字字体大小">
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber min={0} />)}
          </FormItem>

          <FormItem label="表盘数字字体颜色">
            {getFieldDecorator('fontColor', {
              initialValue: fontColor,
            })(<InputColor />)}
          </FormItem>
        </>
      )}

      <FormItem label="展示刻度">
        {getFieldDecorator('showTimeStick', {
          initialValue: showTimeStick,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {showTimeStick && (
        <FormItem label="表盘刻度颜色">
          {getFieldDecorator('timeStickColor', {
            initialValue: timeStickColor,
          })(<InputColor />)}
        </FormItem>
      )}

      <FormItem label="展示会议">
        {getFieldDecorator('showMeeting', {
          initialValue: showMeeting,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {showMeeting && (
        <>
          <FormItem label="表盘数据线宽">
            {getFieldDecorator('lineWidth', {
              initialValue: lineWidth,
            })(<InputNumber min={1} />)}
          </FormItem>

          <FormItem label="表盘数据高亮线宽">
            {getFieldDecorator('highlightLineWidth', {
              initialValue: highlightLineWidth,
            })(<InputNumber min={1} />)}
          </FormItem>
        </>
      )}
    </div>
  );
}

ClockConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: props => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(ClockConfig);

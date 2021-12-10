import React from 'react';
import PropTypes from 'prop-types';
import { reap } from '../../../components/SafeReaper';
import { Form, InputNumber, Input } from 'antd';
import InputColor from '../../../components/InputColor';

const FormItem = Form.Item;

function AutoScrollTextConfig(props) {
  const {
    form: { getFieldDecorator },
    style,
  } = props;

  return (
    <div>
      <FormItem label="文本内容">
        {getFieldDecorator('value', {
          initialValue: reap(
            style,
            'value',
            '这是一条会滚动的字符串 这是一条会滚动的字符串 这是一条会滚动的字符串！！！',
          ),
        })(<Input.TextArea />)}
      </FormItem>

      <FormItem label="滚动速度">
        {getFieldDecorator('speed', {
          initialValue: reap(style, 'speed', 500),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="字体大小">
        {getFieldDecorator('fontSize', {
          initialValue: reap(style, 'fontSize', 14),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="字体颜色">
        {getFieldDecorator('color', {
          initialValue: reap(style, 'color', 'rgba(66, 66, 66, 1)'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="字体粗细">
        {getFieldDecorator('fontWeight', {
          initialValue: reap(style, 'fontWeight', 400),
        })(<InputNumber min={100} max={900} step={100} />)}
      </FormItem>

      <FormItem label="单词间距(px)">
        {getFieldDecorator('wordSpacing', {
          initialValue: reap(style, 'wordSpacing'),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="字母间距(px)">
        {getFieldDecorator('letterSpacing', {
          initialValue: reap(style, 'letterSpacing'),
        })(<InputNumber />)}
      </FormItem>
    </div>
  );
}

AutoScrollTextConfig.propTypes = {
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
})(AutoScrollTextConfig);

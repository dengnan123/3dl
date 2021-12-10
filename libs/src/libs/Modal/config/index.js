// import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, Input, InputNumber } from 'antd';
const FormItem = Form.Item;
function Modal(props) {
  const {
    form: { getFieldDecorator, getFieldsValue },
    style,
    updateStyle,
  } = props;

  const handleChange = () => {
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  };
  const handleSwitchChange = (value, key) => {
    const newFields = getFieldsValue();
    newFields[key] = value;
    updateStyle({
      ...style,
      ...newFields,
    });
  };

  return (
    <div>
      <FormItem label="标题">
        {getFieldDecorator('title', {
          initialValue: style?.title || '',
        })(<Input onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="获取字段">
        {getFieldDecorator('propty', {
          initialValue: style?.propty || '',
        })(<Input onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="点击蒙层是否允许关闭">
        {getFieldDecorator('maskClosable', {
          valuePropName: 'checked',
          initialValue: style?.maskClosable || false,
        })(<Switch onChange={checked => handleSwitchChange(checked, 'maskClosable')} />)}
      </FormItem>
      <FormItem label="是否显示右上角的关闭按钮">
        {getFieldDecorator('closable', {
          valuePropName: 'checked',
          initialValue: style?.closable || false,
        })(<Switch onChange={checked => handleSwitchChange(checked, 'closable')} />)}
      </FormItem>
      <FormItem label="是否自动关闭Modal">
        {getFieldDecorator('autoClose', {
          valuePropName: 'checked',
          initialValue: style?.autoClose || false,
        })(<Switch onChange={checked => handleSwitchChange(checked, 'autoClose')} />)}
      </FormItem>
      {style?.autoClose && (
        <FormItem label="自动关闭延迟时间(秒)">
          {getFieldDecorator('delay', {
            initialValue: style?.delay || 1,
          })(<InputNumber onBlur={handleChange} />)}
        </FormItem>
      )}

      <FormItem label="刷卡成功后 自动关闭延迟时间(秒)">
        {getFieldDecorator('delayAfter', {
          initialValue: style?.delayAfter || 2,
        })(<InputNumber onBlur={handleChange} />)}
      </FormItem>

      <FormItem label="content宽">
        {getFieldDecorator('width', {
          initialValue: style?.width || 659,
        })(<InputNumber onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="content高">
        {getFieldDecorator('height', {
          initialValue: style?.height || 258,
        })(<InputNumber onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="content背景图svg">
        {getFieldDecorator('fullSvg', {
          initialValue: style?.fullSvg || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="content背景图svg(请求成功)">
        {getFieldDecorator('successSvg', {
          initialValue: style?.successSvg || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="content背景图svg(请求失败)">
        {getFieldDecorator('failSvg', {
          initialValue: style?.failSvg || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="content标题<?:Html 代码>">
        {getFieldDecorator('contentTitle', {
          initialValue: style?.contentTitle || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="内容<?:Html 代码>">
        {getFieldDecorator('content', {
          initialValue: style?.content || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
      <FormItem label="footer<?:Html 代码>">
        {getFieldDecorator('footer', {
          initialValue: style?.footer || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>

      <FormItem label="仅展示的背景图svg">
        {getFieldDecorator('onlyShowSvg', {
          initialValue: style?.onlyShowSvg || '',
        })(<Input.TextArea onBlur={handleChange} />)}
      </FormItem>
    </div>
  );
}

Modal.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  // onFieldsChange: (props, changedFields) => {
  //   const {
  //     form: { getFieldsValue },
  //     updateStyle,
  //     style,
  //   } = props;
  //   const newFields = getFieldsValue();
  //   updateStyle({
  //     ...style,
  //     ...newFields,
  //   });
  // },
})(Modal);

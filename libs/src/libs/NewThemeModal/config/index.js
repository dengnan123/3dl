// import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, Input, InputNumber } from 'antd';
const FormItem = Form.Item;

function NewThemeModalConfig(props) {
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
      <FormItem label="是否自动关闭Modal">
        {getFieldDecorator('autoClose', {
          valuePropName: 'checked',
          initialValue: style?.autoClose || false,
        })(<Switch onChange={checked => handleSwitchChange(checked, 'autoClose')} />)}
      </FormItem>
      {style?.autoClose && (
        <FormItem label="自动关闭延迟时间(秒)">
          {getFieldDecorator('delay', {
            initialValue: style?.delay || 5,
          })(<InputNumber onBlur={handleChange} />)}
        </FormItem>
      )}
    </div>
  );
}

NewThemeModalConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(NewThemeModalConfig);

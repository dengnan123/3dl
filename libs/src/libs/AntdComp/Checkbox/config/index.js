import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

// const FormItem = Form.Item;
function AntdCompConfig(props) {
  // const {
  //   form: { getFieldDecorator },
  //   style,
  // } = props;
  return <div></div>;
}

AntdCompConfig.propTypes = {
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
})(AntdCompConfig);

import { useEffect } from 'react';
import { Form, InputNumber, Switch, Input, Select } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const DataDrivenScrollCardConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, getFieldValue, setFieldsValue, resetFields },
    style,
    id,
  } = props;

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return <div style={{ paddingLeft: 10, paddingRight: 10 }}></div>;
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
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
  }, 500),
})(DataDrivenScrollCardConfig);

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useStyle } from '../option';
import { Form, Collapse, Input } from 'antd';

const AntdMenuConfig = props => {
  const { formItemLayout, form, id, style } = props;
  const { getFieldDecorator, resetFields } = form;
  const { compKey } = useStyle(style);

  useEffect(() => {
    resetFields();
  }, [resetFields, id]);

  return (
    <div style={{ padding: '0 15px' }}>
      <Collapse bordered>
        <Collapse.Panel header="基础配置">
          <Form.Item label="组件key" {...formItemLayout}>
            {getFieldDecorator('compKey', {
              initialValue: compKey,
            })(<Input placeholder="compKey" allowClear={true} />)}
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

AntdMenuConfig.propTypes = {
  updateStyle: PropTypes.func,
  formItemLayout: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  style: PropTypes.object,
  id: PropTypes.string,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields, allFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;

    const newFileds = getFieldsValue();
    const newStyle = { ...style, ...newFileds };
    updateStyle(newStyle);
  }, 500),
})(AntdMenuConfig);

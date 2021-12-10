import React, { useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import { useDebounceFn } from '@umijs/hooks';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, getFieldsValue, resetFields },
    isSelectCompInfo,
    attributeUpdate,
  } = props;

  const { id, width, height, left, top } = isSelectCompInfo || {};

 

  const { run } = useDebounceFn(() => {
    _update();
  }, 500);

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  const _update = () => {
    let newFields = getFieldsValue();
    attributeUpdate({
      id,
      data: newFields,
    });
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="width" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(
          <InputNumber
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>

      <Form.Item label="height" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(
          <InputNumber
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>

      <Form.Item label="left" {...formItemLayout}>
        {getFieldDecorator('left', {
          initialValue: left,
        })(
          <InputNumber
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>

      <Form.Item label="top" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: top,
        })(
          <InputNumber
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
    </div>
  );
};

export default Form.create()(BasicConfig);

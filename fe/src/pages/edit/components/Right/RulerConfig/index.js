import React from 'react';
import { Form } from 'antd';

import InputColor from '@/components/InputColor';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const RulerConfig = props => {
  const {
    config,
    form: { getFieldDecorator },
  } = props;
  const { lineColor } = config || {};

  return (
    <React.Fragment>
      <Form.Item label="辅助线颜色" {...formItemLayout}>
        {getFieldDecorator('ruleStyle.lineColor', {
          initialValue: lineColor,
        })(<InputColor />)}
      </Form.Item>
    </React.Fragment>
  );
};

export default RulerConfig;

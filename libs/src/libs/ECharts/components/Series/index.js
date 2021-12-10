import React, { useEffect } from 'react';

import { Form, InputNumber, Switch } from 'antd';
import { dealWithData } from '../../../../helpers/utils';
import { useDebounceFn } from '@umijs/hooks';
import { reap } from '../../../../components/SafeReaper';
import styles from './index.less';
const FormItem = Form.Item;
const Series = props => {
  const {
    style,
    form: { getFieldDecorator, getFieldsValue, getFieldValue, resetFields },
    formItemLayout,
    mockData: propsMockData,
    updateStyle,
    mockData,
  } = props;

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  const { series = [] } = mockData;

  return <div className={styles.textDiv}>asdasdasd</div>;
};

export default Form.create()(Series);

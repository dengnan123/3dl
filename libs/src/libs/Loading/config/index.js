import React from 'react';
import { Form, Switch } from 'antd';
import FormaterItem from '../../../components/FormaterItem';
import { getFormDefValue } from '../../../helpers/form';
import UploadImg from '../../../components/UploadImg';

import styles from './index.less';

const LoadingConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    form,
    style,
  } = props;

  const formaterItemProps = {
    form,
    style,
    formItemLayout,
    field: 'modalPromptMsgFilter',
    data: {},
    btnText: '配置提示Modal的提示语',
  };

  const openHighConfig = getFormDefValue(style, form, 'openHighConfig');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <UploadImg {...props}></UploadImg>
      {/* <Form.Item label="loadingSvg" {...formItemLayout}>
        {getFieldDecorator('svgStr', {
          initialValue: svgStr,
        })(<Input.TextArea />)}
      </Form.Item> */}
      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: openHighConfig,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openHighConfig ? <FormaterItem {...formaterItemProps}></FormaterItem> : null}
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // console.log('123123123123', newFields);
    // if (newFields.modalPromptMsgFilter) {
    //   newFields.modalPromptMsgFilterEs5 = '';
    // }
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(LoadingConfig);

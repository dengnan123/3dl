import React, { Fragment } from 'react';
import { Form, Switch, InputNumber, Select } from 'antd';
import FormaterItem from '../../../components/FormaterItem';
import { getFormDefValue } from '../../../helpers/form';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const LoadingConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    form,
    style,
  } = props;

  const {
    width = 540,
    hiddenFooterTopLine,
    hiddenCloseX,
    modalBodyBottom,
    autoCloseTime,
    confirmBtnColor = 'rgba(255,255,255,1)',
    confirmBtnBgColor = 'rgba(255,77,79,1)',
    confirmBtnBorderColor = 'rgba(255,77,79,1)',
    cancelBtnColor = 'rgba(254,100,58,1)',
    cancelBtnBgColor = 'rgba(255,255,255,1)',
    cancelBtnBorderColor = 'rgba(217,217,217,1)',
  } = style || {};

  const openHighConfig = getFormDefValue(style, form, 'openHighConfig');

  const formaterItemProps = {
    form,
    style,
    formItemLayout,
    field: 'footer',
    data: style,
    btnText: '弹框footer',
  };

  const formaterItemProps2 = {
    form,
    style,
    formItemLayout,
    field: 'content',
    data: style,
    btnText: '弹框内容',
  };

  const maskClosable = getFormDefValue(style, form, 'maskClosable', true);
  const openAutoClose = getFormDefValue(style, form, 'openAutoClose', false);

  const modalTypeList = [
    {
      label: '提示框',
      value: 'prompt',
    },
    {
      label: '确认框',
      value: 'submit',
    },
  ];
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="弹框类型" {...formItemLayout}>
        {getFieldDecorator('modalType', {
          initialValue: 'submit',
        })(
          <Select>
            {modalTypeList.map(t => (
              <Select.Option key={t.value} value={t.value}>
                {t.label}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="打开自动关闭" {...formItemLayout}>
        {getFieldDecorator('openAutoClose', {
          initialValue: openAutoClose,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {Boolean(openAutoClose) && (
        <Form.Item label="填写时间(秒)" {...formItemLayout}>
          {getFieldDecorator('autoCloseTime', {
            initialValue: autoCloseTime,
          })(<InputNumber />)}
        </Form.Item>
      )}

      <Form.Item label="弹框宽度" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="确定按钮字体颜色" {...formItemLayout}>
        {getFieldDecorator('confirmBtnColor', {
          initialValue: confirmBtnColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="确定按钮背景色" {...formItemLayout}>
        {getFieldDecorator('confirmBtnBgColor', {
          initialValue: confirmBtnBgColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="确定按钮边框色" {...formItemLayout}>
        {getFieldDecorator('confirmBtnBorderColor', {
          initialValue: confirmBtnBorderColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="取消按钮字体颜色" {...formItemLayout}>
        {getFieldDecorator('cancelBtnColor', {
          initialValue: cancelBtnColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="取消按钮背景色" {...formItemLayout}>
        {getFieldDecorator('cancelBtnBgColor', {
          initialValue: cancelBtnBgColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="取消按钮边框色" {...formItemLayout}>
        {getFieldDecorator('cancelBtnBorderColor', {
          initialValue: cancelBtnBorderColor,
        })(<InputColor />)}
      </Form.Item>
      <Form.Item label="content与footer的间距" {...formItemLayout}>
        {getFieldDecorator('modalBodyBottom', {
          initialValue: modalBodyBottom,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="content与footer的间距" {...formItemLayout}>
        {getFieldDecorator('modalBodyBottom', {
          initialValue: modalBodyBottom,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="点击蒙版隐藏自己" {...formItemLayout}>
        {getFieldDecorator('maskClosable', {
          initialValue: maskClosable,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="隐藏分割线" {...formItemLayout}>
        {getFieldDecorator('hiddenFooterTopLine', {
          initialValue: hiddenFooterTopLine,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="隐藏关闭icon" {...formItemLayout}>
        {getFieldDecorator('hiddenCloseX', {
          initialValue: hiddenCloseX,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: openHighConfig,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openHighConfig ? (
        <Fragment>
          <FormaterItem {...formaterItemProps}></FormaterItem>
          <FormaterItem {...formaterItemProps2}></FormaterItem>
        </Fragment>
      ) : null}
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
    // if (newFields.modalPromptMsgFilter) {
    //   newFields.modalPromptMsgFilterEs5 = '';
    // }
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(LoadingConfig);

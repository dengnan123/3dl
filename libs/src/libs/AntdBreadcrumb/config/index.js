import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Input, Switch } from 'antd';

import InputColor from '../../../components/InputColor';

import styles from './index.less';

const AntdBreadcrumbConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    compKey = 'antdBreadcrumb',
    separator = '/',
    lineHeight = 22,
    fontSize = 14,
    fontColor = 'rgba(0,0,0,0.45)',
    lastFontColor = 'rgba(0,0,0,0.65)',
    iconBasic = { width: 16, height: 16, marginRight: 5, showFirst: true },
    breadcrumb = { marginRight: 20 },
  } = style || {};

  useEffect(() => {
    resetFields();
    return resetFields;
  }, [id, resetFields]);

  return (
    <div className={styles.container} style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="组件key" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input placeholder="compKey" />)}
      </Form.Item>

      <Form.Item label="分隔符" {...formItemLayout}>
        {getFieldDecorator('separator', {
          initialValue: separator,
        })(<Input placeholder="分隔符" />)}
      </Form.Item>

      <Form.Item label="行高" {...formItemLayout}>
        {getFieldDecorator('lineHeight', {
          initialValue: lineHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="文字大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="文字颜色" {...formItemLayout}>
        {getFieldDecorator('fontColor', {
          initialValue: fontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="最后一项文字颜色" {...formItemLayout}>
        {getFieldDecorator('lastFontColor', {
          initialValue: lastFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconBasic.width', {
          initialValue: iconBasic?.width,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标高度" {...formItemLayout}>
        {getFieldDecorator('iconBasic.height', {
          initialValue: iconBasic?.height,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标右边距" {...formItemLayout}>
        {getFieldDecorator('iconBasic.marginRight', {
          initialValue: iconBasic?.marginRight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="只显示第一个图标" {...formItemLayout}>
        {getFieldDecorator('iconBasic.showFirst', {
          initialValue: iconBasic?.showFirst,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="面包屑右边距" {...formItemLayout}>
        {getFieldDecorator('breadcrumb.marginRight', {
          initialValue: breadcrumb?.marginRight,
        })(<InputNumber />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();

    const finalParams = {
      ...style,
      ...newFields,
    };

    updateStyle(finalParams);
  }, 500),
})(AntdBreadcrumbConfig);

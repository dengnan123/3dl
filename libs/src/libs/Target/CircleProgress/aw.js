import React, { useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import { debounce, omit } from 'lodash';
import { filterObj } from '@/helpers/utils';
// import InputColor from '@/components/InputColor';
// import { reap } from '../../../../components/SafeReaper';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    isSelectCompInfo,
  } = props;

  const { id, width, height, left, top, style = {} } = isSelectCompInfo || {};

  const { borderWidth, borderColor, paddingLeft, paddingRight, paddingBottom, paddingTop } = style;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="width" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="height" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="left" {...formItemLayout}>
        {getFieldDecorator('left', {
          initialValue: left,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="top" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: top,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="边框宽度" {...formItemLayout}>
        {getFieldDecorator('borderWidth', {
          initialValue: borderWidth,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="边框颜色" {...formItemLayout}>
        {getFieldDecorator('borderColor', {
          initialValue: borderColor,
        })(<InputNumber style={{}} />)}
      </Form.Item>

      <Form.Item label="左边距" {...formItemLayout}>
        {getFieldDecorator('paddingLeft', {
          initialValue: paddingLeft,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="右边距" {...formItemLayout}>
        {getFieldDecorator('paddingRight', {
          initialValue: paddingRight,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="上边距" {...formItemLayout}>
        {getFieldDecorator('paddingTop', {
          initialValue: paddingTop,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="下边距" {...formItemLayout}>
        {getFieldDecorator('paddingBottom', {
          initialValue: paddingBottom,
        })(<InputNumber />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      attributeUpdate,
      isSelectCompInfo,
    } = props;
    const { id, style } = isSelectCompInfo;
    const newFields = getFieldsValue();
    // 处理数据
    const newSty = omit(newFields, 'left', 'top', 'height', 'width');
    const _sty = filterObj(newSty, ['', undefined, null]);
    attributeUpdate({
      id,
      data: {
        left: newFields.left,
        top: newFields.top,
        height: newFields.height,
        width: newFields.width,
        style: {
          ...style,
          ..._sty,
        },
      },
    });
  }, 500),
})(BasicConfig);

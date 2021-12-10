import React, { useEffect } from 'react';
import { Form, InputNumber, Collapse, Select } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';
import ItemTooptip from '../../../components/ItemTooptip';

const LocaleSwitchConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    edition,
    fontSize,
    fontWeight,
    color,
    hilightColor,
    hilightBgColor,
    borderColor,
    borderRadius,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div>
      <Form.Item label="样式">
        {getFieldDecorator('edition', {
          initialValue: edition || 'editionOne',
        })(
          <Select>
            <Select.Option value="editionOne">主题一</Select.Option>
            <Select.Option value="editionTwo">主题二</Select.Option>
            {/* <Select.Option value="edition-three">主题三</Select.Option> */}
          </Select>,
        )}
      </Form.Item>

      <Collapse>
        <Collapse.Panel header={ItemTooptip('字体', 'fontStyle', 'top')}>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('fontWeight', {
              initialValue: fontWeight,
            })(<InputNumber min={100} max={900} step={100} />)}
          </Form.Item>
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('color', {
              initialValue: color,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="高亮字体颜色" {...formItemLayout}>
            {getFieldDecorator('hilightColor', {
              initialValue: hilightColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="高亮背景颜色" {...formItemLayout}>
            {getFieldDecorator('hilightBgColor', {
              initialValue: hilightBgColor,
            })(<InputColor />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header={ItemTooptip('边框', 'border', 'top')}>
          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('borderColor', {
              initialValue: borderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="边框圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
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
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(LocaleSwitchConfig);

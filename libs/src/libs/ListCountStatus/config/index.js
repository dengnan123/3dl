import React, { useEffect } from 'react';
import { Form, InputNumber, Select, Collapse, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;
const TEXT_ALIGN = ['left', 'center', 'right'];
const FONT_STYLES = ['normal', 'italic'];

const StatusCountConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue },
    id,
    style,
  } = props;

  const {
    itemHeight = 45,
    isAmountFormat = false,
    isCountAnimation = false,
    animationTime = 5,
    labelWidth = 120,
    labelAlign = 'left',
    labelFontWeight = 400,
    labelFontSize = 14,
    evenLabelFontSize = null,
    labelColor = '#424242',
    evenLabelFontColor = '',
    valueWidth = 120,
    valueAlign = 'left',
    valueFontWeight = 400,
    valueFontStyle = 'normal',
    valueFontSize = 14,
    evenValueFontSize = null,
    valueColor = '#424242',
    evenValueFontColor = '',
    iconFontSize = 12,
    iconMarginLeft = 5,
    // statusItemBgColor,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const showTime = getFieldValue('isCountAnimation');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse accordion defaultActiveKey="BasicConfig">
        <Panel header="基础配置" key="BasicConfig">
          <Form.Item label="每行高度" {...formItemLayout}>
            {getFieldDecorator('itemHeight', {
              initialValue: itemHeight,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="iconFontSize" {...formItemLayout}>
            {getFieldDecorator('iconFontSize', {
              initialValue: iconFontSize,
            })(<InputNumber min={12} step={1} />)}
          </Form.Item>

          <Form.Item label="iconMarginLeft" {...formItemLayout}>
            {getFieldDecorator('iconMarginLeft', {
              initialValue: iconMarginLeft,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="开启金额计数格式" {...formItemLayout}>
            {getFieldDecorator('isAmountFormat', {
              valuePropName: 'checked',
              initialValue: isAmountFormat,
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="开启数字滚动" {...formItemLayout}>
            {getFieldDecorator('isCountAnimation', {
              valuePropName: 'checked',
              initialValue: isCountAnimation,
            })(<Switch />)}
          </Form.Item>
          {showTime && (
            <Form.Item label="数字滚动间隔" {...formItemLayout}>
              {getFieldDecorator('animationTime', {
                initialValue: animationTime,
              })(<InputNumber min={0} />)}
            </Form.Item>
          )}
        </Panel>

        <Panel header="Label配置" key="LabelConfig">
          <Form.Item label="Label宽度" {...formItemLayout}>
            {getFieldDecorator('labelWidth', {
              initialValue: labelWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="Label对齐方式" {...formItemLayout}>
            {getFieldDecorator('labelAlign', {
              initialValue: labelAlign,
            })(
              <Select>
                {TEXT_ALIGN.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Label字体粗细" {...formItemLayout}>
            {getFieldDecorator('labelFontWeight', {
              initialValue: labelFontWeight,
            })(<InputNumber min={300} step={100} />)}
          </Form.Item>

          <Form.Item label="Label字体大小" {...formItemLayout}>
            {getFieldDecorator('labelFontSize', {
              initialValue: labelFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="双行Label字体大小" {...formItemLayout}>
            {getFieldDecorator('evenLabelFontSize', {
              initialValue: evenLabelFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="Label字体颜色" {...formItemLayout}>
            {getFieldDecorator('labelColor', {
              initialValue: labelColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="双行Label字体颜色" {...formItemLayout}>
            {getFieldDecorator('evenLabelFontColor', {
              initialValue: evenLabelFontColor,
            })(<InputColor />)}
          </Form.Item>
        </Panel>

        <Panel header="Value配置" key="ValueConfig">
          <Form.Item label="value宽度" {...formItemLayout}>
            {getFieldDecorator('valueWidth', {
              initialValue: valueWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="Value对齐方式" {...formItemLayout}>
            {getFieldDecorator('valueAlign', {
              initialValue: valueAlign,
            })(
              <Select>
                {TEXT_ALIGN.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Value字体粗细" {...formItemLayout}>
            {getFieldDecorator('valueFontWeight', {
              initialValue: valueFontWeight,
            })(<InputNumber min={300} step={100} />)}
          </Form.Item>

          <Form.Item label="Value字体样式" {...formItemLayout}>
            {getFieldDecorator('valueFontStyle', {
              initialValue: valueFontStyle,
            })(
              <Select>
                {FONT_STYLES.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Value字体大小" {...formItemLayout}>
            {getFieldDecorator('valueFontSize', {
              initialValue: valueFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="双行Label字体大小" {...formItemLayout}>
            {getFieldDecorator('evenValueFontSize', {
              initialValue: evenValueFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="Value字体颜色" {...formItemLayout}>
            {getFieldDecorator('valueColor', {
              initialValue: valueColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="双行Value字体颜色" {...formItemLayout}>
            {getFieldDecorator('evenValueFontColor', {
              initialValue: evenValueFontColor,
            })(<InputColor />)}
          </Form.Item>
        </Panel>
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
})(StatusCountConfig);

import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Switch, Select, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';

import styles from './index.less';
const { Panel } = Collapse;

const CustomizeSelectConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    width = 80,
    minWidth = 80,
    autoWidth = false,
    height = 28,
    showLabel = true,
    label = '选择区域',
    labelEn = 'Select Area',
    labelColor = '#4a4a4a',
    labelFontSize = 16,
    labelMarginRight = 10,
    placeholder = '请选择',
    textAlign = 'left',
    showSearch = false,
    allowClear = true,
    showArrow = true,
    arrowSvg = '',
    fontSize = 12,
    fontColor = '#999999',
    borderColor = '#D8D8D8',
    borderSize = 1,
    borderRadius = 4,
    nameKey = 'name',
    valueKey = 'id',
    compKey,
    optionColor,
    optionBg,
    opFontSize = 16,
    paddingTB = 5,
    paddingLR = 15,
    opHeight = 200,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Collapse accordion>
        <Panel header="基础配置" key="基础配置">
          <Form.Item label="宽度" {...formItemLayout}>
            {getFieldDecorator('width', {
              initialValue: width,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="最小宽度" {...formItemLayout}>
            {getFieldDecorator('minWidth', {
              initialValue: minWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="宽度自适应" {...formItemLayout}>
            {getFieldDecorator('autoWidth', {
              initialValue: autoWidth,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('height', {
              initialValue: height,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('fontColor', {
              initialValue: fontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="提示文字" {...formItemLayout}>
            {getFieldDecorator('placeholder', {
              initialValue: placeholder,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="支持搜索" {...formItemLayout}>
            {getFieldDecorator('showSearch', {
              initialValue: showSearch,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="支持清除" {...formItemLayout}>
            {getFieldDecorator('allowClear', {
              initialValue: allowClear,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="是否显示下拉小箭头" {...formItemLayout}>
            {getFieldDecorator('showArrow', {
              initialValue: showArrow,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showArrow && (
            <Form.Item label="下拉小箭头svg" {...formItemLayout}>
              {getFieldDecorator('arrowSvg', {
                initialValue: arrowSvg,
              })(<Input.TextArea />)}
            </Form.Item>
          )}

          <Form.Item label="文字对齐方式" {...formItemLayout}>
            {getFieldDecorator('textAlign', {
              initialValue: textAlign,
            })(
              <Select style={{ width: '100%' }}>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('borderColor', {
              initialValue: borderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框粗细" {...formItemLayout}>
            {getFieldDecorator('borderSize', {
              initialValue: borderSize,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="边框圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="nameKey" {...formItemLayout}>
            {getFieldDecorator('nameKey', {
              initialValue: nameKey,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="valueKey" {...formItemLayout}>
            {getFieldDecorator('valueKey', {
              initialValue: valueKey,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="组件key" {...formItemLayout}>
            {getFieldDecorator('compKey', {
              initialValue: compKey,
            })(<Input />)}
          </Form.Item>
        </Panel>

        <Panel header="label设置" key="label设置">
          <Form.Item label="显示标签" {...formItemLayout}>
            {getFieldDecorator('showLabel', {
              initialValue: showLabel,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showLabel && (
            <>
              <Form.Item label="label(中)" {...formItemLayout}>
                {getFieldDecorator('label', {
                  initialValue: label,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="label(英)" {...formItemLayout}>
                {getFieldDecorator('labelEn', {
                  initialValue: labelEn,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="label字体颜色" {...formItemLayout}>
                {getFieldDecorator('labelColor', {
                  initialValue: labelColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="label字体大小" {...formItemLayout}>
                {getFieldDecorator('labelFontSize', {
                  initialValue: labelFontSize,
                })(<InputNumber min={12} />)}
              </Form.Item>

              <Form.Item label="label右边距" {...formItemLayout}>
                {getFieldDecorator('labelMarginRight', {
                  initialValue: labelMarginRight,
                })(<InputNumber min={0} />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header="下拉框设置" key="内容设置">
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('optionColor', {
              initialValue: optionColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="背景颜色" {...formItemLayout}>
            {getFieldDecorator('optionBg', {
              initialValue: optionBg,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('opHeight', {
              initialValue: opHeight,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('opFontSize', {
              initialValue: opFontSize,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="字体上下边距" {...formItemLayout}>
            {getFieldDecorator('paddingTB', {
              initialValue: paddingTB,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="字体左右边距" {...formItemLayout}>
            {getFieldDecorator('paddingLR', {
              initialValue: paddingLR,
            })(<InputNumber />)}
          </Form.Item>
        </Panel>
      </Collapse>
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

    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(CustomizeSelectConfig);

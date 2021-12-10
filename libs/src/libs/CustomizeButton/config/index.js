import React from 'react';
import { Form, Select, Switch, InputNumber, Input, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const CustomizeButtonConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, getFieldValue },
    style,
  } = props;

  const {
    content = '按钮',
    contentEn = 'button',
    fontSize = 12,
    fontColor = '#000000',
    borderRadius = 0,
    type = 'default',
    bgColor = '#fff',
    clickedFontColor = '#fff',
    clickedBgColor = 'rgba(235,75,25,70)',
    clickedBorderColor = 'rgba(235,75,25,100)',
    borderWidth = 1,
    borderColor = '#000000',
    boxShadow = 'none',
    padding = 16,
    textAlign = 'center',
    showCustomColor = false,
    compKey,
    compValue,
    openCbColor = false,
    backInitStyle = false,
    backTime = 250,
  } = style || {};

  return (
    <div>
      <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <Form.Item label="内容(中)" {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: content,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="内容(英)" {...formItemLayout}>
            {getFieldDecorator('contentEn', {
              initialValue: contentEn,
            })(<Input />)}
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

          <Form.Item label="圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: type,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="primary">Primary</Select.Option>
                <Select.Option value="dashed">Dashed</Select.Option>
                <Select.Option value="danger">Danger</Select.Option>
                <Select.Option value="link">Link</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>

        <Panel header="自定义" key="自定义">
          <Form.Item label="自定义" {...formItemLayout}>
            {getFieldDecorator('showCustomColor', {
              initialValue: showCustomColor,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showCustomColor && (
            <React.Fragment>
              <Form.Item label="背景颜色" {...formItemLayout}>
                {getFieldDecorator('bgColor', {
                  initialValue: bgColor,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="边框宽度" {...formItemLayout}>
                {getFieldDecorator('borderWidth', {
                  initialValue: borderWidth,
                })(<InputNumber min={0} />)}
              </Form.Item>
              <Form.Item label="边框颜色" {...formItemLayout}>
                {getFieldDecorator('borderColor', {
                  initialValue: borderColor,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="边框阴影" {...formItemLayout}>
                {getFieldDecorator('boxShadow', {
                  initialValue: boxShadow,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="点击后字体颜色" {...formItemLayout}>
                {getFieldDecorator('clickedFontColor', {
                  initialValue: clickedFontColor,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="点击后背景颜色" {...formItemLayout}>
                {getFieldDecorator('clickedBgColor', {
                  initialValue: clickedBgColor,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="点击后边框颜色" {...formItemLayout}>
                {getFieldDecorator('clickedBorderColor', {
                  initialValue: clickedBorderColor,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="两边-padding" {...formItemLayout}>
                {getFieldDecorator('padding', {
                  initialValue: padding,
                })(<InputNumber min={0} />)}
              </Form.Item>
              <Form.Item label="文字对齐方式" {...formItemLayout}>
                {getFieldDecorator('textAlign', {
                  initialValue: textAlign,
                })(
                  <Select style={{ width: 120 }}>
                    <Select.Option value="center">center</Select.Option>
                    <Select.Option value="left">left</Select.Option>
                    <Select.Option value="right">right</Select.Option>
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="会否开启点击变色" {...formItemLayout}>
                {getFieldDecorator('openCbColor', {
                  initialValue: openCbColor,
                  valuePropName: 'checked',
                })(<Switch />)}
              </Form.Item>

              <Form.Item label="开启点击后回到最初预设" {...formItemLayout}>
                {getFieldDecorator('backInitStyle', {
                  initialValue: backInitStyle,
                  valuePropName: 'checked',
                })(<Switch disabled={!style?.openCbColor} />)}
              </Form.Item>
              {backInitStyle && (
                <Form.Item label="回到最初预设时间" {...formItemLayout}>
                  {getFieldDecorator('backTime', {
                    initialValue: backTime,
                    valuePropName: 'checked',
                  })(<Input suffix="MS" disabled={!style?.backInitStyle} />)}
                </Form.Item>
              )}
            </React.Fragment>
          )}
        </Panel>
      </Collapse>

      <Form.Item label="compKey" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="compValue" {...formItemLayout}>
        {getFieldDecorator('compValue', {
          initialValue: compValue,
        })(<Input />)}
      </Form.Item>
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
})(CustomizeButtonConfig);

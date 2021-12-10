import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Switch, Select } from 'antd';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const CustomizeLegendConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    type = 'horizontal',
    legendWidth = '45%',
    legendHeight = 30,
    legendSpacing = 20,
    fontSize = 12,
    fontColor = '#6C7293',
    valueFontSize,
    valueFontColor,
    fontWeight = 400,
    showIcon = true,
    iconWidth = 9,
    iconHeight = 9,
    iconRadius = 9,
    iconMarginRight = 4,
    hideScrollBar = false,
    hideLastPadding = false,
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }} className={styles.container}>
      <Form.Item label="内容排版方式" {...formItemLayout}>
        {getFieldDecorator('type', {
          initialValue: type,
        })(
          <Select>
            <Select.Option value="horizontal">横排</Select.Option>
            <Select.Option value="vertical">竖排</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="图例宽度" {...formItemLayout}>
        {getFieldDecorator('legendWidth', {
          initialValue: legendWidth,
        })(<Input placeholder="20px, 20%" />)}
      </Form.Item>

      <Form.Item label="图例高度" {...formItemLayout}>
        {getFieldDecorator('legendHeight', {
          initialValue: legendHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图例水平间距" {...formItemLayout}>
        {getFieldDecorator('legendSpacing', {
          initialValue: legendSpacing,
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

      <Form.Item label="Value字体大小" {...formItemLayout}>
        {getFieldDecorator('valueFontSize', {
          initialValue: valueFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>
      <Form.Item label="Value字体颜色" {...formItemLayout}>
        {getFieldDecorator('valueFontColor', {
          initialValue: valueFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="文字粗细" {...formItemLayout}>
        {getFieldDecorator('fontWeight', {
          initialValue: fontWeight,
        })(<InputNumber min={100} step={100} max={900} />)}
      </Form.Item>

      <Form.Item label="显示图例图标" {...formItemLayout}>
        {getFieldDecorator('showIcon', {
          initialValue: showIcon,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {showIcon && (
        <>
          <Form.Item label="图标宽度" {...formItemLayout}>
            {getFieldDecorator('iconWidth', {
              initialValue: iconWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="图标高度" {...formItemLayout}>
            {getFieldDecorator('iconHeight', {
              initialValue: iconHeight,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="图标圆角" {...formItemLayout}>
            {getFieldDecorator('iconRadius', {
              initialValue: iconRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="图标右边距" {...formItemLayout}>
            {getFieldDecorator('iconMarginRight', {
              initialValue: iconMarginRight,
            })(<InputNumber />)}
          </Form.Item>
        </>
      )}

      <Form.Item label="隐藏滚动条" {...formItemLayout}>
        {getFieldDecorator('hideScrollBar', {
          initialValue: hideScrollBar,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="隐藏最后图例的PaddingRight" {...formItemLayout}>
        {getFieldDecorator('hideLastPadding', {
          initialValue: hideLastPadding,
          valuePropName: 'checked',
        })(<Switch />)}
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
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(CustomizeLegendConfig);

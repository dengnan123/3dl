import React, { useEffect } from 'react';
import { Form, InputNumber, Checkbox, Select, Row, Col } from 'antd';

import InputColor from '../../../../components/InputColor';
import styles from './index.less';

const FormItem = Form.Item;

const Am3DPieConfig = props => {
  const { style, form } = props;
  const { getFieldDecorator, resetFields } = form;
  const {
    innerRadius = 0,
    showStroke = false,
    strokeColor = '#fff',
    strokeWidth = 2,
    strokeOpacity = 1,

    showLegend = false,
    legendPosition = 'bottom',
    // legendMaxWidth,
    legendMaxHeight,
    legendScroll = false,
    legendWidth = 20,
    legendHeight = 20,
    legendRadius = 20,
    showTooltip = true,
    fontSize = 14,
    fontColor,
  } = style;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, style]);

  return (
    <div className={styles.box}>
      <div className={styles.formContent}>
        <FormItem label="内圈弧度">
          {getFieldDecorator('innerRadius', {
            initialValue: innerRadius,
          })(<InputNumber />)}
        </FormItem>

        <p className={styles.itemTitle}>图例</p>
        <Row>
          <Col span="12">
            <FormItem label="">
              {getFieldDecorator('showLegend', {
                valuePropName: 'checked',
                initialValue: showLegend,
              })(<Checkbox>是否显示图例</Checkbox>)}
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="">
              {getFieldDecorator('legendScroll', {
                valuePropName: 'checked',
                initialValue: legendScroll,
              })(<Checkbox>可否滚动</Checkbox>)}
            </FormItem>
          </Col>
        </Row>

        <FormItem label="显示位置">
          {getFieldDecorator('legendPosition', {
            initialValue: legendPosition,
          })(
            <Select>
              <Select.Option value="top">Top</Select.Option>
              <Select.Option value="right">Right</Select.Option>
              <Select.Option value="bottom">Bottom</Select.Option>
              <Select.Option value="left">Left</Select.Option>
            </Select>,
          )}
        </FormItem>
        {/* <FormItem label="最大宽度">
          {getFieldDecorator('legendMaxWidth', {
            initialValue: legendMaxWidth,
          })(<InputNumber />)}
        </FormItem> */}
        <FormItem label="最大高度">
          {getFieldDecorator('legendMaxHeight', {
            initialValue: legendMaxHeight,
          })(<InputNumber />)}
        </FormItem>

        <FormItem label="Icon宽度">
          {getFieldDecorator('legendWidth', {
            initialValue: legendWidth,
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="Icon高度">
          {getFieldDecorator('legendHeight', {
            initialValue: legendHeight,
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="Icon圆角">
          {getFieldDecorator('legendRadius', {
            initialValue: legendRadius,
          })(<InputNumber />)}
        </FormItem>
        <p className={styles.itemTitle}>Series边框线</p>
        <FormItem label="">
          {getFieldDecorator('showStroke', {
            valuePropName: 'checked',
            initialValue: showStroke,
          })(<Checkbox>是否显示边框线</Checkbox>)}
        </FormItem>
        <FormItem label="颜色">
          {getFieldDecorator('strokeColor', {
            initialValue: strokeColor,
          })(<InputColor />)}
        </FormItem>
        <FormItem label="宽度">
          {getFieldDecorator('strokeWidth', {
            initialValue: strokeWidth,
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="透明度">
          {getFieldDecorator('strokeOpacity', {
            initialValue: strokeOpacity,
          })(<InputNumber step={0.1} max={1} />)}
        </FormItem>
        <p className={styles.itemTitle}>ToolTip配置</p>
        <FormItem label="">
          {getFieldDecorator('showTooltip', {
            valuePropName: 'checked',
            initialValue: showTooltip,
          })(<Checkbox>是否显示</Checkbox>)}
        </FormItem>
        <FormItem label="字体大小">
          {getFieldDecorator('fontSize', {
            initialValue: fontSize,
          })(<InputNumber />)}
        </FormItem>
        <FormItem label="字体颜色">
          {getFieldDecorator('fontColor', {
            initialValue: fontColor,
          })(<InputColor />)}
        </FormItem>
      </div>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    console.log('newFields: ', newFields);
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(Am3DPieConfig);

import React, { useEffect } from 'react';
import { Collapse, Form, Input, InputNumber, Select } from 'antd';

import InputColor from '../../../components/InputColor';
// import styles from './index.less';

const { Panel } = Collapse;
const CustomizeWeatherConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    id,
    style,
  } = props;

  const {
    svgUrl,
    svgWidth,
    svgHeight,
    svgColor = '#7ED321',
    svgAlign = 'center',
    // isShowDate = true,
    // dateFormat = 'ddd D MMMM YYYY',
    // dateDiff,
    dateHeight = 40,
    dateFontSize = 16,
    dateFontWeight = 500,
    dateColor = '#421FEE',
    dateTextAlign = 'center',
    tempHeight = 30,
    tempFontSize = 14,
    tempFontWeight = 400,
    tempColor,
    tempTextAlign = 'center',
    descHeight = 30,
    descFontSize = 14,
    descFontWeight = 400,
    descColor,
    descTextAlign = 'center',
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse>
        <Panel header={'svg设置'} key={'main'}>
          <Form.Item label="SVG链接" {...formItemLayout}>
            {getFieldDecorator('svgUrl', {
              initialValue: svgUrl,
            })(<Input placeholder="输入SVG链接" />)}
          </Form.Item>
          <Form.Item label="宽度" {...formItemLayout}>
            {getFieldDecorator('svgWidth', {
              initialValue: svgWidth,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('svgHeight', {
              initialValue: svgHeight,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="颜色" {...formItemLayout}>
            {getFieldDecorator('svgColor', {
              initialValue: svgColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('svgAlign', {
              initialValue: svgAlign,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>
        <Panel header={'顶部信息设置'} key={1}>
          {/* <Form.Item label="显示时间">
            {getFieldDecorator('isShowTime', {
              valuePropName: 'checked',
              initialValue: isShowDate,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="时间格式" {...formItemLayout}>
            {getFieldDecorator('dateFormat', {
              initialValue: dateFormat,
            })(<Input placeholder="ddd D MMMM YYYY" />)}
          </Form.Item>
          <Form.Item label="显示日期" {...formItemLayout}>
            {getFieldDecorator('dateDiff', {
              initialValue: dateDiff,
            })(<InputNumber placeholder="与当天日期的天数差(昨天:-1,明天:1)" step={1} />)}
          </Form.Item> */}
          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('dateHeight', {
              initialValue: dateHeight,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('dateFontSize', {
              initialValue: dateFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>
          <Form.Item label="字体粗细" {...formItemLayout}>
            {getFieldDecorator('dateFontWeight', {
              initialValue: dateFontWeight,
            })(<InputNumber min={0} step={100} />)}
          </Form.Item>
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('dateColor', {
              initialValue: dateColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('dateTextAlign', {
              initialValue: dateTextAlign,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>

        <Panel header={'温度值设置'} key={2}>
          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('tempHeight', {
              initialValue: tempHeight,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('tempFontSize', {
              initialValue: tempFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>
          <Form.Item label="字体粗细" {...formItemLayout}>
            {getFieldDecorator('tempFontWeight', {
              initialValue: tempFontWeight,
            })(<InputNumber min={0} step={100} />)}
          </Form.Item>
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('tempColor', {
              initialValue: tempColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('tempTextAlign', {
              initialValue: tempTextAlign,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>

        <Panel header={'描述设置'} key={3}>
          <Form.Item label="高度" {...formItemLayout}>
            {getFieldDecorator('descHeight', {
              initialValue: descHeight,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('descFontSize', {
              initialValue: descFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>
          <Form.Item label="字体粗细" {...formItemLayout}>
            {getFieldDecorator('descFontWeight', {
              initialValue: descFontWeight,
            })(<InputNumber min={0} step={100} />)}
          </Form.Item>
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('descColor', {
              initialValue: descColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('descTextAlign', {
              initialValue: descTextAlign,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
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
})(CustomizeWeatherConfig);

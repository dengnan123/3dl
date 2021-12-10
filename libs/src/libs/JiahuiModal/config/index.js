import React from 'react';
import { debounce } from 'lodash';

import { Form, Input, Collapse, Switch, InputNumber } from 'antd';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const ModalCofig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    BgColor = '',
    innerHeight = '',
    innerWidth = '764px',
    top = '593px',
    left = '605px',
    warpperHeight = '1896px',
    warpperWidth = '2096px',
    autoClose = true,
    delay = 3,
    bookingKey = '使用人',
    depKey = '部门',
    innerBgColor = '#ffffff',
    KeyFont = '36px',
    valueFont = '36px',
    borderRadius = '16px',
    padding = '24px 40px 50px',
    boxShadow = '2px 2px 32px 4px rgba(96, 96, 96, 0.4)',
    ItemBgColor = 'rgba(77,189,222,0.1)',
    ItemPadding = '15px 32px',
    KeyColor = '#606060',
    ValueColor = '#333333',
    KeyWidth = '0 0 316px',
    itemRadius = '12px',
    tagHeight = '64px',
    tagWidth = '144px',
    tagTop = '24px',
    tagRight = '40px',
    tagBRadius = '18px',
    tagTColor = '#ffffff',
    tagBGColor = 'rgba(186, 49, 34, 0.6)',
    tagFont = '32px',
    tagBorder = 'solid 3px #ba3122',
    tagLineHeight = '58px',
    marginBottom = '40px',
    deskLineHeight = '70px',
    deskMargin = '72px 0 45px',
    deskFont = '48px',
    deskTColor = '#333333',
    bgImgUrl = '',
  } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="是否自动关闭" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('autoClose', {
          initialValue: autoClose,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {autoClose && (
        <Form.Item label="自动关闭时间(秒)" {...formItemLayout} style={{ marginBottom: 0 }}>
          {getFieldDecorator('delay', {
            initialValue: delay,
          })(<InputNumber />)}
        </Form.Item>
      )}

      <Collapse accordion>
        <Panel header="外部容器配置" key="header">
          <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('warpperWidth', {
              initialValue: warpperWidth,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('warpperHeight', {
              initialValue: warpperHeight,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('BgColor', {
              initialValue: BgColor || '',
            })(<InputColor />)}
          </Form.Item>
        </Panel>

        <Panel header="内部框配置" key="inner">
          <Form.Item label="高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('innerHeight', {
              initialValue: innerHeight || 'auto',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('innerWidth', {
              initialValue: innerWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="top(相对外部容器)" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('top', {
              initialValue: top,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="left(相对外部容器)" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('left', {
              initialValue: left,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="圆角" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="padding" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('padding', {
              initialValue: padding,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('innerBgColor', {
              initialValue: innerBgColor || '#ffffff',
            })(<Input />)}
          </Form.Item>

          <Form.Item label="阴影" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('boxShadow', {
              initialValue: boxShadow,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="背景图" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('bgImgUrl', {
              initialValue: bgImgUrl || '',
            })(<Input />)}
          </Form.Item>
        </Panel>

        <Panel header="每行配置" key="item">
          <Form.Item label="padding" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('ItemPadding', {
              initialValue: ItemPadding,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="圆角" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('itemRadius', {
              initialValue: itemRadius,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="使用人Key" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('bookingKey', {
              initialValue: bookingKey,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="部门Key" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('depKey', {
              initialValue: depKey,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Key 宽度（flex）" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('KeyWidth', {
              initialValue: KeyWidth,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Key 字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('KeyColor', {
              initialValue: KeyColor,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Key 字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('KeyFont', {
              initialValue: KeyFont,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Value 字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('valueFont', {
              initialValue: valueFont,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="value 字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('ValueColor', {
              initialValue: ValueColor,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="每行 背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('ItemBgColor', {
              initialValue: ItemBgColor,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="marginBottom" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('marginBottom', {
              initialValue: marginBottom,
            })(<Input />)}
          </Form.Item>
        </Panel>
        <Panel header="tag标签设置" key="tag">
          <Form.Item label="高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagHeight', {
              initialValue: tagHeight || 'auto',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagWidth', {
              initialValue: tagWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="top(相对内部容器)" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagTop', {
              initialValue: tagTop,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="right(相对内部容器)" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagRight', {
              initialValue: tagRight,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagFont', {
              initialValue: tagFont,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="圆角" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagBRadius', {
              initialValue: tagBRadius,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagTColor', {
              initialValue: tagTColor,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagBGColor', {
              initialValue: tagBGColor,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="边框" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagBorder', {
              initialValue: tagBorder,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="行高" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tagLineHeight', {
              initialValue: tagLineHeight,
            })(<Input />)}
          </Form.Item>
        </Panel>

        <Panel header="工位名称属性设置" key="desk">
          <Form.Item label="行高" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('deskLineHeight', {
              initialValue: deskLineHeight || 'auto',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="margin" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('deskMargin', {
              initialValue: deskMargin,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('deskFont', {
              initialValue: deskFont,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('deskTColor', {
              initialValue: deskTColor,
            })(<Input />)}
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
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    delete newFields['tabKeys'];

    updateStyle({
      ...style,
      ...newFields,
    });
    // 处理数据
  }, 500),
})(ModalCofig);

import React, { useEffect } from 'react';
import { debounce } from 'lodash';

import { Form, Collapse, Input, Select, Switch, InputNumber } from 'antd';
import InputColor from '../../../components/InputColor';

// import styles from './index.less';

// const MODAL_POSITION = ['center', 'top'];
const ANIMATION_POSITION = ['top', 'right', 'bottom', 'left'];

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    style,
  } = props;

  const {
    // visible = false,
    // width = '500px',
    // height = '400px',
    // position = 'center',
    // positionTop = '120px',
    border = '1px solid #fff',
    borderRadius = '0px',
    backgroundColor,
    contentPadding = '0px',
    contentHorizontallyCentered = false,
    contentVerticallyCentered = false,
    aPosition = 'bottom',
    isShowMask = true,
    maskBgColor = 'rgba(0, 0, 0, 0.4)',
    isMaskClick = false,
    isShowClosed = true,
    iconSize = 20,
    iconColor = '#cccccc',
    iconTop = 10,
    iconRight = 10,
  } = style;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {/* <Form.Item label="是否显示Modal" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('visible', {
          valuePropName: 'checked',
          initialValue: visible,
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="高度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(<Input />)}
      </Form.Item> */}

      <Collapse accordion>
        <Collapse.Panel header="基础配置" key="Basic">
          {/* <Form.Item label="位置" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('position', {
              initialValue: position,
            })(
              <Select disabled={true}>
                {MODAL_POSITION.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          {position === 'top' && (
            <Form.Item label="距离顶部" {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('positionTop', {
                initialValue: positionTop,
              })(<Input />)}
            </Form.Item>
          )} */}
          <Form.Item label="背景颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('backgroundColor', {
              initialValue: backgroundColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="Border" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('border', {
              initialValue: border,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="BorderRadius" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="内容Padding" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentPadding', {
              initialValue: contentPadding,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="内容水平居中" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentHorizontallyCentered', {
              initialValue: contentHorizontallyCentered,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="内容垂直居中" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentVerticallyCentered', {
              initialValue: contentVerticallyCentered,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="动画进入位置" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('aPosition', {
              initialValue: aPosition,
            })(
              <Select>
                {ANIMATION_POSITION.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Collapse.Panel>
        <Collapse.Panel header="Mask配置" key="Mask">
          <Form.Item label="是否显示Mask">
            {getFieldDecorator('isShowMask', {
              valuePropName: 'checked',
              initialValue: isShowMask,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="Mask背景颜色">
            {getFieldDecorator('maskBgColor', {
              initialValue: maskBgColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="点击Mask隐藏">
            {getFieldDecorator('isMaskClick', {
              valuePropName: 'checked',
              initialValue: isMaskClick,
            })(<Switch />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header="关闭按钮配置" key="CloseIcon">
          <Form.Item label="是否显示关闭按钮">
            {getFieldDecorator('isShowClosed', {
              valuePropName: 'checked',
              initialValue: isShowClosed,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="Icon大小">
            {getFieldDecorator('iconSize', {
              initialValue: iconSize,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="Icon颜色">
            {getFieldDecorator('iconColor', {
              initialValue: iconColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="Icon位置(top)">
            {getFieldDecorator('iconTop', {
              initialValue: iconTop,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="Icon位置(right)">
            {getFieldDecorator('iconRight', {
              initialValue: iconRight,
            })(<InputNumber />)}
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
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(BasicConfig);

import React, { useEffect, useState } from 'react';
import { Form, Switch, Collapse, Input, InputNumber, Select } from 'antd';
import InputColor from '../../../components/InputColor';
import { debounce } from 'lodash';

import CodeEdit from '../../../components/CodeEditOther';
import FilterFormItem from '../../../components/FilterFormItem';
// import styles from './index.less';

const { Panel } = Collapse;

function HorizontalScrollPanelConfig(props) {
  const {
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div>
      <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <Form.Item label="边框宽">
            {getFieldDecorator('borderWidth', {
              initialValue: style?.borderWidth || 0,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="边框颜色">
            {getFieldDecorator('borderColor', {
              initialValue: style?.borderColor || '#c2bebe',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="边框圆角">
            {getFieldDecorator('borderRadius', {
              initialValue: style?.borderRadius || 0,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="盒子阴影">
            {getFieldDecorator('boxShadow', {
              initialValue:
                style?.boxShadow ||
                'rgba(43, 22, 22, 0.32) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="背景颜色">
            {getFieldDecorator('backgroundColor', {
              initialValue: style?.backgroundColor || '#eeeeee',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="Item背景颜色">
            {getFieldDecorator('itemBackgroundColor', {
              initialValue: style?.itemBackgroundColor || '#F8E71C',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="Item背景双颜色">
            {getFieldDecorator('itemEvenBackgroundColor', {
              initialValue: style?.itemEvenBackgroundColor || '#50E3C2',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="Item宽">
            {getFieldDecorator('itemWidth', {
              initialValue: style?.itemWidth || 200,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Item高">
            {getFieldDecorator('itemHeight', {
              initialValue: style?.itemHeight || 200,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Item外边距">
            {getFieldDecorator('itemMargin', {
              initialValue: style?.itemMargin || 10,
            })(<InputNumber />)}
          </Form.Item>
        </Panel>
        <Panel header="高级配置" key="高级配置">
          <Form.Item label="功能按钮显示">
            {getFieldDecorator('displayButton', {
              initialValue: style?.displayButton || 'showAll',
            })(
              <Select>
                <Select.Option value="showAll">按钮全显</Select.Option>
                <Select.Option value="showNone">隐藏按钮</Select.Option>
                <Select.Option value="showLeft">隐藏右按钮</Select.Option>
                <Select.Option value="showRight">隐藏左按钮</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="按钮移动步数">
            {getFieldDecorator('moveStep', {
              initialValue: style?.moveStep || 200,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="自定义Item样式">
            {getFieldDecorator('customizedStyle', {
              valuePropName: 'checked',
              initialValue: style?.customizedStyle || false,
            })(<Switch />)}
            <FilterFormItem
              form={{ getFieldDecorator, getFieldValue, setFieldsValue }}
              formFieldName="rawInlineCSS"
              initialValue={style?.rawInlineCSS || '{}'}
              fieldLabel=""
              language="json"
              disabled={!style?.customizedStyle}
            />
          </Form.Item>

          <Form.Item label="自定义item内容">
            {getFieldDecorator('customizedContent', {
              valuePropName: 'checked',
              initialValue: style?.customizedContent || false,
            })(<Switch />)}
            <FilterFormItem
              form={{ getFieldDecorator, getFieldValue, setFieldsValue }}
              formFieldName="rawHTML"
              initialValue={style?.rawHTML || 'return `${data}`'}
              fieldLabel=""
              disabled={!style?.customizedContent}
            />
          </Form.Item>

          <Form.Item label="关闭item悬浮效果">
            {getFieldDecorator('offItemHoverEffect', {
              valuePropName: 'checked',
              initialValue: style?.offItemHoverEffect || false,
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="关闭拖滚放大效果">
            {getFieldDecorator('offDragScaleEffect', {
              valuePropName: 'checked',
              initialValue: style?.offDragScaleEffect || false,
            })(<Switch />)}
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
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
  }, 100),
})(HorizontalScrollPanelConfig);

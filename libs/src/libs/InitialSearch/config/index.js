import React, { useEffect } from 'react';
import { Form, Switch, Collapse, Input, InputNumber, Select } from 'antd';
import InputColor from '../../../components/InputColor';
import FilterFormItem from '../../../components/FilterFormItem';

import { debounce } from 'lodash';

const { Panel } = Collapse;

function InitialSearchConfig(props) {
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
              initialValue: style?.backgroundColor || '#ffffff',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="文字颜色">
            {getFieldDecorator('fontColor', {
              initialValue: style?.fontColor || '#000000',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="文字大小">
            {getFieldDecorator('fontSize', {
              initialValue: style?.fontSize || 16,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="Item背景颜色">
            {getFieldDecorator('itemBackgroundColor', {
              initialValue: style?.itemBackgroundColor || 'rgba(0, 0, 0, 0)',
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="Item宽">
            {getFieldDecorator('itemWidth', {
              initialValue: style?.itemWidth || 30,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Item高">
            {getFieldDecorator('itemHeight', {
              initialValue: style?.itemHeight || 40,
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
              initialValue: style?.displayButton || 'showNone',
            })(
              <Select>
                <Select.Option value="showAll">按钮全显</Select.Option>
                <Select.Option value="showNone">隐藏按钮</Select.Option>
                <Select.Option value="showLeft">隐藏右按钮</Select.Option>
                <Select.Option value="showRight">隐藏左按钮</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="按钮宽">
            {getFieldDecorator('buttonWidth', {
              initialValue: style?.buttonWidth || 20,
            })(<InputNumber width="50%" />)}
          </Form.Item>
          <Form.Item label="按钮高">
            {getFieldDecorator('buttonHeight', {
              initialValue: style?.buttonHeight || 20,
            })(<InputNumber width="50%" />)}
          </Form.Item>

          <Form.Item label="按钮移动步数">
            {getFieldDecorator('moveStep', {
              initialValue: style?.moveStep || 100,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="自定义item悬浮样式">
            <FilterFormItem
              form={{ getFieldDecorator, getFieldValue, setFieldsValue }}
              formFieldName="hoverStyles"
              initialValue={style?.hoverStyles || 'return `${data}`'}
              fieldLabel=""
              disabled={style?.offItemHoverEffect}
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
})(InitialSearchConfig);

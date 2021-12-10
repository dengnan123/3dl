import React, { useEffect } from 'react';
import { Form, Switch, Collapse, Input, InputNumber, Select } from 'antd';
import InputColor from '../../../components/InputColor';
import { debounce } from 'lodash';

const { Panel } = Collapse;

function HorizontalScrollPanelContainerConfig(props) {
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
          <Form.Item label="最大宽">
            {getFieldDecorator('containerWidth', {
              initialValue: style?.containerWidth || 720,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="最大高">
            {getFieldDecorator('containerHeight', {
              initialValue: style?.containerHeight || 320,
            })(<InputNumber />)}
          </Form.Item>
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
          <div className="ant-form-item-label">
            <label>容器内边距</label>
          </div>
          <div style={{ display: 'flex' }}>
            <Form.Item label="上" style={{ width: '30%' }}>
              {getFieldDecorator('paddingTop', {
                initialValue: style?.paddingTop || 0,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item label="下" style={{ width: '30%' }}>
              {getFieldDecorator('paddingBottom', {
                initialValue: style?.paddingBottom || 0,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item label="左" style={{ width: '30%' }}>
              {getFieldDecorator('paddingLeft', {
                initialValue: style?.paddingLeft || 0,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item label="右" style={{ width: '30%' }}>
              {getFieldDecorator('paddingRight', {
                initialValue: style?.paddingRight || 0,
              })(<InputNumber />)}
            </Form.Item>
          </div>

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
        </Panel>
        <Panel header="高级配置" key="高级配置">
          <Form.Item label="左右按钮显示">
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
          <Form.Item label="左右按钮取反">
            {getFieldDecorator('reversedButton', {
              valuePropName: 'checked',
              initialValue: style?.reversedButton || false,
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="按钮移动步数">
            {getFieldDecorator('moveStep', {
              initialValue: style?.moveStep || 200,
            })(<InputNumber disabled={style?.displayButton === 'showNone'} />)}
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
})(HorizontalScrollPanelContainerConfig);

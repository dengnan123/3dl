import React, { useEffect } from 'react';
import { Form, Switch, InputNumber } from 'antd';
import { debounce } from 'lodash';
const FormItem = Form.Item;

function Building20PPSConfig(props) {
  const {
    form: { getFieldDecorator, resetFields },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const {
    closeGUIManager = false,
    isHideGUI = false,
    isHideStats = false,
    isRotate = false,
    rotateTime = 3,
  } = style;

  return (
    <div>
      <FormItem label="关闭控制器">
        {getFieldDecorator('closeGUIManager', {
          valuePropName: 'checked',
          initialValue: closeGUIManager,
        })(<Switch />)}
      </FormItem>
      <FormItem label="隐藏控制器">
        {getFieldDecorator('isHideGUI', {
          valuePropName: 'checked',
          initialValue: isHideGUI,
        })(<Switch disabled={closeGUIManager} />)}
      </FormItem>
      <FormItem label="隐藏性能数据">
        {getFieldDecorator('isHideStats', {
          valuePropName: 'checked',
          initialValue: isHideStats,
        })(<Switch disabled={closeGUIManager} />)}
      </FormItem>

      <FormItem label="是否自动旋转">
        {getFieldDecorator('isRotate', {
          valuePropName: 'checked',
          initialValue: isRotate || false,
        })(<Switch />)}
      </FormItem>
      {isRotate && (
        <FormItem label="间隔时间">
          {getFieldDecorator('rotateTime', {
            initialValue: rotateTime || 3,
          })(<InputNumber />)}
        </FormItem>
      )}
      {/* <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <FormItem label="阶数">
            {getFieldDecorator('step', {
              initialValue: style?.step || 12,
            })(<Slider step={0.1} min={0} max={40} />)}
          </FormItem>
          <FormItem label="指数">
            {getFieldDecorator('exp', {
              initialValue: style?.exp || 0.8,
            })(<Slider step={0.1} min={0} max={4} />)}
          </FormItem>
          <FormItem label="速度">
            {getFieldDecorator('stepSpeed', {
              initialValue: style?.stepSpeed || 0.8,
            })(<Slider step={0.1} min={0} max={5} />)}
          </FormItem>
          <FormItem label="偏移">
            {getFieldDecorator('hisOffset', {
              initialValue: style?.hisOffset || 0.8,
            })(<Slider step={0.01} min={0} max={1} />)}
          </FormItem>
          <FormItem label="长度">
            {getFieldDecorator('hisLength', {
              initialValue: style?.hisLength || 0.8,
            })(<Slider step={0.01} min={0} max={1} />)}
          </FormItem>
        </Panel>
      </Collapse> */}
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
})(Building20PPSConfig);

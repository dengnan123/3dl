import React, { useEffect } from 'react';
import { Form, Switch, Collapse, Slider } from 'antd';
import { debounce } from 'lodash';
const FormItem = Form.Item;
const { Panel } = Collapse;
function MultiplyPointsFloorFadePPSConfig(props) {
  const {
    form: { getFieldDecorator, resetFields, setFieldsValue },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  // const handleStepSpeedChange = v => {
  //   setFieldsValue({ stepSpeed: v });
  // };

  const { isShowGUI = true, isShowStats = true } = style;

  return (
    <div id="GUIManager">
      <FormItem label="显示控制器">
        {getFieldDecorator('isShowGUI', {
          valuePropName: 'checked',
          initialValue: isShowGUI,
        })(<Switch />)}
      </FormItem>
      <FormItem label="显示性能数据">
        {getFieldDecorator('isShowStats', {
          valuePropName: 'checked',
          initialValue: isShowStats,
        })(<Switch />)}
      </FormItem>
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
            })(<Slider onChange={handleStepSpeedChange} step={0.1} min={0} max={5} />)}
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
  }, 10),
})(MultiplyPointsFloorFadePPSConfig);

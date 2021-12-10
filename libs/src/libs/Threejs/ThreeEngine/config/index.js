import React, { useEffect, useState } from 'react';
import { Form, Switch, Collapse, Select, Modal, Button, InputNumber, Input } from 'antd';
import { debounce } from 'lodash';
const FormItem = Form.Item;
const { Panel } = Collapse;

function ThreejsConfig(props) {
  const {
    form: { getFieldDecorator, resetFields, setFieldsValue },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  const {
    closeGUIManager = false,
    isHideGUI = false,
    isHideStats = false,
    PPScongfigs = {},
    remoteResourcesURL = 'https://3dl.dfocus.top/api/static/',
  } = style;




  return (
    <div>
      <Collapse defaultActiveKey={['控制器']}>
        <Panel header="控制器" key="控制器">
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
        </Panel>
      </Collapse>

      <FormItem label="资源外链根地址">
        {getFieldDecorator('remoteResourcesURL', {
          initialValue: remoteResourcesURL,
        })(<Input />)}
      </FormItem>

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
    // console.log('newFields: ', newFields);

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(ThreejsConfig);

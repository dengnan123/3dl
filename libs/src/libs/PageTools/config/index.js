import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Switch } from 'antd';

import styles from './index.less';

const PageToolsConfig = props => {
  const {
    style = {},
    form: { getFieldDecorator, resetFields },
  } = props;

  const {
    isMoveEvents = true,
    diff = 200,
    isTimesEvents = false,
    // startHours = 9,
    // endHours = 19,
  } = style;

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  return (
    <div className={styles.formContent}>
      <Form.Item label="开启移动事件">
        {getFieldDecorator('isMoveEvents', {
          valuePropName: 'checked',
          initialValue: isMoveEvents,
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="移动距离">
        {getFieldDecorator('diff', {
          initialValue: diff,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="开启时间控制">
        {getFieldDecorator('isTimesEvents', {
          valuePropName: 'checked',
          initialValue: isTimesEvents,
        })(<Switch />)}
      </Form.Item>
      {/* 
      <Form.Item label="开始时间(小时)">
        {getFieldDecorator('startHours', {
          initialValue: startHours,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="结束时间(小时)">
        {getFieldDecorator('endHours', {
          initialValue: endHours,
        })(<InputNumber min={0} />)}
      </Form.Item> */}

      {/* <div className={styles.tipsContent}>
        <p>移动事件：</p>
        <p className={styles.useTips}>
          开启移动事件并设定鼠标/手势的移动距离， 则可以在移动距离后，触发onChange事件。
          <br />
          参数为：
          <br />
          {`{ dataValues: { moveEnd: true } }`}
        </p>
        <p>时间控制：</p>
        <p className={styles.useTips}>
          开始、结束(24小时制，且为整数) <br />
          在该时间内: {`{isBetween: true}`} <br />
          不在: {`{isBetween: false}`}。
        </p>
      </div> */}
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(PageToolsConfig);

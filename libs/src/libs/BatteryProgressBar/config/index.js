import React, { Component } from 'react';
import { Form, Collapse, InputNumber, Switch, Input } from 'antd';
import InputColor from '../../../components/InputColor';
import { debounce } from 'lodash';
const { Panel } = Collapse;
class BatteryProgressConfig extends Component {
  render() {
    const {
      style,
      form: { getFieldDecorator },
    } = this.props;
    const {
      nums = 5,
      cellRadius = 6,
      cellGab = 4,
      strokeColor = '#31C58D',
      strokeWidth = '18px',
      showInfo = false,
      trailColor = '#9B9B9B',
      textColor = '#31C58D',
      textSize = 16,
    } = style;

    return (
      <div>
        <Collapse>
          <Panel header="电池格配置">
            <Form.Item label="格子数量">
              {getFieldDecorator('nums', {
                initialValue: nums,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="格子圆角">
              {getFieldDecorator('cellRadius', {
                initialValue: cellRadius,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="格子间隙">
              {getFieldDecorator('cellGab', {
                initialValue: cellGab,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>

          <Panel header="进度颜色">
            <Form.Item>
              {getFieldDecorator('strokeColor', {
                initialValue: strokeColor,
              })(<InputColor />)}
            </Form.Item>
          </Panel>

          <Panel header="进度条宽度">
            <Form.Item>
              {getFieldDecorator('strokeWidth', {
                initialValue: strokeWidth,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>

          <Panel header="未完成进度颜色">
            <Form.Item>
              {getFieldDecorator('trailColor', {
                initialValue: trailColor,
              })(<InputColor />)}
            </Form.Item>
          </Panel>

          <Panel header="字符配置">
            <Form.Item label="是否显示进度">
              {getFieldDecorator('showInfo', {
                initialValue: showInfo,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>

            <Form.Item label="字符颜色">
              {getFieldDecorator('textColor', {
                initialValue: textColor,
              })(<InputColor disabled={!style?.showInfo} />)}
            </Form.Item>

            <Form.Item label="字符大小">
              {getFieldDecorator('textSize', {
                initialValue: textSize,
              })(<InputNumber disabled={!style?.showInfo} />)}
            </Form.Item>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

BatteryProgressConfig.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
    const {
      style,
      form: { getFieldsValue },
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(BatteryProgressConfig);

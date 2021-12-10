import React, { Component } from 'react';
import Form from 'antd/lib/form';
import { reap } from '../../../../components/SafeReaper';
import { debounce } from 'lodash';
import InputNumber from 'antd/lib/input-number';
import Switch from 'antd/es/switch';
import InputColor from '../../../../components/InputColor';
import RadioGroup from '../../../../components/RadioGroup';
import { coreObject } from '../enum';
import { Collapse } from 'antd';

const { Panel } = Collapse;

class CoreNumberConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CustomizeCard: false,
    };
  }

  // _update = () => {
  //   const {
  //     form: { getFieldsValue },
  //     updateStyle,
  //     style,
  //   } = this.props;
  //   let newFields = getFieldsValue();
  //   // console.log('newFieldsnewFields', newFields);
  //   updateStyle({
  //     ...style,
  //     ...newFields,
  //   });
  // };

  // handleCustomizeCard = () => {
  //   console.log('handleCustomizeCard');
  //   this.setState({ CustomizeCard: !this.state.CustomizeCard });
  //   this._update();
  // };

  render() {
    const { CustomizeCard } = this.state;
    const {
      style,
      updateStyle,
      formItemLayout,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Collapse>
          <Panel header="每行显示个数">
            <Form.Item label="每行显示个数" {...formItemLayout} la>
              {getFieldDecorator('RowNumber', {
                initialValue: reap(style, 'RowNumber', 0),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="卡片间距">
            <Form.Item label="卡片间距" {...formItemLayout}>
              {getFieldDecorator('spacing', {
                initialValue: reap(style, 'spacing', 10),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="卡片间距">
            <Form.Item label="卡片间距" {...formItemLayout}>
              {getFieldDecorator('borderRadius', {
                initialValue: reap(style, 'borderRadius', 10),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="指标数值字体大小">
            <Form.Item label="指标数值字体大小" {...formItemLayout}>
              {getFieldDecorator('fontSizeValue', {
                initialValue: reap(style, 'fontSizeValue', 20),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="指标名称字体大小">
            <Form.Item label="指标名称字体大小" {...formItemLayout}>
              {getFieldDecorator('fontSizeName', {
                initialValue: reap(style, 'fontSizeName', 15),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="变化率字体大小">
            <Form.Item label="变化率字体大小" {...formItemLayout}>
              {getFieldDecorator('fontSizeIndex', {
                initialValue: reap(style, 'fontSizeIndex', 15),
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="背景渐变">
            <Form.Item label="背景渐变" {...formItemLayout}>
              {getFieldDecorator('backgroundGradual', {
                initialValue: reap(style, 'backgroundGradual', true),
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          </Panel>
          <Panel header="渐变生效对象">
            <Form.Item label="渐变生效对象" {...formItemLayout}>
              {getFieldDecorator('gradualChangeObject', {
                initialValue: reap(style, 'gradualChangeObject', 'backround'),
              })(<RadioGroup RadioArray={coreObject} style={style} updateStyle={updateStyle} />)}
            </Form.Item>
          </Panel>
          <Panel header="渐变前置颜色">
            <Form.Item label="渐变前置颜色" {...formItemLayout}>
              {getFieldDecorator('gradualChangeFirst', {
                initialValue: reap(style, 'gradualChangeFirst', ''),
              })(<InputColor />)}
            </Form.Item>
          </Panel>
          <Panel header="渐变后置颜色">
            <Form.Item label="渐变后置颜色" {...formItemLayout}>
              {getFieldDecorator('gradualChangeLast', {
                initialValue: reap(style, 'gradualChangeLast', ''),
              })(<InputColor />)}
            </Form.Item>
          </Panel>
          <Panel header="开启卡片自定义">
            <Form.Item label="开启卡片自定义" {...formItemLayout}>
              {getFieldDecorator('customizeCard', {
                initialValue: reap(style, 'customizeCard', false),
              })(<Switch />)}
            </Form.Item>
          </Panel>
          <Panel header="自定义card">
            {CustomizeCard && (
              <div>
                <span>开发中</span>
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

CoreNumberConfig.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
    const {
      style,
      form: { getFieldsValue },
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // const _style = filterObj(style, ['', undefined, null]);
    updateStyle({
      ...style,
      ...newFields,
    });
  }),
})(CoreNumberConfig);

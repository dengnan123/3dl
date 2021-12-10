import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Select, Collapse, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const FormItem = Form.Item;

function NumberScrollConfig(props) {
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

  return (
    <div>
      <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <FormItem label="边框宽">
            {getFieldDecorator('borderWidth', {
              initialValue: style?.borderWidth || 0,
            })(<InputNumber />)}
          </FormItem>

          <FormItem label="边框颜色">
            {getFieldDecorator('borderColor', {
              initialValue: style?.borderColor || 'rgba(16,105,108,1)',
            })(<InputColor />)}
          </FormItem>
          <FormItem label="边框圆角">
            {getFieldDecorator('borderRadius', {
              initialValue: style?.borderRadius || 0,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="布局方式">
            {getFieldDecorator('flexDirection', {
              initialValue: style?.flexDirection || 'column',
            })(
              <Select style={{ width: '110px' }}>
                <Select.Option value="row">左右</Select.Option>
                <Select.Option value="column">上下</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Panel>
        <Panel header="标签配置" key="标签配置">
          <FormItem label="开启标签">
            {getFieldDecorator('enableLabel', {
              valuePropName: 'checked',
              initialValue: style?.enableLabel || false,
            })(<Switch />)}
          </FormItem>
          <FormItem label="标签文本">
            {getFieldDecorator('labelText', {
              initialValue: style?.labelText || '今日到岗',
            })(<Input />)}
          </FormItem>
          <FormItem label="标签字体大小">
            {getFieldDecorator('labelFontSize', {
              initialValue: style?.labelFontSize || 28,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="标签内边距大小">
            {getFieldDecorator('labelPadding', {
              initialValue: style?.labelPadding || 0,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="标签字体颜色">
            {getFieldDecorator('labelColor', {
              initialValue: style?.labelColor || 'rgba(255,255,255,1)',
            })(<InputColor />)}
          </FormItem>
          <FormItem label="标签背景颜色">
            {getFieldDecorator('labelBackgroundColor', {
              initialValue: style?.labelBackgroundColor || 'rgba(13,71,80,1)',
            })(<InputColor />)}
          </FormItem>
          <FormItem label="标签对齐方式">
            {getFieldDecorator('labelTextAlign', {
              initialValue: style?.labelTextAlign || 'center',
            })(
              <Select style={{ width: '110px' }}>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Panel>
        <Panel header="数字配置" key="数字配置">
          <FormItem label="数字大小">
            {getFieldDecorator('numFontSize', {
              initialValue: style?.numFontSize || 48,
            })(<InputNumber />)}
          </FormItem>
          <Form.Item label="数字颜色">
            {getFieldDecorator('numColor', {
              initialValue: style?.numColor || 'rgba(249,155,12,1)',
            })(<InputColor />)}
          </Form.Item>
          <FormItem label="数字对齐方式">
            {getFieldDecorator('numAlign', {
              initialValue: style?.numAlign || 'center',
            })(
              <Select style={{ width: '110px' }}>
                <Select.Option value="flex-start">左对齐</Select.Option>
                <Select.Option value="flex-end">右对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="space-evenly">均分</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="背景颜色">
            {getFieldDecorator('numBg', {
              initialValue: style?.numBg || 'rgba(13,51,63,1)',
            })(<InputColor />)}
          </FormItem>
          <FormItem label="数字区内边距大小">
            {getFieldDecorator('numPadding', {
              initialValue: style?.numPadding || 0,
            })(<InputNumber />)}
          </FormItem>
        </Panel>

        <Panel header="滚动效果" key="滚动效果">
          <FormItem label="开启动画">
            {getFieldDecorator('playScroll', {
              valuePropName: 'checked',
              initialValue: style?.playScroll || false,
            })(<Switch />)}
          </FormItem>
          <FormItem label="自动滚动">
            {getFieldDecorator('autoRolling', {
              valuePropName: 'checked',
              initialValue: style?.autoRolling || false,
            })(<Switch />)}
          </FormItem>
          <FormItem label="间隔">
            {getFieldDecorator('interval', {
              initialValue: style?.interval || 5000,
            })(<InputNumber disabled={!style?.autoRolling} />)}
          </FormItem>
          <FormItem label="动画效果">
            {getFieldDecorator('animateType', {
              initialValue: style?.animateType || 'flipInX',
            })(
              <Select style={{ width: '110px' }}>
                <Select.Option value="flipInX">翻转</Select.Option>
                <Select.Option value="flash">闪烁</Select.Option>
                <Select.Option value="zoomInDown">空降</Select.Option>
                <Select.Option value="bounceInDown">弹入</Select.Option>
                <Select.Option value="gambling">老虎机</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="动画速度">
            {getFieldDecorator('speed', {
              initialValue: style?.speed || 'default',
            })(
              style?.animateType !== 'gambling' ? (
                <Select style={{ width: '110px' }}>
                  <Select.Option value="faster">500ms</Select.Option>
                  <Select.Option value="fast">800ms</Select.Option>
                  <Select.Option value="slower">3s</Select.Option>
                  <Select.Option value="slow">2s</Select.Option>
                  <Select.Option value="default">1s</Select.Option>
                </Select>
              ) : (
                <Select style={{ width: '110px' }}>
                  <Select.Option value="default">默认</Select.Option>
                  <Select.Option value="faster">稍快</Select.Option>
                  <Select.Option value="slower">稍慢</Select.Option>
                </Select>
              ),
            )}
          </FormItem>
          <FormItem label="动画延迟">
            {getFieldDecorator('delay', {
              initialValue: style?.delay || '0',
            })(
              <Select style={{ width: '110px' }} disabled={style?.animateType == 'gambling'}>
                <Select.Option value="0">0s</Select.Option>
                <Select.Option value="1">1s</Select.Option>
                <Select.Option value="2">2s</Select.Option>
              </Select>,
            )}
          </FormItem>
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
})(NumberScrollConfig);

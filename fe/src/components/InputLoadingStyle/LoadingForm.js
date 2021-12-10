import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Select, Collapse, Switch } from 'antd';
import InputColor from '@/components/InputColor';

import './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

function LoadingForm(props) {
  const {
    form: { getFieldDecorator },
    value,
  } = props;
  console.log('value', value);
  const loadingStyle = value?.loadingStyle;

  const showArrow = false;

  return (
    <>
      <Collapse activeKey={['1', '2', '3', '4']}>
        <Collapse.Panel header="基础配置" key="1" showArrow={showArrow}>
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: value?.name,
              rules: [{ required: true, message: '请填写名称' }],
            })(<Input placeholder="请填写名称" />)}
          </FormItem>

          <FormItem label="背景颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.basic.backgroundColor', {
              initialValue: loadingStyle?.basic?.backgroundColor ?? 'rgba(255,255,255,1)',
            })(<InputColor placeholder="请选择背景色" />)}
          </FormItem>

          <FormItem label="容器宽度" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.container.width', {
              initialValue: loadingStyle?.container?.width ?? 120,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请输入宽度" min={0} step={1} />)}
          </FormItem>

          <FormItem label="容器高度" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.container.height', {
              initialValue: loadingStyle?.container?.height ?? 180,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请输入高度" min={0} step={1} />)}
          </FormItem>
        </Collapse.Panel>

        <Collapse.Panel header="loading图形配置" key="2" showArrow={showArrow}>
          <FormItem label="宽度" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.width', {
              initialValue: loadingStyle?.loadingGraph?.width ?? 120,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请输入宽度" min={0} step={1} />)}
          </FormItem>

          <FormItem label="高度" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.height', {
              initialValue: loadingStyle?.loadingGraph?.height ?? 120,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请输入高度" min={0} step={1} />)}
          </FormItem>

          <FormItem label="圆角尺寸" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderRadius', {
              initialValue: loadingStyle?.loadingGraph?.borderRadius ?? 120,
            })(<InputNumber placeholder="请输入图形圆角尺寸" min={0} step={1} />)}
          </FormItem>

          <FormItem label="边框粗细" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderWidth', {
              initialValue: loadingStyle?.loadingGraph?.borderWidth ?? 2,
            })(<InputNumber placeholder="请输入图形边框粗细" min={0} step={1} />)}
          </FormItem>

          <FormItem label="上边框颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderTopColor', {
              initialValue: loadingStyle?.loadingGraph?.borderTopColor ?? 'rgba(241, 143, 91, 0)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="右边框颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderRightColor', {
              initialValue: loadingStyle?.loadingGraph?.borderRightColor ?? 'rgba(241, 143, 91, 1)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="下边框颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderBottomColor', {
              initialValue:
                loadingStyle?.loadingGraph?.borderBottomColor ?? 'rgba(241, 143, 91, 0)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="左边框颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.borderLeftColor', {
              initialValue: loadingStyle?.loadingGraph?.borderLeftColor ?? 'rgba(241, 143, 91, 1)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="旋转方向" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingGraph.animationDirection', {
              initialValue: loadingStyle?.loadingGraph?.animationDirection ?? 'initial',
            })(
              <Select placeholder="请选择旋转方向">
                <Select.Option value="initial">顺时针</Select.Option>
                <Select.Option value="reverse">逆时针</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Collapse.Panel>

        <Collapse.Panel header="loading文字配置" key="3" showArrow={showArrow}>
          <FormItem label="显示" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingText.show', {
              initialValue: loadingStyle?.loadingText?.show ?? true,
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
          <FormItem label="文字内容" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingText.text', {
              initialValue: loadingStyle?.loadingText?.text ?? 'LOADING...',
            })(<Input placeholder="请填写文字内容" />)}
          </FormItem>

          <FormItem label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingText.color', {
              initialValue: loadingStyle?.loadingText?.color ?? 'rgba(241, 143, 91, 1)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="字体大小" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingText.fontSize', {
              initialValue: loadingStyle?.loadingText?.fontSize ?? 14,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请填写字体大小" min={12} step={1} />)}
          </FormItem>

          <FormItem label="字体粗细" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.loadingText.fontWeight', {
              initialValue: loadingStyle?.loadingText?.fontWeight ?? 700,
            })(
              <Select placeholder="请选择字体粗细">
                {Array(9)
                  .fill(0)
                  .map((n, i) => {
                    const w = (i + 1) * 100;
                    return (
                      <Select.Option key={w} value={w}>
                        {w}
                      </Select.Option>
                    );
                  })}
              </Select>,
            )}
          </FormItem>
        </Collapse.Panel>

        <Collapse.Panel header="底部文字配置" key="4" showArrow={showArrow}>
          <FormItem label="显示" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.show', {
              initialValue: loadingStyle?.desc?.show ?? true,
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
          <FormItem label="文字内容" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.text', {
              initialValue: loadingStyle?.desc?.text ?? 'DFOCUS 3DL',
            })(<Input placeholder="请填写底部文字描述" />)}
          </FormItem>

          <FormItem label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.color', {
              initialValue: loadingStyle?.desc?.color ?? 'rgba(241, 143, 91, 1)',
            })(<InputColor placeholder="请选择颜色" />)}
          </FormItem>

          <FormItem label="字体大小" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.fontSize', {
              initialValue: loadingStyle?.desc?.fontSize ?? 14,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请填写字体大小" min={12} step={1} />)}
          </FormItem>

          <FormItem label="字体粗细" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.fontWeight', {
              initialValue: loadingStyle?.desc?.fontWeight ?? 700,
            })(
              <Select placeholder="请选择字体粗细">
                {Array(9)
                  .fill(0)
                  .map((n, i) => {
                    const w = (i + 1) * 100;
                    return (
                      <Select.Option key={w} value={w}>
                        {w}
                      </Select.Option>
                    );
                  })}
              </Select>,
            )}
          </FormItem>

          <FormItem label="上边距" {...formItemLayout}>
            {getFieldDecorator('loadingStyle.desc.marginTop', {
              initialValue: loadingStyle?.desc?.marginTop ?? 20,
              rules: [{ type: 'integer', message: '请输入整数' }],
            })(<InputNumber placeholder="请填写上边距" step={1} />)}
          </FormItem>
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

LoadingForm.propTypes = {
  form: PropTypes.object,
  value: PropTypes.object,
};

export default LoadingForm;

import React, { Component } from 'react';

import { debounce } from 'lodash';
import { reap } from '../../../../components/SafeReaper';

import { Form, InputNumber, Switch, Select } from 'antd';
import InputColor from '../../../../components/InputColor';

class BasalTable extends Component {
  render() {
    const {
      style,
      formItemLayout,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Form.Item label="文字对齐方式" {...formItemLayout}>
          {getFieldDecorator('textAlign', {
            initialValue: reap(style, 'textAlign', 'left'),
          })(
            <Select>
              <Select.Option value="left">左对齐</Select.Option>
              <Select.Option value="center">居中</Select.Option>
              <Select.Option value="right">右对齐</Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="是否显示表格标题" {...formItemLayout}>
          {getFieldDecorator('showTableHead', {
            initialValue: reap(style, 'showTableHead', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {reap(style, 'showTableHead', true) && (
          <>
            <Form.Item label="表格标题高度" {...formItemLayout}>
              {getFieldDecorator('theadHeight', {
                initialValue: reap(style, 'theadHeight', 60),
              })(<InputNumber min={0} />)}
            </Form.Item>

            <Form.Item label="表格标题字体颜色" {...formItemLayout}>
              {getFieldDecorator('theadColor', {
                initialValue: reap(style, 'theadColor', ''),
              })(<InputColor />)}
            </Form.Item>

            <Form.Item label="表格标题字体大小" {...formItemLayout}>
              {getFieldDecorator('theadFontSize', {
                initialValue: reap(style, 'theadFontSize', 14),
              })(<InputNumber min={12} max={100} style={{ width: '100%' }} />)}
            </Form.Item>

            <Form.Item label="表格标题字体粗细" {...formItemLayout}>
              {getFieldDecorator('theadFontWeight', {
                initialValue: reap(style, 'theadFontWeight', 400),
              })(<InputNumber min={100} step={100} />)}
            </Form.Item>

            <Form.Item label="表格标题背景颜色" {...formItemLayout}>
              {getFieldDecorator('theadBgColor', {
                initialValue: reap(style, 'theadBgColor', ''),
              })(<InputColor />)}
            </Form.Item>
          </>
        )}

        <Form.Item label="行间距" {...formItemLayout}>
          {getFieldDecorator('marginBottom', {
            initialValue: reap(style, 'marginBottom', 0),
          })(<InputNumber min={0} />)}
        </Form.Item>

        <Form.Item label="表格内容字体大小" {...formItemLayout}>
          {getFieldDecorator('tbodyFontSize', {
            initialValue: reap(style, 'tbodyFontSize', 13),
          })(<InputNumber min={12} max={100} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="表格内容字体颜色" {...formItemLayout}>
          {getFieldDecorator('thbodyColor', {
            initialValue: reap(style, 'thbodyColor', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="表格内容双行字体颜色" {...formItemLayout}>
          {getFieldDecorator('evenThbodyColor', {
            initialValue: reap(style, 'evenThbodyColor', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="表格内容高亮字体颜色" {...formItemLayout}>
          {getFieldDecorator('thbodyHighlightColor', {
            initialValue: reap(style, 'thbodyHighlightColor', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="表格单行背景色" {...formItemLayout}>
          {getFieldDecorator('odd', {
            initialValue: reap(style, 'odd', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="表格双行背景色" {...formItemLayout}>
          {getFieldDecorator('even', {
            initialValue: reap(style, 'even', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="表格列高亮背景色" {...formItemLayout}>
          {getFieldDecorator('colHighlightColor', {
            initialValue: reap(style, 'colHighlightColor', ''),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="自定义行高(px)[需加上行间距高度]" {...formItemLayout}>
          {getFieldDecorator('isCustomRowHeight', {
            initialValue: reap(style, 'isCustomRowHeight', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {reap(style, 'isCustomRowHeight', false) && (
          <Form.Item label="自定义行高(px)" {...formItemLayout}>
            {getFieldDecorator('rowHeight', {
              initialValue: reap(style, 'rowHeight', 40),
            })(<InputNumber min={0} />)}
          </Form.Item>
        )}
        <Form.Item label="显示滚动条" {...formItemLayout}>
          {getFieldDecorator('isShowScrollbar', {
            initialValue: reap(style, 'isShowScrollbar', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
        {reap(style, 'isShowScrollbar', false) && (
          <Form.Item label="滚动条宽度" {...formItemLayout}>
            {getFieldDecorator('scrollbarWidth', {
              initialValue: reap(style, 'scrollbarWidth', 3),
            })(<InputNumber min={1} />)}
          </Form.Item>
        )}
        {reap(style, 'isShowScrollbar', false) && (
          <Form.Item label="滚动条颜色" {...formItemLayout}>
            {getFieldDecorator('scrollbarThumbBg', {
              initialValue: reap(style, 'scrollbarThumbBg', ''),
            })(<InputColor />)}
          </Form.Item>
        )}
        {reap(style, 'isShowScrollbar', false) && (
          <Form.Item label="滚动条背景颜色" {...formItemLayout}>
            {getFieldDecorator('scrollbarTrackBg', {
              initialValue: reap(style, 'scrollbarTrackBg', ''),
            })(<InputColor />)}
          </Form.Item>
        )}
      </div>
    );
  }
}

BasalTable.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  }),
})(BasalTable);

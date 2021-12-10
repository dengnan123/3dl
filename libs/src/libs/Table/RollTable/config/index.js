import React, { Component } from 'react';

import { Form, InputNumber } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import InputColor from '../../../../components/InputColor';
import BorderStyle from '../../../../components/BorderStyle';

class RollTableDeploy extends Component {
  _updata = () => {
    const {
      updateStyle,
      style,
      form: { getFieldsValue },
    } = this.props;
    let newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
    });
  };

  render() {
    const {
      style,
      updateStyle,
      formItemLayout,
      form: { getFieldDecorator },
    } = this.props;

    const boxOverflow = {
      overflowX: 'hidden',
      height: 500,
    };

    return (
      <div style={{ ...boxOverflow }}>
        {/* <Form.Item label="图表名称" {...formItemLayout}>
          {getFieldDecorator('tableName', {
            initialValue: reap(style, 'tableName', ''),
          })(<Input />)}
        </Form.Item> */}

        {/* <Form.Item label="图表简介" {...formItemLayout}>
          {getFieldDecorator('tableIntroduction', {
            initialValue: reap(style, 'tableIntroduction', ''),
          })(<Input />)}
        </Form.Item> */}

        {/* <Form.Item label="宽度" {...formItemLayout}>
          {getFieldDecorator('tableWidth', {
            initialValue: reap(style, 'tableWidth', 300),
          })(<Input onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="高度" {...formItemLayout}>
          {getFieldDecorator('tableHeight', {
            initialValue: reap(style, 'tableHeight', 300),
          })(<Input />)}
        </Form.Item> */}

        <Form.Item label="表格标题字体大小" {...formItemLayout}>
          {getFieldDecorator('theadFontSize', {
            initialValue: reap(style, 'theadFontSize', 15),
          })(<InputNumber onBlur={this._updata} min={12} max={100} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="表格内容字体大小" {...formItemLayout}>
          {getFieldDecorator('tbodyFontSize', {
            initialValue: reap(style, 'tbodyFontSize', 13),
          })(<InputNumber onBlur={this._updata} min={12} max={100} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="表格标题字体颜色" {...formItemLayout}>
          {getFieldDecorator('theadColor', {
            initialValue: reap(style, 'theadColor', ''),
          })(<InputColor color={style.theadColor} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格内容字体颜色" {...formItemLayout}>
          {getFieldDecorator('thbodyColor', {
            initialValue: reap(style, 'thbodyColor', ''),
          })(<InputColor color={style.thbodyColor} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格标题背景颜色" {...formItemLayout}>
          {getFieldDecorator('theadBgColor', {
            initialValue: reap(style, 'theadBgColor', ''),
          })(<InputColor color={style.theadBgColor} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格单行背景色" {...formItemLayout}>
          {getFieldDecorator('odd', {
            initialValue: reap(style, 'odd', ''),
          })(<InputColor color={style.odd} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格双行背景色" {...formItemLayout}>
          {getFieldDecorator('event', {
            initialValue: reap(style, 'event', ''),
          })(<InputColor color={style.event} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格边框宽度" {...formItemLayout}>
          {getFieldDecorator('borderWidth', {
            initialValue: reap(style, 'borderWidth', ''),
          })(<InputNumber onBlur={this._updata} min={0} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="表格边框角度" {...formItemLayout}>
          {getFieldDecorator('borderRadius', {
            initialValue: reap(style, 'borderRadius', ''),
          })(<InputNumber onBlur={this._updata} min={0} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="表格边框颜色" {...formItemLayout}>
          {getFieldDecorator('borderColor', {
            initialValue: reap(style, 'borderColor', ''),
          })(<InputColor color={style.borderColor} onChange={this._updata} />)}
        </Form.Item>

        <Form.Item label="表格边框颜色" {...formItemLayout}>
          {getFieldDecorator('borderStyle', {
            initialValue: reap(style, 'borderStyle', ''),
          })(<BorderStyle updateStyle={updateStyle} style={style} />)}
        </Form.Item>
      </div>
    );
  }
}

RollTableDeploy.propTypes = {};

export default Form.create()(RollTableDeploy);

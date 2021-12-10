import React, { Component } from 'react';
import { Form, Collapse, InputNumber, Switch, Input } from 'antd';
import InputColor from '../../../../components/InputColor';
import { debounce } from 'lodash';
const { Panel } = Collapse;

class LineProgressConfig extends Component {
  // _updata = () => {
  //   const {
  //     updateStyle,
  //     style,
  //     form: { getFieldsValue },
  //   } = this.props;
  //   let newFields = getFieldsValue();
  //   console.log('LineProgressConfig -> _updata -> newFields', newFields);

  //   updateStyle({
  //     ...style,
  //     ...newFields,
  //   });
  // };

  // changeSwitch = () => {
  //   const { style } = this.props;
  //   const { GloStrokeColor } = this.state;
  //   this.setState({ GloStrokeColor: !this.state.GloStrokeColor });
  //   this._updata({
  //     // ...style,
  //     // GloStrokeColor,
  //   });
  // };

  render() {
    const {
      style,
      form: { getFieldDecorator },
    } = this.props;
    const {
      // width,
      strokeColor,
      GloStrokeColor,
      StrokeColorForm,
      StrokeColorTo,
      strokeWidth,
      showInfo,
      trailColor,
      textColor,
      format,
    } = style;

    return (
      <div>
        <Collapse>
          <Panel header="进度颜色">
            <Form.Item>
              {getFieldDecorator('strokeColor', {
                initialValue: strokeColor,
              })(<InputColor />)}
            </Form.Item>
          </Panel>

          <Panel header="是否启用渐变色">
            <Form.Item>
              {getFieldDecorator('GloStrokeColor', {
                initialValue: GloStrokeColor,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          </Panel>

          {GloStrokeColor && (
            <Panel header="渐变色">
              <Form.Item label="前置色">
                {getFieldDecorator('StrokeColorForm', {
                  initialValue: StrokeColorForm,
                })(<InputColor />)}
              </Form.Item>
              <Form.Item label="后置色">
                {getFieldDecorator('StrokeColorTo', {
                  initialValue: StrokeColorTo,
                })(<InputColor />)}
              </Form.Item>
            </Panel>
          )}

          <Panel header="进度条宽度">
            <Form.Item>
              {getFieldDecorator('strokeWidth', {
                initialValue: strokeWidth,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>
          <Panel header="是否显示进度">
            <Form.Item>
              {getFieldDecorator('showInfo', {
                initialValue: showInfo,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          </Panel>
          <Panel header="未完成进度颜色">
            <Form.Item>
              {getFieldDecorator('trailColor', {
                initialValue: trailColor,
              })(<InputColor />)}
            </Form.Item>
          </Panel>
          <Panel header="字符颜色">
            <Form.Item>
              {getFieldDecorator('textColor', {
                initialValue: textColor,
              })(<InputColor />)}
            </Form.Item>
          </Panel>

          <Panel header="进度字符">
            <Form.Item>
              {getFieldDecorator('format', {
                initialValue: format,
              })(<Input />)}
            </Form.Item>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

LineProgressConfig.propTypes = {};

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
})(LineProgressConfig);

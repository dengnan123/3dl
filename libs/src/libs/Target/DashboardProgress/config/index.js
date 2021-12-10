import React, { Component } from 'react';
import { debounce } from 'lodash';
import { Form, Collapse, InputNumber, Input, Radio } from 'antd';
import InputColor from '../../../../components/InputColor';
// import RadioGroup from '../../../../components/RadioGroup';
const { Panel } = Collapse;

class DashboardProgressConfig extends Component {
  render() {
    const {
      style,
      // updateStyle,
      form: { getFieldDecorator },
    } = this.props;
    const {
      strokeColor,
      GloStrokeColor,
      strokeWidth,
      trailColor,
      textColor,
      format,
      gapDegree,
      gapPosition = 'bottom',
    } = style;

    const TAL = {
      width: '100%',
      paddingTop: '10px',
      textAlign: 'left',
    };

    return (
      <div>
        <Collapse>
          {/* <Panel header="宽度">
            <Form.Item>
              {getFieldDecorator('width', {
                initialValue: width,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel> */}

          <Panel header="进度颜色">
            <Form.Item>
              {getFieldDecorator('strokeColor', {
                initialValue: strokeColor,
              })(<InputColor disabled={GloStrokeColor} />)}
            </Form.Item>
          </Panel>

          <Panel header="进度条宽度">
            <Form.Item>
              {getFieldDecorator('strokeWidth', {
                initialValue: strokeWidth,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>

          <Panel header="仪表盘进度条缺口角度">
            <Form.Item>
              {getFieldDecorator('gapDegree', {
                initialValue: gapDegree,
              })(<InputNumber min={0} max={250} style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>

          <Panel header="仪表盘进度条缺口方位">
            <Form.Item>
              {getFieldDecorator('gapPosition', {
                initialValue: gapPosition,
              })(
                <Radio.Group>
                  <Radio style={TAL} value="top">
                    top
                  </Radio>
                  <Radio style={TAL} value="bottom">
                    bottom
                  </Radio>
                  <Radio style={TAL} value="left">
                    left
                  </Radio>
                  <Radio style={TAL} value="right">
                    right
                  </Radio>
                </Radio.Group>,
              )}
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

DashboardProgressConfig.propTypes = {};

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
})(DashboardProgressConfig);

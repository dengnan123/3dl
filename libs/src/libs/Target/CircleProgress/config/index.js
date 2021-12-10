import React, { Component } from 'react';
import { debounce } from 'lodash';

import { Form, Collapse, InputNumber, Input, Switch, Icon } from 'antd';
import InputColor from '../../../../components/InputColor';
import { Button } from 'antd-mobile';
import styles from './index.less';

const { Panel } = Collapse;
let id = 0;

class CircleProgressConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GloStrokeColor: false,
    };
  }

  handleButtonAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys') || [];
    // newButtonGroup.push({ min: '', max: '', color: '' });
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({ keys: nextKeys });
  };

  handleButtonRemove = curIndex => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys').filter((n, index) => index !== curIndex);
    form.setFieldsValue({ keys: keys });
  };

  render() {
    const { style, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      width,
      strokeColor,
      GloStrokeColor,
      strokeWidth,
      trailColor,
      showInfo = true,
      textColor,
      fontSize,
      format,
      SegmentStatus = false,
      Segment = [],
    } = style;

    getFieldDecorator('keys', { initialValue: Segment || [] });
    const keys = getFieldValue('keys');

    return (
      <div>
        <Collapse>
          <Panel header="宽度">
            <Form.Item>
              {getFieldDecorator('width', {
                initialValue: width,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Panel>

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

          <Panel header="未完成进度颜色">
            <Form.Item>
              {getFieldDecorator('trailColor', {
                initialValue: trailColor,
              })(<InputColor />)}
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
          <Panel header="字符">
            <Form.Item label="颜色">
              {getFieldDecorator('textColor', {
                initialValue: textColor,
              })(<InputColor />)}
            </Form.Item>

            <Form.Item label="字体大小">
              {getFieldDecorator('fontSize', {
                initialValue: fontSize,
              })(<InputNumber min={12} step={1} />)}
            </Form.Item>
          </Panel>

          <Panel header="进度内字符(单位)">
            <Form.Item>
              {getFieldDecorator('format', {
                initialValue: format,
              })(<Input />)}
            </Form.Item>
          </Panel>

          <Panel header="是否开启区间颜色显示">
            <Form.Item>
              {getFieldDecorator('SegmentStatus', {
                initialValue: SegmentStatus,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>

            {SegmentStatus && (
              <>
                <Form.Item label="按钮组" style={{ marginBottom: 0, width: '100%' }} />
                {keys.map((item, index) => {
                  return (
                    <div className={styles.legendItem} key={index}>
                      <Form.Item>
                        {getFieldDecorator(`Segment[${index}].min`, {
                          initialValue: item.label,
                        })(<InputNumber placeholder="区间最小值(包含)" />)}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator(`Segment[${index}].max`, {
                          initialValue: item.labelEn,
                        })(<InputNumber placeholder="区间最大值(不包含)" />)}
                      </Form.Item>

                      <Form.Item>
                        {getFieldDecorator(`Segment[${index}].color`, {
                          initialValue: item.labelEn,
                        })(<InputColor styles={{ width: '100%' }} placeholder="区间颜色" />)}
                      </Form.Item>

                      {keys.length > 1 && (
                        <Icon type="minus-circle" onClick={() => this.handleButtonRemove(index)} />
                      )}
                    </div>
                  );
                })}

                <Form.Item>
                  <Button type="dashed" onClick={this.handleButtonAdd} style={{ width: '60%' }}>
                    <Icon type="plus" />
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

CircleProgressConfig.propTypes = {};

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
})(CircleProgressConfig);

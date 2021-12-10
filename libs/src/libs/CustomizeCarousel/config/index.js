import React from 'react';
import { Form, Switch, InputNumber, Select } from 'antd';
import { debounce } from 'lodash';
// import InputColor from '../../../components/InputColor';
// import { Select } from '../../../components/GlobalSider/icon';

const { Option } = Select;
function CustomizeCarousel(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const {
    dotPosition = 'bottom',
    autoplay = true,
    project = 'jiahui',
    dots = true,
    width,
    height,
    autoplaySpeed = 3,
    effect = 'scrollx',
  } = style || {};

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="加载项目对应的css" {...formItemLayout}>
        {getFieldDecorator('project', {
          initialValue: project,
        })(
          <Select style={{ width: 120 }}>
            <Option value="jiahui">嘉会医院</Option>
            <Option value="jingke">晶科能源</Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="宽" {...formItemLayout}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<InputNumber min={500} />)}
      </Form.Item>

      <Form.Item label="高" {...formItemLayout}>
        {getFieldDecorator('height', {
          initialValue: height,
        })(<InputNumber min={300} />)}
      </Form.Item>

      <Form.Item label="是否自动切换">
        {getFieldDecorator('autoplay', {
          valuePropName: 'checked',
          initialValue: autoplay,
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="轮播间隔时间(单位：秒)" {...formItemLayout}>
        {getFieldDecorator('autoplaySpeed', {
          initialValue: autoplaySpeed ? Number(autoplaySpeed) : 3,
        })(<InputNumber min={1} />)}
      </Form.Item>

      <Form.Item label="面板指示点位置" {...formItemLayout}>
        {getFieldDecorator('dotPosition', {
          initialValue: dotPosition,
        })(
          <Select style={{ width: 120 }}>
            <Option value="bottom">下</Option>
            <Option value="top">上</Option>
            <Option value="left">左</Option>
            <Option value="right">右</Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="动画效果" {...formItemLayout}>
        {getFieldDecorator('effect', {
          initialValue: effect,
        })(
          <Select style={{ width: 120 }}>
            <Option value="scrollx">scrollx</Option>
            <Option value="fade">fade</Option>
          </Select>,
        )}
      </Form.Item>
      {/* <Form.Item label="面板指示点外边距" {...formItemLayout}>
        {getFieldDecorator('margin', {
          initialValue: margin,
        })(<Input placeholder="1px 1px 1px 1px" />)}
      </Form.Item> */}

      <Form.Item label="是否显示面板指示点">
        {getFieldDecorator('dots', {
          valuePropName: 'checked',
          initialValue: dots,
        })(<Switch />)}
      </Form.Item>
    </div>
  );
}

CustomizeCarousel.propTypes = {};

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
})(CustomizeCarousel);

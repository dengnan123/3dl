import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { Form, InputNumber, Select, Input, Switch } from 'antd';
import InputColor from '../../../components/InputColor';

const transitionTimingFunctionList = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'];

const iconPositionList = ['top', 'right', 'bottom', 'left'];

const TranslateContainerConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style = {},
  } = props;

  const {
    translateX = 0,
    duration = 0.3,
    transitionTimingFunction = 'linear',
    delay = 0,
    btnLabel = '显示',
    btnLabelEn = 'Show',
    btnInvertLabel = '隐藏',
    btnInvertLabelEn = 'Hide',
    btnFontSize = 18,
    btnFontColor = '#ffffff',
    btnWidth = 180,
    btnHeight = 60,
    btnBgColor = '#0E97CF',
    btnBorderRadius = 0,
    btnMarginLeft,
    btnMarginTop = 80,
    iconPosition = 'top',
    iconWidth = 22,
    iconHeight = 11,
    iconMarginTop = 0,
    iconMarginRight = 0,
    iconMarginBottom = 0,
    iconMarginLeft = 0,
    customizeIcon = false,
  } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="水平偏移量" {...formItemLayout}>
        {getFieldDecorator('translateX', {
          initialValue: translateX,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="偏移时间" {...formItemLayout}>
        {getFieldDecorator('duration', {
          initialValue: duration,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="偏移方式" {...formItemLayout}>
        {getFieldDecorator('transitionTimingFunction', {
          initialValue: transitionTimingFunction,
        })(
          <Select>
            {transitionTimingFunctionList.map(f => (
              <Select.Option key={f}>{f}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="偏移延迟时间" {...formItemLayout}>
        {getFieldDecorator('delay', {
          initialValue: delay,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="未平移按钮内容(中)" {...formItemLayout}>
        {getFieldDecorator('btnLabel', {
          initialValue: btnLabel,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="未平移按钮内容(英)" {...formItemLayout}>
        {getFieldDecorator('btnLabelEn', {
          initialValue: btnLabelEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="平移后按钮内容(中)" {...formItemLayout}>
        {getFieldDecorator('btnInvertLabel', {
          initialValue: btnInvertLabel,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="平移后按钮内容(英)" {...formItemLayout}>
        {getFieldDecorator('btnInvertLabelEn', {
          initialValue: btnInvertLabelEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="按钮字体大小" {...formItemLayout}>
        {getFieldDecorator('btnFontSize', {
          initialValue: btnFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="按钮字体颜色" {...formItemLayout}>
        {getFieldDecorator('btnFontColor', {
          initialValue: btnFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="按钮宽度" {...formItemLayout}>
        {getFieldDecorator('btnWidth', {
          initialValue: btnWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="按钮高度" {...formItemLayout}>
        {getFieldDecorator('btnHeight', {
          initialValue: btnHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="按钮背景颜色" {...formItemLayout}>
        {getFieldDecorator('btnBgColor', {
          initialValue: btnBgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="按钮圆角" {...formItemLayout}>
        {getFieldDecorator('btnBorderRadius', {
          initialValue: btnBorderRadius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="按钮左边距" {...formItemLayout}>
        {getFieldDecorator('btnMarginLeft', {
          initialValue: btnMarginLeft,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="按钮上边距" {...formItemLayout}>
        {getFieldDecorator('btnMarginTop', {
          initialValue: btnMarginTop,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="图标位置" {...formItemLayout}>
        {getFieldDecorator('iconPosition', {
          initialValue: iconPosition,
        })(
          <Select>
            {iconPositionList.map(n => (
              <Select.Option key={n}>{n}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconWidth', {
          initialValue: iconWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标高度" {...formItemLayout}>
        {getFieldDecorator('iconHeight', {
          initialValue: iconHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标上边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginTop', {
          initialValue: iconMarginTop,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="图标右边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginRight', {
          initialValue: iconMarginRight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="图标下边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginBottom', {
          initialValue: iconMarginBottom,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="图标左边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginLeft', {
          initialValue: iconMarginLeft,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="自定义图标" {...formItemLayout}>
        {getFieldDecorator('customizeIcon', {
          initialValue: customizeIcon,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
    </div>
  );
};

TranslateContainerConfig.propTypes = {
  style: PropTypes.object,
  form: PropTypes.object,
  formItemLayout: PropTypes.object,
  updateStyle: PropTypes.func,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
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
    // 处理数据
  }, 500),
})(TranslateContainerConfig);

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Switch, Input, InputNumber, Button, Icon } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';
import { homeStyleEmnu } from '../styles';

function HomeConfig(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator, setFieldsValue, getFieldValue },
    style,
  } = props;

  const {
    Unfold = homeStyleEmnu['Unfold'],
    showMenuBtn = homeStyleEmnu['showMenuBtn'],
    box = homeStyleEmnu['box'],
    backgroundColor = homeStyleEmnu['backgroundColor'],
    direction = homeStyleEmnu['direction'],
    iconSize = homeStyleEmnu['iconSize'],
    borderRadius = homeStyleEmnu['borderRadius'],
    buttonGroup = homeStyleEmnu['svg'],
  } = style;

  const handleButtonAdd = () => {
    const newButtonGroup = getFieldValue('buttonGroupKeys') || [];
    newButtonGroup.push({ pageId: '', svgStr: '' });
    setFieldsValue({ buttonGroupKeys: newButtonGroup });
  };

  const handleButtonRemove = curIndex => {
    const newButtonGroup = getFieldValue('buttonGroupKeys').filter(
      (n, index) => index !== curIndex,
    );
    setFieldsValue({ buttonGroupKeys: newButtonGroup });
  };

  getFieldDecorator('buttonGroupKeys', { initialValue: buttonGroup || [] });
  const newButtonGroup = getFieldValue('buttonGroupKeys');

  return (
    <div>
      <Form.Item label="按钮组" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newButtonGroup.map((item, index) => {
        return (
          <div key={index} style={{ borderBottom: '1px solid solid #00000042', paddingBottom: 10 }}>
            <Form.Item label={`按钮svg(${index + 1})图标`} {...formItemLayout}>
              {getFieldDecorator(`buttonGroup[${index}].svgStr`, {
                initialValue: item.svgStr,
              })(<Input.TextArea />)}
            </Form.Item>

            <Form.Item label={`按钮(${index + 1})pageId`}>
              {getFieldDecorator(`buttonGroup[${index}].pageId`, {
                initialValue: item.pageId,
              })(<Input />)}
            </Form.Item>

            {newButtonGroup.length > 1 && (
              <Icon type="minus-circle" onClick={() => handleButtonRemove(index)} />
            )}
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleButtonAdd}>
          +添加
        </Button>
      </Form.Item>

      <Form.Item label="默认是否展开" {...formItemLayout}>
        {getFieldDecorator('Unfold', {
          initialValue: Unfold,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="是否需要Menu按钮" {...formItemLayout}>
        {getFieldDecorator('showMenuBtn', {
          initialValue: showMenuBtn,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="按钮宽度" {...formItemLayout}>
        {getFieldDecorator('box.boxWidth', {
          initialValue: box.boxWidth,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="按钮高度" {...formItemLayout}>
        {getFieldDecorator('box.boxHeight', {
          initialValue: box.boxHeight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="图标大小" {...formItemLayout}>
        {getFieldDecorator('iconSize', {
          initialValue: iconSize,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="背景色" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          initialValue: backgroundColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="菜单显示位置" {...formItemLayout}>
        {getFieldDecorator('direction', {
          initialValue: direction,
        })(
          <Select>
            <Select.Option value={1}>展开项显示在'上'边</Select.Option>
            <Select.Option value={2}>展开项显示在'下'边</Select.Option>
            <Select.Option value={3}>展开项显示在'左'边</Select.Option>
            <Select.Option value={4}>展开项显示在'右'边</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="圆角大小" {...formItemLayout}>
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
          rules: [{ min: 0, message: '最小值为0' }],
        })(<InputNumber />)}
      </Form.Item>
    </div>
  );
}

HomeConfig.propTypes = {
  a: PropTypes.array,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const { form, style, updateStyle } = props;

    const newFields = form.getFieldsValue();
    delete newFields['buttonGroupKeys'];

    updateStyle({ ...style, ...newFields });
  }, 500),
})(HomeConfig);

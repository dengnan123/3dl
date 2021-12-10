import React from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Input, Button, Icon, Switch, Select } from 'antd';
import { useDeepCompareEffect } from 'react-use';
import InputPadding from '../../../components/InputPadding';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const NewButtonGroupConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    id,
    style,
  } = props;

  const {
    compKey = 'buttonGroup',
    initOnChange = true,
    justifyContent = 'flex-start',
    buttonWidth,
    buttonHeight,
    padding = '0 0 0 0',
    fontSize = 14,
    textAlign = 'center',
    radius = 4,
    buttonSpacing = 5,
    type = 'default',
    hilightType = 'primary',
    showIcon = false,
    iconSize,
    iconMarginRight,
    customize = false,
    fontColor = 'rgba(0, 0, 0, 0.65)',
    disabledFontColor = 'rgba(0, 0, 0, 0.25)',
    hilightFontColor = '',
    bgColor,
    disabledBgColor = '#f5f5f5',
    hilightBgColor = '#1890ff',
    borderWidth,
    borderColor,
    disabledBorderColor,
    hilightBorderColor,
    buttonGroup = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ],
  } = style || {};

  const handleButtonAdd = () => {
    const newKeys = getFieldValue('keys') || [];
    const maxKey = Math.max(...newKeys, newKeys.length + 1);
    newKeys.push(maxKey);
    setFieldsValue({ keys: newKeys });
  };

  const handleButtonRemove = currentKey => {
    const newKeys = getFieldValue('keys').filter(k => k !== currentKey);
    setFieldsValue({ keys: newKeys });
  };

  useDeepCompareEffect(() => {
    const keys = (buttonGroup || [])?.map((n, index) => index);
    setFieldsValue({ keys });
    return resetFields;
  }, [id, buttonGroup]);

  getFieldDecorator('keys');
  const newKeys = getFieldValue('keys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="组件key" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input placeholder="compKey" />)}
      </Form.Item>

      <Form.Item label="初始化是否触发事件" {...formItemLayout}>
        {getFieldDecorator('initOnChange', {
          initialValue: initOnChange,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="按钮组位置" {...formItemLayout}>
        {getFieldDecorator('justifyContent', {
          initialValue: justifyContent,
        })(
          <Select>
            <Select.Option value="flex-start">居左</Select.Option>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="flex-end">居右</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="按钮宽度" {...formItemLayout}>
        {getFieldDecorator('buttonWidth', {
          initialValue: buttonWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="按钮高度" {...formItemLayout}>
        {getFieldDecorator('buttonHeight', {
          initialValue: buttonHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="内边距(上,右,下,左)" {...formItemLayout}>
        {getFieldDecorator('padding', {
          initialValue: padding,
        })(<InputPadding />)}
      </Form.Item>

      <Form.Item label="字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="文字水平对齐方式" {...formItemLayout}>
        {getFieldDecorator('textAlign', {
          initialValue: textAlign,
        })(
          <Select>
            <Select.Option key="left">左对齐</Select.Option>
            <Select.Option key="right">右对齐</Select.Option>
            <Select.Option key="center">居中</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="按钮圆角" {...formItemLayout}>
        {getFieldDecorator('radius', {
          initialValue: radius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="按钮间距" {...formItemLayout}>
        {getFieldDecorator('buttonSpacing', {
          initialValue: buttonSpacing,
        })(<InputNumber min={0} />)}
      </Form.Item>

      {!customize && (
        <>
          <Form.Item label="按钮类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: type,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="primary">Primary</Select.Option>
                <Select.Option value="dashed">Dashed</Select.Option>
                <Select.Option value="danger">Danger</Select.Option>
                <Select.Option value="link">Link</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="高亮按钮类型" {...formItemLayout}>
            {getFieldDecorator('hilightType', {
              initialValue: hilightType,
            })(
              <Select style={{ width: 120 }}>
                <Select.Option value="default">Default</Select.Option>
                <Select.Option value="primary">Primary</Select.Option>
                <Select.Option value="dashed">Dashed</Select.Option>
                <Select.Option value="danger">Danger</Select.Option>
                <Select.Option value="link">Link</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </>
      )}

      <Form.Item label="自定义" {...formItemLayout}>
        {getFieldDecorator('customize', {
          initialValue: customize,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {customize && (
        <>
          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('fontColor', {
              initialValue: fontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="禁用字体颜色" {...formItemLayout}>
            {getFieldDecorator('disabledFontColor', {
              initialValue: disabledFontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="高亮字体颜色" {...formItemLayout}>
            {getFieldDecorator('hilightFontColor', {
              initialValue: hilightFontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="背景颜色" {...formItemLayout}>
            {getFieldDecorator('bgColor', {
              initialValue: bgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="禁用背景颜色" {...formItemLayout}>
            {getFieldDecorator('disabledBgColor', {
              initialValue: disabledBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="高亮背景颜色" {...formItemLayout}>
            {getFieldDecorator('hilightBgColor', {
              initialValue: hilightBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框宽度" {...formItemLayout}>
            {getFieldDecorator('borderWidth', {
              initialValue: borderWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('borderColor', {
              initialValue: borderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框禁用颜色" {...formItemLayout}>
            {getFieldDecorator('disabledBorderColor', {
              initialValue: disabledBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="高亮边框颜色" {...formItemLayout}>
            {getFieldDecorator('hilightBorderColor', {
              initialValue: hilightBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="显示图标" {...formItemLayout}>
            {getFieldDecorator('showIcon', {
              initialValue: showIcon,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showIcon && (
            <>
              <Form.Item label="图标大小" {...formItemLayout}>
                {getFieldDecorator('iconSize', {
                  initialValue: iconSize,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="图标右边距" {...formItemLayout}>
                {getFieldDecorator('iconMarginRight', {
                  initialValue: iconMarginRight,
                })(<InputNumber />)}
              </Form.Item>
            </>
          )}
        </>
      )}

      <Form.Item label="按钮组" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newKeys?.map(k => {
        return (
          <div className={styles.legendItem} key={k}>
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${k}].label`, {
                initialValue: buttonGroup?.[k]?.label,
              })(<Input placeholder="名称" />)}
            </Form.Item>
            {showIcon && (
              <Form.Item>
                {getFieldDecorator(`buttonGroup[${k}].svgStr`, {
                  initialValue: buttonGroup?.[k]?.svgStr,
                })(<Input.TextArea placeholder="svg" />)}
              </Form.Item>
            )}
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${k}].value`, {
                initialValue: buttonGroup?.[k]?.value,
              })(<Input placeholder="value" />)}
            </Form.Item>
            <Form.Item label="禁用" {...formItemLayout}>
              {getFieldDecorator(`buttonGroup[${k}].disabled`, {
                initialValue: buttonGroup?.[k]?.disbaled,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>

            {newKeys.length > 1 && (
              <Icon type="minus-circle" onClick={() => handleButtonRemove(k)} />
            )}
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleButtonAdd}>
          +添加
        </Button>
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const { buttonGroup, keys, ...restFields } = getFieldsValue();
    console.log('keys', keys);
    const newButtonGroup = keys?.map(k => buttonGroup?.[k]) || [];
    const finalParams = {
      ...style,
      ...restFields,
    };
    if (keys && !!keys.length) {
      finalParams.buttonGroup = newButtonGroup;
    }
    console.log('finalParams', finalParams);
    updateStyle(finalParams);
  }, 500),
})(NewButtonGroupConfig);

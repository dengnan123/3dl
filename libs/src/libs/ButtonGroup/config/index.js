import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Button, Icon, Switch, Select } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const ButtonGroupConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    id,
    style,
  } = props;

  const {
    buttonWidth,
    buttonHeight,
    fontSize,
    textAlign,
    radius,
    buttonSpacing,
    type,
    hilightType,
    showIcon,
    iconSize,
    iconMarginRight,
    customize,
    fontColor,
    hilightFontColor,
    initHighlight = true,
    bgColor,
    hilightBgColor,
    borderWidth,
    borderColor,
    hilightBorderColor,
    buttonGroup,
  } = style || {};

  const handleButtonAdd = () => {
    const newButtonGroup = getFieldValue('buttonGroupKeys') || [];
    newButtonGroup.push({ label: '', labelEn: '', svgStr: '', compKey: '', compValue: '' });
    setFieldsValue({ buttonGroupKeys: newButtonGroup });
  };

  const handleButtonRemove = curIndex => {
    const newButtonGroup = getFieldValue('buttonGroupKeys').filter(
      (n, index) => index !== curIndex,
    );
    setFieldsValue({ buttonGroupKeys: newButtonGroup });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  const initialButtonGroup = buttonGroup || [];

  getFieldDecorator('buttonGroupKeys', {
    initialValue: initialButtonGroup,
  });
  const newButtonGroup = getFieldValue('buttonGroupKeys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
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

          <Form.Item label="高亮边框颜色" {...formItemLayout}>
            {getFieldDecorator('hilightBorderColor', {
              initialValue: hilightBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="首次高亮" {...formItemLayout}>
            {getFieldDecorator('initHighlight', {
              initialValue: initHighlight,
              valuePropName: 'checked',
            })(<Switch />)}
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
      {newButtonGroup.map((item, index) => {
        return (
          <div className={styles.legendItem} key={index}>
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${index}].label`, {
                initialValue: item.label,
              })(<Input placeholder="内容(中)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${index}].labelEn`, {
                initialValue: item.labelEn,
              })(<Input placeholder="内容(英)" />)}
            </Form.Item>
            {showIcon && (
              <Form.Item>
                {getFieldDecorator(`buttonGroup[${index}].svgStr`, {
                  initialValue: item.svgStr,
                })(<Input.TextArea placeholder="svg" />)}
              </Form.Item>
            )}
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${index}].compKey`, {
                initialValue: item.compKey,
              })(<Input placeholder="compKey" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`buttonGroup[${index}].compValue`, {
                initialValue: item.compValue,
              })(<Input placeholder="compValue" />)}
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
    const newFields = getFieldsValue();
    delete newFields['buttonGroupKeys'];
    console.log('newFields: ', newFields);
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(ButtonGroupConfig);

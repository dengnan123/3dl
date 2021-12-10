import React, { useEffect } from 'react';
import { Form, InputNumber, Select, Radio } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

const InfoBarConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue },
    id,
    style,
    mockData,
  } = props;

  const { dataSource = [] } = mockData || {};

  const {
    titleFontSize,
    titleFontWeight = 400,
    titleColor,
    titleWordSpacing = 0,
    titleLetterSpacing = 0,
    valueFontSize,
    valueFontWeight = 400,
    valueWordSpacing = 0,
    valueLetterSpacing = 0,
    valueColor,
    marginRight,
    marginBottom,
    showDivider,
    deviderWidth,
    deviderColor = 'rgba(216,216,216,1)',
    isEquallyDevided = true,
    itemWidthList = [],
    flexDirection = 'row',
    justifyContent,
    alignItems,
    PaddingTopBottom,
    PaddingLeftRight,
    boxFlexDirection = 'row',
  } = style || {};

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const initialItemWidthList = dataSource.map((n, index) => itemWidthList[index] || 150);

  getFieldDecorator('widthKeys', {
    initialValue: initialItemWidthList,
  });
  const newItemWidthList = getFieldValue('widthKeys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="上下内边距" {...formItemLayout}>
        {getFieldDecorator('PaddingTopBottom', {
          initialValue: PaddingTopBottom,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="左右内边距" {...formItemLayout}>
        {getFieldDecorator('PaddingLeftRight', {
          initialValue: PaddingLeftRight,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('titleFontSize', {
          initialValue: titleFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="标题文字粗细" {...formItemLayout}>
        {getFieldDecorator('titleFontWeight', {
          initialValue: titleFontWeight,
        })(<InputNumber min={100} step={100} max={900} />)}
      </Form.Item>

      <Form.Item label="标题字体颜色" {...formItemLayout}>
        {getFieldDecorator('titleColor', {
          initialValue: titleColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="标题单词间距(wordSpacing)" {...formItemLayout}>
        {getFieldDecorator('titleWordSpacing', {
          initialValue: titleWordSpacing,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="标题字母间距(letterSpacing)" {...formItemLayout}>
        {getFieldDecorator('titleLetterSpacing', {
          initialValue: titleLetterSpacing,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="数值字体大小" {...formItemLayout}>
        {getFieldDecorator('valueFontSize', {
          initialValue: valueFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="数值文字粗细" {...formItemLayout}>
        {getFieldDecorator('valueFontWeight', {
          initialValue: valueFontWeight,
        })(<InputNumber min={100} step={100} max={900} />)}
      </Form.Item>

      <Form.Item label="数值字体颜色" {...formItemLayout}>
        {getFieldDecorator('valueColor', {
          initialValue: valueColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="数值单词间距(wordSpacing)" {...formItemLayout}>
        {getFieldDecorator('valueWordSpacing', {
          initialValue: valueWordSpacing,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="数值字母间距(letterSpacing)" {...formItemLayout}>
        {getFieldDecorator('valueLetterSpacing', {
          initialValue: valueLetterSpacing,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="标题和数值水平间距" {...formItemLayout}>
        {getFieldDecorator('marginRight', {
          initialValue: marginRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="标题和数值垂直间距" {...formItemLayout}>
        {getFieldDecorator('marginBottom', {
          initialValue: marginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="显示分割线" {...formItemLayout}>
        {getFieldDecorator('showDivider', {
          initialValue: showDivider,
        })(
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>,
        )}
      </Form.Item>

      {showDivider && (
        <>
          <Form.Item label="分割线宽度" {...formItemLayout}>
            {getFieldDecorator('deviderWidth', {
              initialValue: deviderWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="分割线颜色" {...formItemLayout}>
            {getFieldDecorator('deviderColor', {
              initialValue: deviderColor,
            })(<InputColor />)}
          </Form.Item>
        </>
      )}

      <Form.Item label="是否均分" {...formItemLayout}>
        {getFieldDecorator('isEquallyDevided', {
          initialValue: isEquallyDevided,
        })(
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>,
        )}
      </Form.Item>

      {isEquallyDevided === false &&
        newItemWidthList.map((w, index) => (
          <Form.Item label={index === 0 ? '宽度' : ''} key={index}>
            {getFieldDecorator(`itemWidthList[${index}]`, {
              initialValue: w,
            })(<InputNumber min={0} />)}
          </Form.Item>
        ))}

      <Form.Item label="排列方式" {...formItemLayout}>
        {getFieldDecorator('flexDirection', {
          initialValue: flexDirection,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="row">水平</Select.Option>
            <Select.Option value="column">垂直</Select.Option>
            <Select.Option value="column-reverse">反向垂直</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item
        label={flexDirection === 'row' ? '水平对齐方式' : '垂直对齐方式'}
        {...formItemLayout}
      >
        {getFieldDecorator('justifyContent', {
          initialValue: justifyContent,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="flex-start">
              {flexDirection === 'row' ? '左对齐' : '上对齐'}
            </Select.Option>
            <Select.Option value="flex-end">
              {flexDirection === 'row' ? '右对齐' : '下对齐'}
            </Select.Option>
            <Select.Option value="space-between">{'两端对齐'}</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item
        label={flexDirection === 'row' ? '垂直对齐方式' : '水平对齐方式'}
        {...formItemLayout}
      >
        {getFieldDecorator('alignItems', {
          initialValue: alignItems,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="center">居中</Select.Option>
            <Select.Option value="flex-start">
              {flexDirection === 'row' ? '上对齐' : '左对齐'}
            </Select.Option>
            <Select.Option value="flex-end">
              {flexDirection === 'row' ? '下对齐' : '右对齐'}
            </Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="整体布局" {...formItemLayout}>
        {getFieldDecorator('boxFlexDirection', {
          initialValue: boxFlexDirection,
        })(
          <Select style={{ width: 120 }}>
            <Select.Option value="row">水平</Select.Option>
            <Select.Option value="column">垂直</Select.Option>
          </Select>,
        )}
      </Form.Item>

      {/* <Form.Item label="背景颜色" {...formItemLayout}>
        {getFieldDecorator('bgColor', {
          initialValue: bgColor,
        })(<InputColor />)}
      </Form.Item> */}
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
    delete newFields['widthKeys'];

    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(InfoBarConfig);

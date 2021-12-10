import React, { useEffect } from 'react';
import { Form, Select, InputNumber, Tooltip } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';
import BasicStyle from '../../../components/BasicStyle';

const MapStatusConfig = props => {
  const { form, id, style } = props;
  const { resetFields } = form;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const configArray = [
    {
      label: '字体大小',
      name: 'FontSize',
      type: 'inputNumber',
      defaultValue: '20',
    },
    {
      label: '字体颜色',
      name: 'FontColor',
      type: 'inputColor',
      defaultValue: '#000',
    },
    {
      label: 'title字体大小',
      name: 'titleFontSize',
      type: 'inputNumber',
      defaultValue: '20',
    },
    {
      label: 'title字体颜色',
      name: 'titleFontColor',
      type: 'inputColor',
      defaultValue: '#000',
    },
    {
      label: 'startColor',
      name: 'startColor',
      type: 'inputColor',
      defaultValue: 'rgb(180, 42, 42)',
    },
    {
      label: 'endColor',
      name: 'endColor',
      type: 'inputColor',
      defaultValue: 'rgb(259, 156, 106)',
    },

    {
      label: '上下间距',
      name: 'MarginBottom',
      type: 'inputNumber',
      defaultValue: 0,
    },
    {
      label: 'block宽度',
      name: 'blockWidth',
      type: 'inputNumber',
      defaultValue: 90,
    },
    {
      label: 'block高度',
      name: 'blockHeight',
      type: 'inputNumber',
      defaultValue: 26,
    },
  ];

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Tooltip title={<p>无</p>}>
        <p style={{ textAlign: 'center' }}>提示</p>
      </Tooltip>

      {/* <BasicStyle /> */}

      {configArray.map(item => {
        return <FormItem {...props} {...item} />;
      })}
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
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(MapStatusConfig);

function FormItem(props) {
  const { form, formItemLayout, style, label, name, type, defaultValue, options } = props;
  const { getFieldDecorator } = form;

  const renderDom = type => {
    if (type === 'select') {
      return (
        <Select>
          {options.map(item => {
            return <Select.Option value={item}>{item}</Select.Option>;
          })}
        </Select>
      );
    } else if (type === 'inputColor') {
      return <InputColor />;
    }
    return <InputNumber />;
  };

  return (
    <Form.Item label={label} {...formItemLayout}>
      {getFieldDecorator(`${name}`, {
        initialValue: style[name] || defaultValue,
      })(renderDom(type))}
    </Form.Item>
  );
}

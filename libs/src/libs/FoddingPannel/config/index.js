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
      label: '父选框颜色',
      name: 'FatherBgColor',
      type: 'inputColor',
      defaultValue: '#000',
    },
    {
      label: '父选项字体大小',
      name: 'FaFontSize',
      type: 'inputNumber',
      defaultValue: 16,
    },
    {
      label: '父选框高度',
      name: 'FatherHeight',
      type: 'inputNumber',
      defaultValue: '50',
    },
    {
      label: '父选项上下间距',
      name: 'FaMarginTop',
      type: 'inputNumber',
      defaultValue: 5,
    },

    {
      label: '子选框颜色',
      name: 'childrenBgColor',
      type: 'inputColor',
      defaultValue: '#000',
    },
    {
      label: '子选项字体大小',
      name: 'ChildrenFontSize',
      type: 'inputNumber',
      defaultValue: 16,
    },
    {
      label: '子选框高度',
      name: 'childrenHeight',
      type: 'inputNumber',
      defaultValue: '40',
    },
    {
      label: '子选项上下间距',
      name: 'MarginTop',
      type: 'inputNumber',
      defaultValue: 5,
    },

    {
      label: '选项框圆角',
      name: 'itemRadius',
      type: 'inputNumber',
      defaultValue: '16',
    },
    {
      label: '高亮颜色',
      name: 'highlightColor',
      type: 'inputColor',
      defaultValue: '#429EFF',
    },

    {
      label: '字体颜色',
      name: 'FontColor',
      type: 'inputColor',
      defaultValue: '#e6e6e6',
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

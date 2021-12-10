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
      label: '时间线长度',
      name: 'timeLineLong',
      type: 'inputNumber',
      defaultValue: '600',
    },
    {
      label: '整体-主题色',
      name: 'themeColor',
      type: 'inputColor',
      defaultValue: '#005DB3',
    },
    {
      label: '滑动步长',
      name: 'step',
      type: 'inputNumber',
      defaultValue: 400,
    },
    {
      label: '事件框宽度',
      name: 'eventWrapperWidth',
      type: 'inputNumber',
      defaultValue: 260,
    },
    {
      label: '事件框间距',
      name: 'eventWrapperMargin',
      type: 'inputNumber',
      defaultValue: 100,
    },
    {
      label: '事件框背景色',
      name: 'eventWrapperBg',
      type: 'inputColor',
      defaultValue: '#EEEEEE',
    },
   
  ];

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Tooltip
        title={
          <p>
           无
          </p>
        }
      >
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

import React, { useEffect } from 'react';
import { Form, Select, InputNumber, Tooltip } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';
// import BasicStyle from '../../../components/BasicStyle';

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
      label: '排列方式',
      name: 'HorizontalAndVertical',
      type: 'select',
      defaultValue: 'column',
      options: ['row', 'column'],
    },
    {
      label: '图标-文字距离',
      name: 'circleMarginRight',
      type: 'inputNumber',
      defaultValue: 0,
    },
    {
      label: '整体-字体大小',
      name: 'fontSize',
      type: 'inputNumber',
      defaultValue: 16,
    },
    {
      label: '整体-字体颜色',
      name: 'statusColor',
      type: 'inputColor',
      defaultValue: 'rgba(0, 0, 0, 1)',
    },
    {
      label: '整体-行高',
      name: 'lineHeight',
      type: 'inputNumber',
      defaultValue: 16,
    },
    {
      label: '整体-title-value间距',
      name: 'titleMarginRight',
      type: 'inputNumber',
      defaultValue: 10,
    },
  ];

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Tooltip
        title={
          <p>
            这里的设置只用于整体，每行单独样式请在数据里面修改，包括头部的圆点
            <br />
            mock.item,整行样式；circle：圆点样式
            <br />
            权重：单独 > 整体
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

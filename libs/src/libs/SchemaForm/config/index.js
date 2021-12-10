import React, { useEffect } from 'react';
import { Form, InputNumber, Switch, Button, Descriptions } from 'antd';
import { debounce } from 'lodash';

import FilterFormItem from '../../../components/FilterFormItem';

const defaultSchema = {
  schema: {
    type: 'object',
    properties: {
      select_ThngGs: {
        title: '单选',
        type: 'string',
        enum: ['a', 'b', 'c'],
        enumNames: ['早', '中', '晚'],
      },
      number_YGjmnx: {
        title: '数字输入框',
        type: 'number',
      },
      checkbox_jmWtWW: {
        title: '是否选择',
        type: 'boolean',
        'ui:widget': 'switch',
      },
      dateRange_q6r0VG: {
        title: '日期范围',
        type: 'range',
        format: 'dateTime',
        'ui:options': {
          placeholder: ['开始时间', '结束时间'],
        },
      },
      image_YwXaFQ: {
        title: '图片展示',
        type: 'string',
        format: 'image',
      },
      color_bVt8Yw: {
        title: '颜色选择',
        type: 'string',
        format: 'color',
      },
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 120,
};

function SchemaFormConfig(props) {
  const {
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="开启默认Modal">
        {getFieldDecorator('useDefaultModal', {
          initialValue: style?.useDefaultModal ?? true,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="modal宽度">
        {getFieldDecorator('modalWidth', {
          initialValue: style?.modalWidth || 960,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="modal高度">
        {getFieldDecorator('modalHeight', {
          initialValue: style?.modalHeight || 800,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item>
        <Button
          onClick={() => window.open('https://x-render.gitee.io/schema-generator/playground')}
        >
          Schama生成器
        </Button>
      </Form.Item>
      <hr />
      <Form.Item label="自定义Schema表单">
        <FilterFormItem
          form={{ getFieldDecorator, getFieldValue, setFieldsValue }}
          formFieldName="jsonSchema"
          initialValue={style?.jsonSchema || JSON.stringify(defaultSchema, null, 2)}
          fieldLabel=""
          language="json"
        />
      </Form.Item>
      <Descriptions title="其他组件传参格式" layout="horizontal" column={1}>
        <Descriptions.Item label="modalTitle">默认modal标题</Descriptions.Item>
        <Descriptions.Item label="formSchema">表单schema</Descriptions.Item>
        <Descriptions.Item label="submitId">外部提交按钮标识Id</Descriptions.Item>
      </Descriptions>
      ,
    </div>
  );
}

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 100),
})(SchemaFormConfig);

import React from 'react';
import { debounce } from 'lodash';
import { Form, Select, InputNumber, Input, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';
const { Panel } = Collapse;

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    DEFAULT_COUNT = 1,
    addContent = '添加',
    addContentEn = 'Add',
    deleteContent = '删除',
    deleteContentEn = 'Delete',
    fontSize = 12,
    addFontColor = '#000000',
    deleteFontColor = '#000000',
    borderRadius = 0,
    addType = 'default',
    deleteType = 'default',
    marginLeft = 30,
    marginLeftBtn = 5,
    widthBtn = 60,
    heightBtn = 30,
    MAX_COUNT = 5,
  } = style || {};

  return (
    <div>
      <Form.Item label="默认数量" {...formItemLayout}>
        {getFieldDecorator('DEFAULT_COUNT', {
          initialValue: DEFAULT_COUNT,
        })(<InputNumber min={1} />)}
      </Form.Item>
      <Form.Item label="最大数量" {...formItemLayout}>
        {getFieldDecorator('MAX_COUNT', {
          initialValue: MAX_COUNT,
        })(<InputNumber min={1} />)}
      </Form.Item>
      <Form.Item label="间距" {...formItemLayout}>
        {getFieldDecorator('marginLeft', {
          initialValue: marginLeft,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <Form.Item label="添加内容(中)" {...formItemLayout}>
            {getFieldDecorator('addContent', {
              initialValue: addContent,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="添加内容(英)" {...formItemLayout}>
            {getFieldDecorator('addContentEn', {
              initialValue: addContentEn,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="删除内容(中)" {...formItemLayout}>
            {getFieldDecorator('deleteContent', {
              initialValue: deleteContent,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="删除内容(英)" {...formItemLayout}>
            {getFieldDecorator('deleteContentEn', {
              initialValue: deleteContentEn,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="按钮间距" {...formItemLayout}>
            {getFieldDecorator('marginLeftBtn', {
              initialValue: marginLeftBtn,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="按钮宽度" {...formItemLayout}>
            {getFieldDecorator('widthBtn', {
              initialValue: widthBtn,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item label="按钮高度" {...formItemLayout}>
            {getFieldDecorator('heightBtn', {
              initialValue: heightBtn,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="添加字体颜色" {...formItemLayout}>
            {getFieldDecorator('addFontColor', {
              initialValue: addFontColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="删除字体颜色" {...formItemLayout}>
            {getFieldDecorator('deleteFontColor', {
              initialValue: deleteFontColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="添加按钮类型" {...formItemLayout}>
            {getFieldDecorator('addType', {
              initialValue: addType,
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

          <Form.Item label="删除按钮类型" {...formItemLayout}>
            {getFieldDecorator('deleteType', {
              initialValue: deleteType,
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
        </Panel>
      </Collapse>
    </div>
  );
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
  }, 200),
})(BasicConfig);

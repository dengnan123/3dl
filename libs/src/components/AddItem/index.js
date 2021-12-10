import React, { PureComponent } from 'react';
import { Form, Button, Icon, InputNumber } from 'antd';
import InputColor from '../InputColor';
let id = 0;

export class AddForm extends PureComponent {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({ keys: nextKeys });
  };

  render() {
    const { Segment } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    getFieldDecorator('keys', { initialValue: Segment || [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={`区间${index + 1}`}
        required={false}
        key={k}
      >
        {getFieldDecorator(
          `name[${k}]`,
          {},
        )(
          <>
            <Form.Item label="区间最小值(包含))">
              {getFieldDecorator(``)}
              <InputNumber />
            </Form.Item>

            <Form.Item label="区间最大值(不包含)">
              <InputNumber />
            </Form.Item>

            <Form.Item label="区间所设置颜色">
              <InputColor />
            </Form.Item>
          </>,
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <div>
        {formItems}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" />
            Add field
          </Button>
        </Form.Item>
      </div>
    );
  }
}

export default Form.create()(AddForm);

import { reap } from '../../../../components/SafeReaper';
// import { filterObj } from '../../../../helpers/utils';
import { Form, InputNumber, Switch, Input, Select } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;

const Title = props => {
  const {
    style,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;

  return (
    <div>
      <FormItem label="开启标题显示" {...formItemLayout}>
        {getFieldDecorator('show', {
          initialValue: reap(style, 'title.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      <FormItem label="标题" {...formItemLayout}>
        {getFieldDecorator('text', {
          initialValue: reap(style, 'title.text', '标题'),
        })(<Input />)}
      </FormItem>

      <FormItem label="标题字体颜色" {...formItemLayout}>
        {getFieldDecorator('textStyle.color', {
          initialValue: reap(style, 'title.textStyle.color', '#424242'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="标题字体风格" {...formItemLayout}>
        {getFieldDecorator('textStyle.fontStyle', {
          initialValue: reap(style, 'title.textStyle.fontStyle', 'normal'),
        })(
          <Select>
            <Select.Option key="normal">正常</Select.Option>
            <Select.Option key="italic">斜体</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="标题字体粗细" {...formItemLayout}>
        {getFieldDecorator('textStyle.fontWeight', {
          initialValue: reap(style, 'title.textStyle.fontWeight', 400),
        })(<InputNumber min={100} max={900} step={100} />)}
      </FormItem>

      <FormItem label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('textStyle.fontSize', {
          initialValue: reap(style, 'title.textStyle.fontSize', 16),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="标题字体行高" {...formItemLayout}>
        {getFieldDecorator('textStyle.lineHeight', {
          initialValue: reap(style, 'title.textStyle.lineHeight', 16),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="标题字体行高" {...formItemLayout}>
        {getFieldDecorator('textStyle.lineHeight', {
          initialValue: reap(style, 'title.textStyle.lineHeight', 16),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="字体水平对齐方式" {...formItemLayout}>
        {getFieldDecorator('textAlign', {
          initialValue: reap(style, 'title.textAlign', 'auto'),
        })(
          <Select>
            <Select.Option key="auto">自动</Select.Option>
            <Select.Option key="left">左对齐</Select.Option>
            <Select.Option key="right">右对齐</Select.Option>
            <Select.Option key="center">居中</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="字体垂直对齐方式" {...formItemLayout}>
        {getFieldDecorator('textVerticalAlign', {
          initialValue: reap(style, 'title.textVerticalAlign', 'auto'),
        })(
          <Select>
            <Select.Option key="auto">自动</Select.Option>
            <Select.Option key="top">顶部对齐</Select.Option>
            <Select.Option key="bottom">底部对齐</Select.Option>
            <Select.Option key="middle">居中</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="字体位置(左)" {...formItemLayout}>
        {getFieldDecorator('left', {
          initialValue: reap(style, 'title.left', 'auto'),
        })(<Input placeholder="auto, left, center, right, 20, 20%" />)}
      </FormItem>

      <FormItem label="字体位置(右)" {...formItemLayout}>
        {getFieldDecorator('right', {
          initialValue: reap(style, 'title.right', 'auto'),
        })(<Input placeholder="auto, 20, 20%" />)}
      </FormItem>

      <FormItem label="字体位置(上)" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: reap(style, 'title.top', 'auto'),
        })(<Input placeholder="auto, top, middle, bottom, 20, 20%" />)}
      </FormItem>

      <FormItem label="字体位置(下)" {...formItemLayout}>
        {getFieldDecorator('bottom', {
          initialValue: reap(style, 'title.bottom', 'auto'),
        })(<Input placeholder="auto, 20, 20%" />)}
      </FormItem>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style
    } = props;
    const newFields = getFieldsValue();

    while (newFields.text && newFields.text.indexOf('\\n') >= 0) {
      newFields.text = newFields.text.replace('\\n', '\n');
    }

    updateStyle({
      ...style,
      title: newFields,
    });
  },
})(Title);

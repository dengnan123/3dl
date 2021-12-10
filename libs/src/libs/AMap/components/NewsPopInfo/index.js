import { Form, Switch, Select, InputNumber, Input } from 'antd';
import { reap } from '../../../../components/SafeReaper';
// import styles from './index.less';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;

function NewsPopInfo(props) {
  const {
    style,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;

  return (
    <div>
      <FormItem label="信息框位置" {...formItemLayout}>
        {getFieldDecorator('newsPop.show', {
          initialValue: reap(style, 'newsPop.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="信息框位置" {...formItemLayout}>
        {getFieldDecorator('newsPop.position', {
          initialValue: reap(style, 'newsPop.position', 'leftBottom'),
        })(
          <Select>
            <Select.Option value="LeftTop">左侧顶部</Select.Option>
            <Select.Option value="leftBottom">左侧底部</Select.Option>
            <Select.Option value="rightTop">右侧顶部</Select.Option>
            <Select.Option value="rightBottom">右侧底部</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="宽度" {...formItemLayout}>
        {getFieldDecorator('newsPop.width', {
          initialValue: reap(style, 'newsPop.width', 'auto'),
        })(<Input placeholder="100px, 100%, auto" />)}
      </FormItem>

      <FormItem label="高度" {...formItemLayout}>
        {getFieldDecorator('newsPop.height', {
          initialValue: reap(style, 'newsPop.height', 'auto'),
        })(<Input placeholder="100px, 100%, auto" />)}
      </FormItem>

      <FormItem label="背景色" {...formItemLayout}>
        {getFieldDecorator('newsPop.background', {
          initialValue: reap(style, 'newsPop.background', 'rgba(255, 255, 255, 1)'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="内边距" {...formItemLayout}>
        {getFieldDecorator('newsPop.padding', {
          initialValue: reap(style, 'newsPop.padding', 10),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="边框圆角" {...formItemLayout}>
        {getFieldDecorator('newsPop.borderRadius', {
          initialValue: reap(style, 'newsPop.borderRadius', 0),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('newsPop.titleFont', {
          initialValue: reap(style, 'newsPop.titleFont', 20),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="标题字体颜色" {...formItemLayout}>
        {getFieldDecorator('newsPop.titleColor', {
          initialValue: reap(style, 'newsPop.titleColor', 'rgba(0, 0, 0, 1)'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="内容字体大小" {...formItemLayout}>
        {getFieldDecorator('newsPop.contentFont', {
          initialValue: reap(style, 'newsPop.contentFont', 14),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="内容字体颜色" {...formItemLayout}>
        {getFieldDecorator('newsPop.contentColor', {
          initialValue: reap(style, 'newsPop.contentColor', 'rgba(0, 0, 0, 1)'),
        })(<InputColor />)}
      </FormItem>
    </div>
  );
}

export default Form.create({
  onFieldsChange: (props, changedFields) => {
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
  },
})(NewsPopInfo);

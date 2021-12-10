import { Form, Switch, InputNumber, Input, Select } from 'antd';
import InputColor from '../../../../components/InputColor';
import FilterFormItem from '../../../../components/FilterFormItem';
import { reap } from '../../../../components/SafeReaper';

import styles from './index.less';

const FormItem = Form.Item;

const MyPopUpConfig = props => {
  const { style, form, formItemLayout } = props;

  const { getFieldDecorator } = form;

  const disableStatus = !reap(style, 'myPopUp.carousel', false);

  return (
    <div className={styles.container}>
      <FormItem label="是否显示自定义信息浮窗" {...formItemLayout}>
        {getFieldDecorator('myPopUp.show', {
          initialValue: reap(style, 'myPopUp.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="是否轮巡自定义信息浮窗" {...formItemLayout}>
        {getFieldDecorator('myPopUp.carousel', {
          initialValue: reap(style, 'myPopUp.carousel', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="浮窗切换时间间隔（秒）" {...formItemLayout}>
        {getFieldDecorator('myPopUp.interval', {
          initialValue: reap(style, 'myPopUp.interval', 2),
        })(<InputNumber disabled={disableStatus} min={1} />)}
      </FormItem>

      <FormItem label="宽度" {...formItemLayout}>
        {getFieldDecorator('myPopUp.width', {
          initialValue: reap(style, 'myPopUp.width', 'auto'),
        })(<Input placeholder="100px, 100%, auto" />)}
      </FormItem>

      <FormItem label="高度" {...formItemLayout}>
        {getFieldDecorator('myPopUp.height', {
          initialValue: reap(style, 'myPopUp.height', 'auto'),
        })(<Input placeholder="100px, 100%, auto" />)}
      </FormItem>

      <FormItem label="圆角" {...formItemLayout}>
        {getFieldDecorator('myPopUp.borderRadius', {
          initialValue: reap(style, 'myPopUp.borderRadius', 0),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="内边距" {...formItemLayout}>
        {getFieldDecorator('myPopUp.padding', {
          initialValue: reap(style, 'myPopUp.padding', 10),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="背景色" {...formItemLayout}>
        {getFieldDecorator('myPopUp.backgroundColor', {
          initialValue: reap(style, 'myPopUp.backgroundColor', 'rgba(0,0,0,0.5)'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="背景透明度" {...formItemLayout}>
        {getFieldDecorator('myPopUp.opacity', {
          initialValue: reap(style, 'myPopUp.opacity', 0.6),
        })(<InputNumber min={0} max={1} />)}
      </FormItem>

      <FormItem label="显示标题" {...formItemLayout}>
        {getFieldDecorator('myPopUp.title.show', {
          initialValue: reap(style, 'myPopUp.title.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {reap(style, 'myPopUp.title.show', true) && (
        <>
          <FormItem label="标题字体大小" {...formItemLayout}>
            {getFieldDecorator('myPopUp.title.fontSize', {
              initialValue: reap(style, 'myPopUp.title.fontSize', 20),
            })(<InputNumber min={12} />)}
          </FormItem>

          <FormItem label="标题字体颜色" {...formItemLayout}>
            {getFieldDecorator('myPopUp.title.color', {
              initialValue: reap(style, 'myPopUp.title.color', '#ffffff'),
            })(<InputColor />)}
          </FormItem>

          <FormItem label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('myPopUp.title.textAlign', {
              initialValue: reap(style, 'myPopUp.title.textAlign', 'left'),
            })(
              <Select>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="标题字体行高" {...formItemLayout}>
            {getFieldDecorator('myPopUp.title.lineHeight', {
              initialValue: reap(style, 'myPopUp.title.lineHeight', 24),
            })(<InputNumber min={0} />)}
          </FormItem>

          <FormItem label="标题下边距" {...formItemLayout}>
            {getFieldDecorator('myPopUp.title.marginBottom', {
              initialValue: reap(style, 'myPopUp.title.marginBottom', 10),
            })(<InputNumber min={0} />)}
          </FormItem>
        </>
      )}

      <FormItem label="显示内容" {...formItemLayout}>
        {getFieldDecorator('myPopUp.content.show', {
          initialValue: reap(style, 'myPopUp.content.show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {reap(style, 'myPopUp.content.show', true) && (
        <>
          <FormItem label="内容字体大小" {...formItemLayout}>
            {getFieldDecorator('myPopUp.content.fontSize', {
              initialValue: reap(style, 'myPopUp.content.fontSize', 14),
            })(<InputNumber min={12} />)}
          </FormItem>

          <FormItem label="内容字体颜色" {...formItemLayout}>
            {getFieldDecorator('myPopUp.content.color', {
              initialValue: reap(style, 'myPopUp.content.color', '#ffffff'),
            })(<InputColor />)}
          </FormItem>

          <FormItem label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('myPopUp.content.textAlign', {
              initialValue: reap(style, 'myPopUp.content.textAlign', 'left'),
            })(
              <Select>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </FormItem>

          <FormItem label="内容字体行高" {...formItemLayout}>
            {getFieldDecorator('myPopUp.content.lineHeight', {
              initialValue: reap(style, 'myPopUp.content.lineHeight', 18),
            })(<InputNumber min={0} />)}
          </FormItem>

          <FilterFormItem
            form={form}
            formItemLayout={formItemLayout}
            initialValue={style?.myPopUp?.formatter}
            formFieldName="myPopUp.formatter"
          />
        </>
      )}
    </div>
  );
};

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
})(MyPopUpConfig);

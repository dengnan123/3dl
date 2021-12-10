import { Form, Switch } from 'antd';
// import InputColor from '../../../../components/InputColor';
import FilterFormItem from '../../../../components/FilterFormItem';

const FormItem = Form.Item;

const GraphColor = props => {
  const { style, form, formItemLayout } = props;

  const { getFieldDecorator } = form;

  const isOpenGradient = style?.graphColor?.isOpenGradient || false;
  const isCustomColor = style?.graphColor?.isCustomColor || false;
  const customColorFilterFunc = style?.graphColor?.customColorFilterFunc;

  return (
    <div>
      <FormItem label="开启渐变色" {...formItemLayout}>
        {getFieldDecorator('graphColor.isOpenGradient', {
          initialValue: isOpenGradient,
          valuePropName: 'checked',
        })(<Switch disabled={isCustomColor} />)}
      </FormItem>

      <FormItem label="自定义配色" {...formItemLayout}>
        {getFieldDecorator('graphColor.isCustomColor', {
          initialValue: isCustomColor,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FilterFormItem
        formFieldName="graphColor.customColorFilterFunc"
        initialValue={customColorFilterFunc}
        fieldLabel="自定义配色函数(返回颜色或者颜色数组)"
        form={form}
        data={style}
        formItemLayout={formItemLayout}
        disabled={!isCustomColor}
      />
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

    const finalFields = { ...style, ...newFields };
    console.log(finalFields);

    updateStyle(finalFields);
  },
})(GraphColor);

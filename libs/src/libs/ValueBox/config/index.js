// import {useState} from 'react'
import PropTypes from 'prop-types';
import { Form, InputNumber, Switch, Button } from 'antd';
import InputColor from '../../../components/InputColor';
import CustomizeList from '../../../components/CustomizeLimit';
const FormItem = Form.Item;
function ValueBoxConf(props) {
  const {
    form: { getFieldDecorator },
    style,
    updateStyle,
  } = props;

  const handleAdd = () => {
    const { PMup, AQIup } = Array.isArray(style.limit) ? style.limit[style.limit.length - 1] : {};
    updateStyle({
      ...style,
      limit: Array.isArray(style.limit)
        ? [
            ...style.limit,
            {
              PMdown: PMup,
              PMup: Number(PMup) + 10,
              AQIdown: AQIup,
              AQIup: Number(AQIup) + 10,
              PMColor: '',
              AQIColor: '',
            },
          ]
        : [{ AQIdown: 0, AQIup: 10, PMdown: 0, PMup: 10, PMColor: 'green', AQIColor: 'green' }],
    });
  };

  return (
    <div>
      {/* <Form.Item label="AQI 文本">
        {getFieldDecorator('AQI', {
          initialValue: style?.AQI
        })(
          <InputNumber />
        )}
      </Form.Item> */}
      <Form.Item label="是否显示AQI">
        {getFieldDecorator('showAqi', {
          valuePropName: 'checked',
          initialValue: style?.showAqi || true,
        })(<Switch />)}
      </Form.Item>
      {/* <Form.Item label="PM2.5 文本">
        {getFieldDecorator('pm', {
          initialValue: style?.pm
        })( <InputNumber /> )}
      </Form.Item> */}
      <Form.Item label="是否显示PM2.5">
        {getFieldDecorator('showPm', {
          valuePropName: 'checked',
          initialValue: style?.showPm || true,
        })(<Switch />)}
      </Form.Item>
      <FormItem label="字体大小">
        {getFieldDecorator('fontSize', {
          initialValue: style?.fontSize || 30,
        })(<InputNumber />)}
      </FormItem>
      <Form.Item label="是否开启自定义颜色设置">
        {getFieldDecorator('isCustomizs', {
          valuePropName: 'checked',
          initialValue: style?.isCustomizs,
        })(<Switch />)}
      </Form.Item>
      {!style.isCustomizs ? (
        <>
          <Form.Item label="字体颜色">
            {/* <InputColor onBlur={color => onChange('color', color)} /> */}
            {getFieldDecorator('color')(<InputColor />)}
          </Form.Item>
          <Form.Item label="背景颜色">
            {getFieldDecorator('backgroundColor')(<InputColor />)}
          </Form.Item>
          {/* <FormItem label="背景色长度">
            {getFieldDecorator('width')(
              <InputNumber />
            )}
          </FormItem> */}
        </>
      ) : (
        <>
          {Array.isArray(style.limit) &&
            (style.limit || []).map((item, idx) => {
              return (
                <FormItem key={Math.random()} label={`自定义规则${idx + 1}`}>
                  {getFieldDecorator(`limit[${idx}]`, {
                    initialValue: item || {},
                  })(<CustomizeList />)}
                </FormItem>
              );
            })}

          <Form.Item>
            <Button type="primary" onClick={handleAdd}>
              +添加
            </Button>
          </Form.Item>
        </>
      )}
    </div>
  );
}

ValueBoxConf.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
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
})(ValueBoxConf);

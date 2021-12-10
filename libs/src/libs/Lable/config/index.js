import PropTypes from 'prop-types';
import { Form, InputNumber, Input, Select, Button, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';
import CustomizeColor from '../../../components/CustormizeColor/formItem';

const { Panel } = Collapse;

const FormItem = Form.Item;
function LableConfig(props) {
  const {
    form: { getFieldDecorator },
    style,
    updateStyle,
  } = props;

  const randomRGBA = () => {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let a = Math.random().toFixed(1);
    return `rgba(${r},${g},${b},${a})`;
  };

  const handleAdd = () => {
    const { up } = Array.isArray(style.custormizColor)
      ? style.custormizColor[style.custormizColor.length - 1]
      : {};
    updateStyle({
      ...style,
      custormizColor: Array.isArray(style.custormizColor)
        ? [
            ...style.custormizColor,
            {
              down: up,
              up: Number(up) + 10,
              color: '',
              bgcolor: '',
              borderWidth: 0,
              borderColor: 'rgba(1,173,1,1)',
              CNText: '',
              ENText: '',
            },
          ]
        : [
            {
              down: 0,
              up: 10,
              color: 'rgba(255,255,255,1)',
              bgcolor: randomRGBA(),
              borderWidth: 0,
              borderColor: 'rgba(1,173,1,1)',
              CNText: '',
              ENText: '',
            },
          ],
    });
  };

  return (
    <div>
      <Collapse>
        <Panel header="基础配置" key="基础配置">
          <FormItem label="宽">
            {getFieldDecorator('width', {
              initialValue: style?.width || 70,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="高">
            {getFieldDecorator('height', {
              initialValue: style?.height || 30,
            })(<InputNumber />)}
          </FormItem>
          <Form.Item label="文本(中文)">
            {getFieldDecorator('text', {
              initialValue: style?.CNText,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="文本(英文)">
            {getFieldDecorator('enText', {
              initialValue: style?.ENText,
            })(<Input />)}
          </Form.Item>
          <FormItem label="字体大小">
            {getFieldDecorator('fontSize', {
              initialValue: style?.fontSize || 14,
            })(<InputNumber />)}
          </FormItem>
          <Form.Item label="默认字体颜色">
            {getFieldDecorator('color', {
              initialValue: style?.color || '#333',
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="默认背景颜色">
            {getFieldDecorator('backgroundColor', {
              initialValue: style?.backgroundColor || '#e0e0e0',
            })(<InputColor />)}
          </Form.Item>
          <FormItem label="圆角">
            {getFieldDecorator('borderRadius', {
              initialValue: style?.borderRadius || 0,
            })(<InputNumber />)}
          </FormItem>
          {/* <FormItem label="圆角颜色">
            {getFieldDecorator('RadiusColor', {
              initialValue: style?.RadiusColor,
            })(<InputColor />)}
          </FormItem> */}
          <FormItem label="内容对齐方式">
            {getFieldDecorator('textAlign', {
              initialValue: style?.textAlign || 'center',
            })(
              <Select style={{ width: '110px' }}>
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="center">居中对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
              </Select>,
            )}
          </FormItem>
        </Panel>

        <Panel header="动态配置" key="动态配置">
          {Array.isArray(style?.custormizColor) &&
            (style.custormizColor || []).map((item, idx) => {
              return <CustomizeColor key={idx} {...props} index={idx} />;
            })}

          <Form.Item>
            <Button type="primary" onClick={handleAdd}>
              +添加颜色设置
            </Button>
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
}

LableConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: props => {
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
})(LableConfig);

import { Form, Collapse, InputNumber } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../../components/InputColor';

const { Panel } = Collapse;

const WaterPoloConfig = props => {
  const {
    style,
    form: { getFieldDecorator },
  } = props;
  const {
    radius = 80,
    liquidColor,
    bgColor = '#dff6ff',
    fontSize = 40,
    defaultFontColor = '#D0021B',
    fontColor = '#7ED321',

    borderWidth = 6,
    borderColor = '#206E7B',
    shadowBlur = 0,
    shadowColor = 'rgba(255, 255, 255, 1)',
    borderDistance = 5,
  } = style;

  return (
    <Collapse accordion>
      <Panel header="相对宽度">
        <Form.Item>
          {getFieldDecorator('radius', {
            initialValue: radius,
          })(<InputNumber max={100} step={5} style={{ width: '100%' }} />)}
        </Form.Item>
      </Panel>

      <Panel header="流体颜色">
        <Form.Item>
          {getFieldDecorator('liquidColor', {
            initialValue: liquidColor,
          })(<InputColor />)}
        </Form.Item>
      </Panel>

      <Panel header="流体内样式" key="ballStyles">
        <Form.Item label="流体内背景颜色" style={{ marginBottom: 0 }}>
          {getFieldDecorator('bgColor', {
            initialValue: bgColor,
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="字体大小" style={{ marginBottom: 0 }}>
          {getFieldDecorator('fontSize', {
            initialValue: fontSize,
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="默认字体颜色" style={{ marginBottom: 0 }}>
          {getFieldDecorator('defaultFontColor', {
            initialValue: defaultFontColor,
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="流体内字体颜色" style={{ marginBottom: 0 }}>
          {getFieldDecorator('fontColor', {
            initialValue: fontColor,
          })(<InputColor />)}
        </Form.Item>
      </Panel>

      <Panel header="边框样式" key="borderStyles">
        <Form.Item label="边框宽度" style={{ marginBottom: 0 }}>
          {getFieldDecorator('borderWidth', {
            initialValue: borderWidth,
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="边框颜色" style={{ marginBottom: 0 }}>
          {getFieldDecorator('borderColor', {
            initialValue: borderColor,
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="边框阴影范围" style={{ marginBottom: 0 }}>
          {getFieldDecorator('shadowBlur', {
            initialValue: shadowBlur,
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="边框阴影颜色" style={{ marginBottom: 0 }}>
          {getFieldDecorator('shadowColor', {
            initialValue: shadowColor,
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="边框留白" style={{ marginBottom: 0 }}>
          {getFieldDecorator('borderDistance', {
            initialValue: borderDistance,
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>
      </Panel>
    </Collapse>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
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
  }, 500),
})(WaterPoloConfig);

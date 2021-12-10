import { forwardRef } from 'react';
import { InputNumber, Row, Col, Input, Form } from 'antd';
import InputColor from '../InputColor';

function CustomizeColor(props) {
  const { form, index, style } = props;
  const { custormizColor } = style;
  const { getFieldDecorator } = form;

  return (
    <div>
      <Row gutter={[5, 5]}>
        {/* <span>阈值：</span> */}
        <Col span={11}>
          <Form.Item>
            {getFieldDecorator(`custormizColor[${index}].down`, {
              initialValue: custormizColor[index].down || 0,
            })(<InputNumber style={{ width: '50px' }} min={0} />)}
          </Form.Item>
        </Col>

        <Col span={2}>至</Col>

        <Col span={11}>
          <Form.Item>
            {getFieldDecorator(`custormizColor[${index}].up`, {
              initialValue: custormizColor[index].up || 10,
            })(<InputNumber style={{ width: '50px' }} min={0} />)}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={'文本内容(中)'}>
        {getFieldDecorator(`custormizColor[${index}].CNText`, {
          initialValue: custormizColor[index].CNText || undefined,
        })(<Input />)}
      </Form.Item>

      <Form.Item label={'文本内容(英)'}>
        {getFieldDecorator(`custormizColor[${index}].ENText`, {
          initialValue: custormizColor[index].ENText || undefined,
        })(<Input />)}
      </Form.Item>

      <Form.Item label={'请选择字体颜色'}>
        {getFieldDecorator(`custormizColor[${index}].color`, {
          initialValue: custormizColor[index].color || 'rgba(255,255,255,1)',
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label={'请选择背景色颜色'}>
        {getFieldDecorator(`custormizColor[${index}].bgcolor`, {
          initialValue: custormizColor[index].bgcolor || 'rgba(1,173,1,1)',
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label={'请选择边框颜色'}>
        {getFieldDecorator(`custormizColor[${index}].borderColor`, {
          initialValue: custormizColor[index].borderColor || 'rgba(1,173,1,1)',
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label={'边框粗细'}>
        {getFieldDecorator(`custormizColor[${index}].borderWidth`, {
          initialValue: custormizColor[index].borderWidth || 0,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <div
        style={{ marginTop: 20, marginBottom: 20, background: '#000', height: 1, width: '100%' }}
      />
    </div>
  );
}

const CustomizeColorComp = forwardRef((props, ref) => <CustomizeColor {...props} />);

export default CustomizeColorComp;

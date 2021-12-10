import { forwardRef, useState, useEffect } from 'react';
import { InputNumber, Row, Col, Input } from 'antd';
import InputColor from '../InputColor';

function CustomizeColor(props) {
  const { value = {}, onChange } = props;
  const { CNText, ENText, color } = value;
  const [cntext, setCNText] = useState(CNText || '');
  const [entext, setENText] = useState(ENText || '');

  const textBlur = () => {
    onChange({ ...value, CNText: cntext, ENText: entext });
  };

  useEffect(() => {
    setCNText(cntext);
    setENText(entext);
  }, [cntext, entext, onChange, value]);

  return (
    <div>
      <Row gutter={[5, 5]}>
        {/* <span>阈值：</span> */}
        <Col span={11}>
          <InputNumber
            style={{ width: '50px' }}
            min={0}
            value={value.down}
            onBlur={ev => onChange({ ...value, down: ev.target.value })}
          />
        </Col>
        <Col span={2}>
          <span>至</span>
        </Col>
        <Col span={11}>
          <InputNumber
            style={{ width: '50px' }}
            min={0}
            value={value.up}
            onBlur={ev => onChange({ ...value, up: ev.target.value })}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <span>文本内容(中)：</span>
          <Input value={cntext} onChange={ev => setCNText(ev.target.value)} onBlur={textBlur} />
        </Col>
      </Row>
      <Row>
        <Col>
          <span>文本内容(英)：</span>
          <Input value={entext} onChange={ev => setENText(ev.target.value)} onBlur={textBlur} />
        </Col>
      </Row>
      <Row>
        <Col>
          <span>字体颜色</span>
          <InputColor
            placeholder="请选择字体颜色"
            value={color}
            onChange={color => onChange({ ...value, color })}
          />
        </Col>
        <Col>
          <span>背景色颜色</span>
          <InputColor
            placeholder="请选择背景色颜色"
            value={value.bgcolor}
            onChange={bgcolor => onChange({ ...value, bgcolor })}
          />
        </Col>
        <div style={{ paddingTop: 20, borderBottom: '1px solid #000' }}></div>
      </Row>
    </div>
  );
}

const CustomizeColorComp = forwardRef((props, ref) => <CustomizeColor {...props} />);

export default CustomizeColorComp;

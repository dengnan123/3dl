import { forwardRef } from 'react'
import { InputNumber, Row, Col } from 'antd'
import InputColor from '../InputColor'

function Customize(props) {
  const {value={}, onChange} = props
  return (
    <div>
      <Row gutter={[5, 5]}>
        <Col>
          <span>PM2.5阈值：</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.PMdown} onBlur={ev => onChange({...value, PMdown: ev.target.value})}/>
          <span>至</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.PMup}  onBlur={ev => onChange({...value, PMup: ev.target.value})}/>
        </Col>
        
      </Row>
      <Row>
        <Col>
        < span>请选择PM2.5颜色</span>
          <InputColor placeholder='请选择PM2.5颜色'  value={value.PMColor} onChange={PMColor => onChange({...value, PMColor})} />
        </Col>
      </Row>
      <Row gutter={[5, 5]}>
        <Col>
          <span>AQI阈值：</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.AQIdown} onBlur={ev => onChange({...value, AQIdown: ev.target.value})}/>
          <span>至</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.AQIup}  onBlur={ev => onChange({...value, AQIup: ev.target.value})}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>请选择AQI颜色</span>
          <InputColor placeholder='请选择AQI颜色' value={value.AQIColor} onChange={AQIColor => onChange({...value, AQIColor})} />
        </Col>
      </Row>
    </div>
    
  )
}

const CustomizeComp = forwardRef((props, ref) => <Customize {...props} />)

export default CustomizeComp

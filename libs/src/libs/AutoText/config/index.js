import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Select, Button, Row, Col } from 'antd'
import InputColor from '../../../components/InputColor'
const AutoCusmize = React.forwardRef(props => <AutoCusText {...props}/>)
const FormItem = Form.Item
function AutoTextConf(props) {
  const {form: {getFieldDecorator}, style, updateStyle } = props


  const handleAdd = () => {
    const {up} = Array.isArray(style.custormizColor) ? style.custormizColor[style.custormizColor.length - 1] : {}
    updateStyle({
      ...style,
      custormizColor: Array.isArray(style.custormizColor) ? [...style.custormizColor, {down: up, up: Number(up)+10, color: ''}]: [{down: 0, up: 10, color: '#333'}]
    })
  }
  
  return (
    <div>
      {/* <FormItem label="宽">
        {getFieldDecorator('width', {
          initialValue: style?.width || 70
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="高">
        {getFieldDecorator('height', {
          initialValue: style?.height || 30
        })(<InputNumber />)}
      </FormItem> */}
      <FormItem label="字体大小">
        {getFieldDecorator('fontSize', {
          initialValue: style?.fontSize || 14
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="对齐方式">
        {getFieldDecorator('textAlign', {
          initialValue: style?.textAlign || 'center'
        })(
          <Select style={{width: '110px'}}>
            <Select.Option value="left">左对齐</Select.Option>
            <Select.Option value="center">居中对齐</Select.Option>
            <Select.Option value="right">右对齐</Select.Option>
          </Select>
        )}
        
      </FormItem>
      
      {
        Array.isArray(style?.custormizColor) && style.custormizColor.map((item, idx) => {
          return (
            <FormItem key={Math.random()} label={`自定义颜色规则${idx+1}`}>
              {getFieldDecorator(`custormizColor[${idx}]`, {
                initialValue: item || {},
              })(<AutoCusmize />)}
            </FormItem>
          )
        })
      }
          
      <Form.Item>
        <Button type="primary" onClick={handleAdd}>
          +添加颜色设置
        </Button>
      </Form.Item>

    </div>
  )
}

AutoTextConf.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object
}

// const prefix = ['fontSize', 'borderRadius']
export default Form.create({
  onFieldsChange: (props) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields
    });
  },
})(AutoTextConf)



function AutoCusText(props) {
  const {value, onChange} = props
  return (
    <div>
      <Row gutter={[5, 5]}>
        <Col>
          <span>阈值：</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.down} onBlur={ev => onChange({...value, down: ev.target.value})}/>
          <span>至</span>
          <InputNumber style={{width: '50px'}} min={0} value={value.up}  onBlur={ev => onChange({...value, up: ev.target.value})}/>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>字体颜色</span>
          <InputColor placeholder='请选择字体颜色'  value={value.color} onBlur={color => onChange({...value, color})} />
        </Col>
      </Row>
    </div>
  )
}
import PropTypes from 'prop-types'
import { Form, InputNumber, Select } from 'antd'
import InputColor from '../../../components/InputColor'
const FormItem = Form.Item
function MarqueeConf(props) {
  const {updateStyle } = props

  // const onChangeTime = value => {
  //   updateStyle(pre => {
  //     return {
  //       ...pre,
  //       time: value
  //     }
  //   })
  // }

  // const onChangeDistanice = value => {
  //   updateStyle(pre => {
  //     return {
  //       ...pre,
  //       distanice: value
  //     }
  //   })
  // }

  const onChange = (key, value, unit) => {
    updateStyle(pre => {
      return {
        ...pre,
        [key]: `${value}${unit? unit: ''}`
      }
    })
  }

  return (
    <div>
      {/* <FormItem label="时间">
        <InputNumber defaultValue={300} onChange={onChangeTime}/>
      </FormItem>
      <FormItem label="距离">
        <InputNumber defaultValue={10} onChange={onChangeDistanice}/>
      </FormItem> */}
      {/* <FormItem label="时间"></FormItem> */}
      <FormItem label="容器 宽">
        <InputNumber defaultValue={700} onChange={width => onChange('containerWidth', width, 'px')}/>
      </FormItem>
      <FormItem label="容器 高">
        <InputNumber defaultValue={400} onChange={height => onChange('containerHeight', height,  'px')}/>
      </FormItem>
      <Form.Item label="容器 背景颜色">
        <InputColor onBlur={backgroundColor => onChange('containerBackgroundColor', backgroundColor)} />
      </Form.Item>
      <FormItem label="Item 宽">
        <InputNumber defaultValue={70} onChange={width => onChange('width', width, 'px')}/>
      </FormItem>
      <FormItem label="Item 高">
        <InputNumber defaultValue={30} onChange={height => onChange('height', height,  'px')}/>
      </FormItem>
      {/* <Form.Item label="文本">
        <Input value="文本" onChange={event => onChange('text', event.target.value)} />
      </Form.Item> */}
      <FormItem label="字体大小">
        <InputNumber defaultValue={14} onChange={fontSize => onChange('fontSize', fontSize, 'px')}/>
      </FormItem>
      <Form.Item label="字体颜色">
        <InputColor onBlur={color => onChange('color', color)} />
      </Form.Item>
      <Form.Item label="背景颜色">
        <InputColor onBlur={backgroundColor => onChange('backgroundColor', backgroundColor)} />
      </Form.Item>
      <FormItem label="圆角">
        <InputNumber defaultValue={0} onChange={borderRadius => onChange('borderRadius', borderRadius, 'px')}/>
      </FormItem>
      <FormItem label="对齐方式">
        <Select style={{width: '110px'}} defaultValue="center" onChange={textAlign => onChange('textAlign', textAlign)}>
          <Select.Option value="left">左对齐</Select.Option>
          <Select.Option value="center">居中对齐</Select.Option>
          <Select.Option value="right">右对齐</Select.Option>
        </Select>
      </FormItem>
    </div>
  )
}

MarqueeConf.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object
}

export default Form.create()(MarqueeConf)
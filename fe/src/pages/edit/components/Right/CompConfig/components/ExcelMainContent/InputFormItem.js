import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber } from 'antd'
import { debounce } from 'lodash'

function InputFormItem(props) {
  const { formValue, isFirstRow, isFirstCol, onItemChange } = props

  const onChange = value => {
    onItemChange && onItemChange(value)
  }

  if (isFirstRow && isFirstCol) {
    return ''
  }

  if (isFirstRow || isFirstCol) {
    return <Input value={formValue} onChange={e => onChange(e.target.value)} />
  }

  return <InputNumber value={formValue} onChange={debounce(val => onChange(val), 200)} />
}

InputFormItem.propTypes = {
  formValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFirstRow: PropTypes.bool,
  isFirstCol: PropTypes.bool,
  onItemChange: PropTypes.func
}

export default InputFormItem

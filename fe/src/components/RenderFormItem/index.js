import { Form, Input, InputNumber, Select, Switch } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { getLocale } from 'umi-plugin-react/locale'
import { getRenderList } from './util'
import styles from './index.less'
const { Option } = Select
const { TextArea } = Input
const isEn = getLocale() === 'en-US'

const labelSpan = isEn ? 5 : 4

const delFormItemLayout = {
  labelCol: { span: labelSpan },
  wrapperCol: { span: 24 - labelSpan }
}

const getMessage = ({ renderItemType, message }) => {
  if (renderItemType === 'Select') {
    return `请选择${message}`
  }
  return `请填写${message}`
}

const getItem = ({ renderItemProps, renderItemType }) => {
  const obj = {
    Input: <Input className="inputStyle" {...renderItemProps} />,
    InputNumber: <InputNumber className="inputStyle" {...renderItemProps} />,
    Select: (
      <Select className="inputStyle" {...renderItemProps}>
        {(renderItemProps.dataSource || []).map(v => {
          return (
            <Option key={v.id} value={v.id}>
              {v[renderItemProps.showValueKey]}
            </Option>
          )
        })}
      </Select>
    ),
    Switch: <Switch {...renderItemProps} />,
    TextArea: <TextArea {...renderItemProps} />
  }
  if (obj[renderItemType]) {
    return obj[renderItemType]
  }
  return ''
}

function RenderFormItem({ formFileds = {}, getFieldDecorator, formItemLayout = delFormItemLayout, type, col = 999 }) {
  const fileds = Object.keys(formFileds)
  if (!fileds.length) {
    return
  }

  const newRenderList = getRenderList({
    fileds,
    col
  })

  return (
    <div className={styles.container}>
      {newRenderList.map((item, index) => {
        return (
          <div key={index}>
            {item.map(v => {
              const value = formFileds[v]
              const { renderItemType, renderItemProps = {}, label, disabled } = value

              const message = getMessage({
                renderItemType,
                message: label
              })
              const obj = {
                rules: [
                  {
                    required: value.required,
                    message
                  }
                ],
                initialValue: value.initialValue
              }
              if (value.valuePropName) {
                obj.valuePropName = value.valuePropName
              }
              let newRenderItemProps = {
                ...renderItemProps,
                placeholder: message
              }
              if (type === 'detail' || disabled) {
                newRenderItemProps.disabled = true
                newRenderItemProps.placeholder = ''
              }
              const RenderItem = getItem({
                renderItemType,
                renderItemProps: newRenderItemProps
              })
              return (
                <Form.Item key={v} label={value.label} {...formItemLayout}>
                  {getFieldDecorator(v, obj)(RenderItem)}
                </Form.Item>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

RenderFormItem.propTypes = {
  formItemLayout: PropTypes.object,
  detailFileds: PropTypes.object,
  col: PropTypes.number,
  getFieldDecorator: PropTypes.func,
  formFileds: PropTypes.object,
  type: PropTypes.string
}

export default RenderFormItem

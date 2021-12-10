import { Form } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import { getRenderList } from '../../helpers/view'

const delFormItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 }
}

function RenderItem({ detailFileds = {}, formItemLayout = delFormItemLayout, col = 9999 }) {
  const fileds = Object.keys(detailFileds)
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
              const value = detailFileds[v]
              const { label, initialValue, render } = value

              if (render) {
                return render()
              }
              return (
                <Form.Item label={label} key={v}>
                  <span>{initialValue}</span>
                </Form.Item>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

RenderItem.propTypes = {
  formItemLayout: PropTypes.object,
  detailFileds: PropTypes.object,
  col: PropTypes.number
}

export default RenderItem

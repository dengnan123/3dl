import React from 'react'
import { Cascader } from 'antd'
import { filterEmitParamsByProps, PROPTYPES } from '../const'

/**
 * 级联选择器
 * @param {*} param
 */
function CascaderFilter({ column, onFilterChange, onFilterSearch }) {
  const { title, filterProps } = column
  const onChange = (value, selectedOptions) => {
    const emitParams = filterEmitParamsByProps(value, column)
    onFilterChange(emitParams)
    onFilterSearch(emitParams)
  }
  const { options, inputProps, ...otherProps } = filterProps || {}
  return <Cascader placeholder={title} onChange={onChange} options={options} {...otherProps} />
}
CascaderFilter.propTypes = PROPTYPES

export default CascaderFilter

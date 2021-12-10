import React, { useCallback } from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'
import { filterEmitParamsByProps, PROPTYPES } from '../const'

const { MonthPicker } = DatePicker
/**
 * 日期选择器
 * @param {*} param
 */
function MonthDateFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps, title } = column
  const onChange = useCallback(
    (date, dateString) => {
      const filterValue = date ? moment(date).format('YYYY-MM') : ''
      const emitParams = filterEmitParamsByProps(filterValue, column)
      onFilterSearch(emitParams)
    },
    [column, onFilterSearch]
  )
  const { type, ...otherProps } = filterProps || {}
  return (
    <MonthPicker
      // getCalendarContainer={trigger => trigger.parentNode}
      placeholder={title}
      style={{ minWidth: 120 }}
      onChange={onChange}
      {...otherProps}
    />
  )
}
MonthDateFilter.propTypes = PROPTYPES

export default MonthDateFilter

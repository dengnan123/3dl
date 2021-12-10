import React, { useCallback, useState, useEffect } from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'
import { filterEmitParamsByProps, PROPTYPES } from '../const'

/**
 * 年选择器
 * @param {*} param
 */
function YearDateFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps, title } = column
  const { type, defaultValue, ...otherProps } = filterProps || {}
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState()

  const onPanelChange = useCallback(
    (value, mode) => {
      const filterValue = value ? moment(value).format('YYYY') : ''
      const emitParams = filterEmitParamsByProps(filterValue, column)
      onFilterSearch(emitParams)
      setOpen(false)
      setValue(value)
    },
    [column, onFilterSearch]
  )
  const onOpenChange = useCallback(status => {
    setOpen(status)
  }, [])

  useEffect(() => {
    if (defaultValue) {
      const filterValue = defaultValue ? moment(defaultValue).format('YYYY') : ''
      const emitParams = filterEmitParamsByProps(filterValue, column)
      onFilterChange(emitParams)
    }
    setValue(defaultValue)
  }, [column, defaultValue, onFilterChange])

  return (
    <DatePicker
      placeholder={title}
      mode="year"
      format="YYYY"
      value={value}
      style={{ minWidth: 120 }}
      onPanelChange={onPanelChange}
      onOpenChange={onOpenChange}
      onChange={onPanelChange}
      open={open}
      {...otherProps}
    />
  )
}
YearDateFilter.propTypes = PROPTYPES

export default YearDateFilter

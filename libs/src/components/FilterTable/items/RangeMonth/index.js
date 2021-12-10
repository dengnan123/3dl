import React, { useCallback, useState } from 'react'
import { DatePicker } from 'antd'
import { filterRangeDateEmitParamsByProps, PROPTYPES } from '../const'
import styles from '../../index.less'

const { RangePicker } = DatePicker

/**
 * 月度范围选择器
 * @param {*} param
 */
function RangeMonthFilter({ column, onFilterChange, onFilterSearch }) {
  const { filterProps } = column
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(filterProps?.defaultValue || [])
  const onChange = useCallback(
    (dates, dateStrings) => {
      const emitParams = filterRangeDateEmitParamsByProps(dateStrings, column)
      setValue(dates)
      onFilterSearch(emitParams)
    },
    [column, setValue, onFilterSearch]
  )
  const handleOpenChange = useCallback(type => setOpen(type), [setOpen])
  const handlePanelChange = useCallback(
    (dates, mode) => {
      if (mode[1] === 'date') {
        let parsedDateStrings = []
        const [start, end] = dates
        if (!start || !end) {
          parsedDateStrings = null
        } else {
          parsedDateStrings = [start.startOf('days'), end.endOf('days')]
        }
        const emitParams = filterRangeDateEmitParamsByProps(parsedDateStrings, column, 'YYYY-MM')
        setOpen(false)
        setValue(dates)
        onFilterSearch(emitParams)
      }
    },
    [column, setValue, setOpen, onFilterSearch]
  )
  const { type, ...otherProps } = filterProps || {}
  return (
    <RangePicker
      value={value}
      open={open}
      mode={['month', 'month']}
      onChange={onChange}
      onPanelChange={handlePanelChange}
      onOpenChange={handleOpenChange}
      {...otherProps}
      className={styles.range}
    />
  )
}
RangeMonthFilter.propTypes = PROPTYPES

export default RangeMonthFilter

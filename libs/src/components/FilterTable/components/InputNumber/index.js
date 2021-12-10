import React, { useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

const valids = [null, '.', '-']

function transformNumber(number) {
  if (!number && number !== 0) return number
  if (isNaN(Number(number))) {
    return ''
  }
  // 清除已小数点结尾的数
  return String(number).replace(/[.]$/, '')
}
/**
 * 过滤负数符号  -
 * @param {*} data
 * @param {*} isInteger
 * @returns
 */
function replaceMinus(data, isInteger) {
  // 过滤 - 符号
  return (data || '').replace(/\-?/g, ($1, index) => {
    console.log('replaceMinus', $1)
    if (isInteger) return ''
    if (index === 0) return $1
    return ''
  })
}
/**
 * 过滤小数点  -
 * @param {*} data
 * @param {*} isInteger
 * @returns
 */
function replaceDecimals(data, isInteger) {
  // 过滤 . 符号
  let isExist = false
  const r = (data || '').replace(/[.]/g, $1 => {
    if (isInteger) return ''
    if (!isExist) {
      isExist = true
      return $1
    }
    return ''
  })
  console.log('r======', r)
  return r
}

function NumberInput(props) {
  const { value, onChange, onSearch, placeholder, integer, max, min, precision, ...otherProps } = props
  const isComposition = useRef(false)

  const formatNumber = useCallback(
    value => {
      // 过滤非数字
      let formatValue = (value || '').replace(/[^\d.-]/g, '')
      // 过滤 - 符号
      formatValue = replaceMinus(formatValue, integer)
      // 过滤 . 符号
      formatValue = replaceDecimals(formatValue, integer)
      // 小数位数
      if (precision) {
        formatValue = Number(formatValue).toFixed(precision)
      }
      // 最大值
      if (Number(max) && Number(formatValue) > max) {
        formatValue = max
      }
      // 最小值
      if (Number(min) && Number(formatValue) < min) {
        formatValue = min
      }
      // setInputValue(formatValue)
      onChange && onChange(formatValue)
    },
    [integer, max, min, onChange, precision]
  )
  const onChangeValue = useCallback(
    event => {
      const { value } = event.target
      let formatValue = ''
      let fixedNumber = precision
      let reg = ''
      if (fixedNumber === 2) {
        reg = /^(\-)*(\d+)\.(\d\d).*$/
      } else {
        reg = /^(\-)*(\d+)\.(\d+).*$/
      }
      if (!isNaN(Number(value)) && !isNaN(value)) {
        formatValue = value.replace(reg, '$1$2.$3')
      } else {
      }
      onChange && onChange(formatValue)
      if (integer) {
        formatNumber(formatValue)
      }
    },
    [formatNumber, integer, onChange, precision]
  )
  const onSearchValue = useCallback(
    value => {
      const transform = transformNumber(value)
      if (!transform === value) {
        onChange && onChange(transform)
      }
      onSearch && onSearch(transform)
    },
    [onChange, onSearch]
  )
  const onBlur = useCallback(
    event => {
      const value = event.target.value
      const transform = transformNumber(value)
      if (transform !== value) {
        onChange && onChange(transform)
      }
    },
    [onChange]
  )

  const onInput = useCallback(
    event => {
      const { data, target } = event.nativeEvent
      // 中文输入问题
      if (isComposition.current) {
        return onChange(target.value)
      }
      if (valids.includes(data) || /^\d*$/g.test(data)) {
        console.log('onInput====', target.value)
        formatNumber(target.value)
      }
    },
    [formatNumber, onChange]
  )
  const onCompositionStart = useCallback(event => {
    isComposition.current = true
  }, [])
  const onCompositionEnd = useCallback(
    event => {
      isComposition.current = false
      const { target } = event.nativeEvent
      formatNumber(target.value)
    },
    [formatNumber]
  )

  const RenderInput = useMemo(() => {
    if (onSearch) return Input.Search
    else return Input
  }, [onSearch])

  return (
    <RenderInput
      placeholder={placeholder}
      onChange={onChangeValue}
      onSearch={onSearchValue}
      value={value}
      onInput={onInput}
      onBlur={onBlur}
      onCompositionEnd={onCompositionEnd}
      onCompositionStart={onCompositionStart}
      {...otherProps}
    />
  )
}
NumberInput.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.any,
  integer: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  precision: PropTypes.number
}

export default React.forwardRef((props, ref) => <NumberInput {...props} iref={ref} />)

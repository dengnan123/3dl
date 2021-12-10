import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

function AutoText(props) {
  const { style = {}, data={} } = props
  const { custormizColor,  borderRadius, textAlign='center', fontSize='14', color='#333' } = style
  const [textColor, setTextColor] = useState(color)
  useEffect(() => {
    if(Array.isArray(custormizColor) && custormizColor.length >0) {
      custormizColor.forEach(item => {
        if(data.value >= item.down && data.value <= item.up) {
          setTextColor(() => item.color)
        }
      })
    }
  }, [custormizColor, data.value])

  useEffect(() => {
    setTextColor(() => color)
  }, [color])

  return (
    <div className={styles.container} style={{borderRadius, textAlign, fontSize, color: textColor}} >
      {data.value}
    </div>
  )
}

AutoText.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object
}

export default AutoText
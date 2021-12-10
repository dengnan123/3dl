import {useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

function StatusBox(props) {
  const { style = {}, data=[]} = props

  const [padding, setPadding] = useState({})

  useEffect(() => {
    if (style.Padding) {
      let Padding = {}
      for(const key in style.Padding) {
        Padding[key] = style.Padding[key] + 'px'
      }
      setPadding(() => Padding)
    }
  }, [style.Padding])

  return (
    <div 
      className={styles.container}
      style={{
        width: style.boxWidth,
        height: style.boxHeight,
        backgroundColor: style.boxBgColor,
        borderRadius: style.radius,
        ...padding,
        ...style.border
      }}
    >
      {
        Array.isArray(data) && data.map((item, idx) => {
          return (
            <div
              className={styles.boxItem}
              key={Math.random()}
              style={{
                width: style.ItemWidth,
                height: style.ItemHeight,
                color: style.itemEmptyColor,
                marginRight: style.rightDistance,
                marginBottom: style.Bottomdistance
              }}
              dangerouslySetInnerHTML={{ __html: item.isFull === 1 ? style.fullSvg: style.emptySvg }}
            />
          )
        })
      }
      
    </div>
  )
}

StatusBox.propTypes = {
  style: PropTypes.object,
  data: PropTypes.array
}

export default StatusBox


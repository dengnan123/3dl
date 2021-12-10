import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

function Marquee(props) {
  const { style = {}, data=[] } = props
  const [transition, settransition] = useState('transform 300ms linear')
  const { containerWidth='700px', containerHeight='400px' ,containerBackgroundColor='#e5e5e5', ...others } = style
  const distanice=10
  const delay=300

  const ulRef = useRef()
  const Timer = useRef(null)
  const containerRef = useRef()
  const [scrollTop, setScrollTop] = useState(0)


  useEffect(() => {
    if (!Array.isArray(data) || data.length < 1) return
    if(Timer.current) {
      clearInterval(Timer.current)
      Timer.current = null
    }
    const UlHeight = ulRef.current.clientHeight
    Timer.current = setInterval(() => {
      if(Math.abs(scrollTop) - UlHeight >= parseInt(containerHeight) ) {
        settransition('none')
        setScrollTop(0)
      }else {
        settransition('transform 300ms linear')
        setScrollTop(pre => {
          return pre-distanice
        })
      }
      
    }, delay)
    return () => {
      if(Timer.current) {
        clearInterval(Timer.current)
      }
    }
  },[containerHeight, data, scrollTop])


  return (
    <div ref={containerRef} style={{width: containerWidth, height: containerHeight, backgroundColor: containerBackgroundColor}} className={styles.container}>
      <ul ref={ulRef} style={{transform: `translate3d(0,${scrollTop}px, 0)`, transition, width: '100%'}}>
        {Array.isArray(data) && data.map((item, index) => {
          return <li style={{...others}} key={index+item.text}>{item.text}</li>
        })}
      </ul>
    </div>
  )
}

Marquee.propTypes = {
  style: PropTypes.object,
  data: PropTypes.array
}

export default Marquee


import {useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

function ValueBox(props) {
  const { style = {}, data={} } = props
  const {AQI, PM2} = data
  const { fontSize='30', color, backgroundColor, showAqi=true, showPm=true, isCustomizs, limit} = style
  const [AQIColors, setAQIColor] = useState(color)
  const [PmBgColors, setPmBgColor] = useState(backgroundColor)
  const [PMColors, setPMColor] = useState(backgroundColor)
  const [PMwidth, setPMWidth] = useState(10)
  const [AQIwidth, setAQIWidth] = useState(10)
  useEffect(() => {
    setPMWidth(() => {
      // if(PM2 < 35) {
      //   return (PM2/75)*100
      // }
      // if(PM2>= 35 && PM2 < 75) {
      //   return 60
      // }
      let per = (PM2/75)*100
      if (PM2 <= 75 && per > 81) {
        per = 82
      }
      
      return per > 100 ? 100 : per
    })
    setAQIWidth(() => {
      // if(AQI < 50) {
      //   return 20
      // }
      // if(AQI>= 50 && AQI <= 150) {
      //   return 60
      // }
      // return 100
      let per = (AQI/150)*100
      if (AQI=== 150) {
        per = (145/150)*100
      }
      return per > 100 ? 100 : per
    })
    if(isCustomizs && Array.isArray(limit) && limit.length > 0) {
      const len = limit.length
      for(let i=0; i< len; i++) {
        const {AQIdown, AQIup, PMdown, PMup, PMColor, AQIColor} = limit[i]
        if (AQIdown<= AQI && AQI < AQIup) {
          setAQIColor(() => AQIColor)
        }
        if (PMdown <= PM2 && PM2 < PMup) {
          setPmBgColor(() => PMColor)
          if (PM2>75) {
            setPMColor(() => '#ffffff')
          } else {
            setPMColor(() => PMColor)
          }
        }
      }
    } else {
      setAQIColor(() => color)
      setPMColor(() => backgroundColor)
    }
  }, [isCustomizs, limit, color, backgroundColor, PM2, AQI])


  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.bg} style={{width: AQIwidth+'%', backgroundColor: AQIColors}}></div>
        <div className={styles.inner}>
          <div className={styles.color} style={{backgroundColor: PmBgColors, width: PMwidth+'%'}}></div>
          <div className={styles.text} style={{color: PMColors, fontSize: fontSize+'px'}}>{showPm  ? PM2 : ''}</div>
        </div>
      </div>
      <div className={styles.lable}>
        <div className={styles.icon}></div>
        <div className={styles.text} style={{color: AQIColors, fontSize: fontSize+'px'}}>{showAqi  ? AQI : ''}</div>
      </div>
    </div>
  )
}

ValueBox.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object
}

export default ValueBox


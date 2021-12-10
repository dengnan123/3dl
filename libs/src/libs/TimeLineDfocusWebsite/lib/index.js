import { borderColor } from 'polished';
import React, {useRef, useState, useEffect} from 'react';
import { TimeDivider } from 'video-react';
import styles from '../index.less';
import arrowLeft from '../assets/arrowLeft.png'
import arrowRight from '../assets/arrowRight.png'

function TimeLine(props) {
  const { style, data=[] } = props;
  const {
    timeLineLong = 600,
    themeColor = '#005DB3',
    eventWrapperHeight = 70,
    eventWrapperWidth = 260,
    eventWrapperBg = '#EEEEEE',
    eventWrapperMargin=100,
    step=400
  } = style;

  const slider = useRef()

  const [leftPosition, setLeftPosition] = useState(0)
  useEffect(()=> {
    if (leftPosition>0) {
      setLeftPosition(0)
    }else if(leftPosition< -data.length * (eventWrapperWidth+eventWrapperMargin)){
      setLeftPosition(-data.length * (eventWrapperWidth+eventWrapperMargin))
    }
    slider.current.style.left = `${leftPosition}px`
  }, [leftPosition])

  return (
    <div className={styles.wrapper}>
      <div 
        onClick={()=> {setLeftPosition(leftPosition+step)}}
         className={styles.toLeft}
         style={{backgroundImage: `url(${arrowLeft})`}}
         >
      </div>
      <div className={styles.innerWrapper} style={{width: `${timeLineLong}px`}} >
        <div ref={slider} className={styles.line} style={{background: themeColor}}>
          {
            data.map((item, index) => {
              return (
                <>
                  {
                    index%2?(
                    <div key={item.id} className={styles.event} style={{marginLeft: eventWrapperMargin + 'px',width: eventWrapperWidth+'px'}}>
                      <div className={styles.dot} style={{borderColor: themeColor}}></div>
                      <div className={styles.time + ' '+ styles.time1} style={{color: themeColor}}>{item.time}</div>
                      <div className={styles.eventWrapper} style={{width: eventWrapperWidth+'px',backgroundColor: eventWrapperBg}}>
                        <p className={styles.eventDesc+ ' ' + styles.eventDesc1}>{item.desc}</p>
                        <h4 className={styles.eventTitle+ ' ' + styles.eventTitle1} style={{color: themeColor}}>{item.title}</h4>
                        <div className={styles.tan} style={{ borderBottomColor: eventWrapperBg}}></div>
                      </div>
                    </div>
                    ): (
                      <div key={item.id}  className={styles.event1+ ' ' + styles.event}  style={{marginLeft: eventWrapperMargin+ 'px',width: eventWrapperWidth+'px', }}>
                        <div className={styles.dot + ' ' +styles.dot1} style={{borderColor: themeColor}}></div>
                        <div className={styles.time} style={{color: themeColor}}>{item.time}</div>
                        <div className={styles.eventWrapper} style={{width: eventWrapperWidth+'px', backgroundColor: eventWrapperBg}}>
                          <h4 className={styles.eventTitle} style={{color: themeColor}}>{item.title}</h4>
                          <p className={styles.eventDesc}>
                            {item.desc}
                          </p>
                          <div className={styles.tan1} style={{ borderBottomColor: eventWrapperBg}}></div>
                        </div>
                    </div>
                    )
                  }
                </>
              )
            })
          }
        </div>
      </div>
      <div 
        onClick={()=> {setLeftPosition(leftPosition-step)}}
        className={styles.toRight}
        style={{backgroundImage: `url(${arrowRight})`}}
        >
      </div>

    </div>
  )
}

export default TimeLine;

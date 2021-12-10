import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import styles from './index.less';
import Rockets from '../assets/rokets.svg';
import Ceirk from '../assets/ceirk.svg';
import Hands from '../assets/hands.svg';
// import FST from '../assets/fst.svg';

const list = [
  {
    bgcolor: 'rgba(167, 55, 35, 0.07)',
    value: '挑战',
    tip: 'Aspiration',
    imgSrc: Rockets,
  },
  {
    bgcolor: 'rgba(167, 55, 35, 0.04)',
    value: '信赖',
    tip: 'Trust',
    imgSrc: Ceirk,
  },
  {
    bgcolor: 'rgba(167, 55, 35, 0.02)',
    value: '共鸣',
    tip: 'Ampathy',
    imgSrc: Hands,
  },
];
const startPoint = {
  options: {
    x: 12962741.4688,
    y: 4852357.1974,
    groupID: 1,
    size: 50,
    url: '/assets/startPoint.png',
    height: 2,
  },
};
// const FidMapToMeeting = {
//   8739: {
//     fids: ['213960080129'],
//     meetAddress: '会议室1',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962747.4252,
//         y: 4852355.0651,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8740: {
//     fids: ['213960080128'],
//     meetAddress: '会议室2',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962750.0613,
//         y: 4852355.1914,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8741: {
//     fids: ['213960080131'],
//     meetAddress: '会议室3',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962746.314,
//         y: 4852346.6198,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8742: {
//     fids: ['213960080132'],
//     meetAddress: '会议室4',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962750.759,
//         y: 4852344.527,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8743: {
//     fids: ['213960080133'],
//     meetAddress: '会议室5',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962753.3519,
//         y: 4852344.1936,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8744: {
//     fids: ['213960080134'],
//     meetAddress: '会议室6',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962768.9464,
//         y: 4852344.8048,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8745: {
//     fids: ['213960080123'],
//     meetAddress: '会议室7',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962765.9646,
//         y: 4852358.2694,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8746: {
//     fids: ['213960080122'],
//     meetAddress: '会议室8',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962765.8905,
//         y: 4852363.3812,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
//   8747: {
//     fids: ['213960080127'],
//     meetAddress: '2人会议室',
//     startPoint,
//     visitDate: 0,
//     endPoint: {
//       options: {
//         x: 12962757.408,
//         y: 4852351.9816,
//         groupID: 1,
//         url: '/assets/endPoint.png',
//         size: 50,
//         height: 2,
//       },
//     },
//   },
// };

function UserMsg(room) {
  return (
    <div>
      <p
        style={{ fontSize: '50px', marginBottom: 0 }}
      >{`请按照下图导航指引前往会议室（${room}）参会`}</p>
      <p
        style={{ fontSize: '50px', marginBottom: 0 }}
      >{`Please follow the map to the meeting room(${room}).`}</p>
    </div>
  );
}

const config = {
  key: 'messageKey',
  content: '请参照导航图前往您的会议室',
  duration: 20,
  maxCount: 1,
  icon: '',
  style: {
    fontSize: '28px',
  },
};

const meetingMapId = [
  {
    fids: ['213960080129'],
    meetAddress: '会议室1',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962747.4252,
        y: 4852355.0651,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080128'],
    meetAddress: '会议室2',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962750.0613,
        y: 4852355.1914,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080131'],
    meetAddress: '会议室3',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962746.314,
        y: 4852346.6198,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080132'],
    meetAddress: '会议室4',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962750.759,
        y: 4852344.527,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080133'],
    meetAddress: '会议室5',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962753.3519,
        y: 4852344.1936,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['21396000101169'],
    meetAddress: '会议室6',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962768.9464,
        y: 4852344.8048,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080123'],
    meetAddress: '会议室7',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962765.9646,
        y: 4852358.2694,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
  {
    fids: ['213960080122'],
    meetAddress: '会议室8',
    startPoint,
    visitDate: 0,
    endPoint: {
      options: {
        x: 12962765.8905,
        y: 4852363.3812,
        groupID: 1,
        url: '/assets/endPoint.png',
        size: 50,
        height: 2,
      },
    },
  },
];

function FSTcomponent(props) {
  const { data, onChange, style } = props;
  const [isHasVisitor, setIsHasVisitor] = useState(false);
  const [tag, setTag] = useState(true);
  const [meetingArray, setMeetingArray] = useState({});
  const [state, setState] = useState({});
  const Timer = useRef();
  const cacheData = useRef();
  const cacheDate = useRef();
  const randerTimes = useRef(false);

  const delayToReset = () => {
    if (Timer.current) {
      clearTimeout(Timer.current);
    }
    Timer.current = setTimeout(() => {
      cacheData.current = null;
      setIsHasVisitor(() => false);
      for (let key in meetingArray) {
        meetingArray[key].visitDate = 0;
      }
      setMeetingArray(() => meetingArray);
      onChange &&
        onChange({
          includeEvents: ['clearApiData', 'passParams'],
          ...{},
        });
    }, 20 * 1000);
  };

  const { idIndex = 1 } = style;

  useEffect(() => {
    const obj = {};
    let idxkay = Number(idIndex);
    meetingMapId.forEach(item => {
      obj[idxkay] = item;
      idxkay++;
    });
    setMeetingArray(() => obj);
  }, [idIndex]);
  console.log('FST meetingArray', meetingArray);
  useEffect(() => {
    const isShow = isNotEmptyObject(data);
    console.log('FST props data', data);
    let setTimer = null;
    if (isShow) {
      const { meetingId, visitDate } = data;
      const findMeetingRoom = meetingArray[meetingId];
      // const now = Date.now(); visitDate
      if (
        findMeetingRoom &&
        (!cacheDate.current || Number(cacheDate.current) != Number(visitDate))
      ) {
        meetingArray[meetingId].visitDate = Date.now();
        cacheDate.current = visitDate;
        setMeetingArray(() => meetingArray);
        setState(data);
        randerTimes.current = true;
        delayToReset();
        setTag(true);
        setIsHasVisitor(() => true);
        cacheData.current = data;
        message.destroy('messageKey');
        config.content = UserMsg(data.meetAddress);
        message.warn(config);
        onChange &&
          onChange({
            includeEvents: ['passParams', 'paramsCache'],
            ...findMeetingRoom,
          });
      } else {
        // console.log('FST isShow ', JSON.stringify(data));
        // console.log('FST isShow', JSON.stringify(cacheData.current));
        if (JSON.stringify(data) !== JSON.stringify(state)) {
          setState(data);
          delayToReset();
          setTag(true);
          setIsHasVisitor(() => true);
          cacheData.current = data;
          onChange &&
            onChange({
              includeEvents: ['passParams', 'paramsCache'],
              ...{},
            });
        }
      }
    } else if (cacheData.current && tag) {
      setIsHasVisitor(() => true);
      setState(cacheData.current);
      setTag(false);

      if (setTimer) {
        clearTimeout(setTimer);
      }
      setTimer = setTimeout(() => {
        setTag(true);
        for (let key in meetingArray) {
          meetingArray[key].visitDate = 0;
        }
        setMeetingArray(() => meetingArray);
        onChange &&
          onChange({
            includeEvents: ['clearApiData', 'passParams'],
            ...{},
          });
        cacheData.current = null;
      }, 20 * 1000);
    }
    // eslint-disable-next-line
  }, [data?.visitDate]);

  // console.log('state is', state);
  return (
    <div className={styles.container}>
      {isHasVisitor && randerTimes.current ? (
        <>
          <div className={styles.content}>
            <div className={styles.welcome}>
              <p>欢迎</p>
              <p>{state.vname}先生/女士</p>
              <p>访问富士通</p>
            </div>
            <div className={styles.welcome}>
              <p>Mr/Ms</p>
              <p>{state.vname}</p>
              <p>Welcome to Fujitsu！</p>
            </div>
            {/* <div className={styles.meetings}>
              {state.meetAddress && <p>已为您预约会议室: {state.meetAddress}</p>}
              {state.meetAddress && <p>请参照右侧导航图前往您的会议室！</p>}
            </div> */}
          </div>
          {/* <div className={styles.bottom}><img src={FST} alt="" /></div> */}
        </>
      ) : (
        <>
          <div className={styles.target}>
            <h2>企业目标</h2>
            <p>通过创新</p>
            <p>构建可信社会</p>
            <p>进一步推动世界可持续发展</p>
          </div>
          <div className={styles.worth}>核心价值观</div>
          <div>
            {list.map(item => {
              return (
                <div
                  key={item.tip}
                  className={styles.items}
                  style={{ backgroundColor: item.bgcolor }}
                >
                  <img alt="" src={item.imgSrc} />
                  <span className={styles.value}>{item.value}</span>
                  <span className={styles.tip}>{item.tip}</span>
                </div>
              );
            })}
          </div>
          {/* <div className={styles.bottom}><img src={FST} alt="" /></div> */}
        </>
      )}
    </div>
  );
}

FSTcomponent.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default FSTcomponent;

function isNotEmptyObject(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }
  if (Object.keys(obj).length === 0) {
    return false;
  }
  return true;
}

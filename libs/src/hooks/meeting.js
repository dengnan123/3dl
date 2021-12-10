// 会议室系统的逻辑
import { useEffect, useRef } from 'react';
import { isNumber, isObject } from 'lodash';

import moment from 'dayjs';
import { setLocalUser, clearLocalUser, getLocalUser } from '../helpers/storage';
import { generateNewRouterByParams } from '../helpers/utils';
import { useMinNoActionDoSome } from './util';
import emitter from '../helpers/mitt';

const getNowAndNextMeeting = meetingList => {
  let nowMeetingNext = {};
  let nowMeeting = {};
  for (let i = 0; i < meetingList.length; i++) {
    const v = meetingList[i];
    const { apptStatus } = v;
    if (apptStatus === 4 || apptStatus === 8) {
      nowMeeting = v;
      nowMeetingNext = meetingList[i + 1] || {};
    }
  }
  return {
    nowMeetingNext,
    nowMeeting,
  };
};

export const useGetMeetingBtnsVis = (padConfig = {}, meetingList = [], userData) => {
  const minStartTime = getMinStartTime(meetingList);
  const isQuckliyBook = getQuckliyBook(padConfig, minStartTime);
  const { nowMeetingNext, nowMeeting } = getNowAndNextMeeting(meetingList);
  console.log('nowMeetingnowMeeting.....', nowMeeting);
  console.log('nowMeetingNext.....', nowMeetingNext);
  const isExtendEvent = getExtendEvent(padConfig, nowMeeting, nowMeetingNext);
  const isEndEvent = getEndEvent(padConfig, nowMeeting);
  const isShowFaceSetting = getIsShowFaceSetting(padConfig, userData);
  return {
    isQuckliyBook,
    isExtendEvent,
    isEndEvent,
    nowMeeting,
    isShowFaceSetting,
  };
};

const getIsShowFaceSetting = (padConfig, userData) => {
  const { enableFace } = padConfig;

  if (enableFace && !userData) {
    return true;
  }
  return false;
};

const getQuckliyBook = (padConfig, minStartTime) => {
  const { isQuckliyBook } = padConfig;
  if (!isQuckliyBook) {
    return;
  }

  const nowTime = moment().valueOf();

  if (minStartTime && nowTime > minStartTime) {
    return;
  }
  return true;
};

const getExtendEvent = (padConfig, nowMeeting, nowMeetingNext) => {
  const { isExtendEvent } = padConfig;
  if (!isExtendEvent) {
    return;
  }
  const { canApptExtend } = nowMeeting;
  if (!canApptExtend) {
    return;
  }
  // 还要判断当前会议的结束时间和下个会议的开始时间对比 如果当前会议的技术时间和下个会议的开始时间一样，就不显示延长会议
  const { endTime } = nowMeeting;
  const { startTime } = nowMeetingNext;
  if (startTime && endTime) {
    if (endTime >= startTime) {
      return;
    }
  }
  return true;
};

const getEndEvent = (padConfig, nowMeeting) => {
  const { isEndEvent } = padConfig;
  if (!isEndEvent) {
    return;
  }
  const { canApptEnd } = nowMeeting;
  if (!canApptEnd) {
    return;
  }
  return true;
};

// 通过列表获取最近一场会议的开始时间
const getMinStartTime = meetingList => {
  if (!meetingList || !meetingList.length) {
    return;
  }
  const newList = meetingList.sort((a, b) => {
    return a.startTime - b.startTime;
  });

  return newList[0].startTime;
};

const cus = {
  type: 'submit',
  duration: 'customize',
  text: '自定\n时间',
  enText: 'Book\ning',
  modalPromptMsg: '',
};
const booking_15 = {
  type: 'submit',
  duration: 15,
  text: 15,
  modalPromptMsg: '您确定要预定一个15分钟的临时会议',
  enModalPromptMsg: 'Are you sure to book a 15 Mins Temporaty meeting',
};
const booking_30 = {
  type: 'submit',
  duration: 30,
  text: 30,
  modalPromptMsg: '您确定要预定一个30分钟的临时会议',
  enModalPromptMsg: 'Are you sure to book a 30 Mins Temporaty meeting',
};

const booking_60 = {
  type: 'submit',
  duration: 60,
  text: 60,
  modalPromptMsg: '您确定要预定一个60分钟的临时会议',
  enModalPromptMsg: 'Are you sure to book a 60 Mins Temporaty meeting',
};

const extend_15 = {
  type: 'submit',
  duration: 15,
  text: 15,
};
const extend_30 = {
  type: 'submit',
  duration: 30,
  text: 30,
};
const extend_60 = {
  type: 'submit',
  duration: 60,
  text: 60,
};
const extend_120 = {
  type: 'submit',
  duration: 120,
  text: 120,
};
/**
 * 根据 btnType 和  meetingList  生成数组
 */
export const generateTimeArr = (btnType, meetingList = [], lang) => {
  const minStartTime = getMinStartTime(meetingList);
  const nowTime = getMinTimestamp();
  const diffTimeMin = minDiff(nowTime, minStartTime);
  console.log('nowTimenowTime', nowTime);
  console.log('minStartTimeminStartTime', minStartTime);
  console.log('diffTimeMindiffTimeMin', diffTimeMin);
  if (btnType === 'booking') {
    if (diffTimeMin < 15) {
      return [getBookDiff(diffTimeMin), cus];
    }
    if (diffTimeMin >= 15 && diffTimeMin < 30) {
      return [booking_15, getBookDiff(diffTimeMin), cus];
    }
    if (diffTimeMin >= 30 && diffTimeMin < 60) {
      return [booking_15, booking_30, getBookDiff(diffTimeMin), cus];
    }
    return [booking_15, booking_30, booking_60, cus];
  }

  // 延长会议
  return extendTimeArr(meetingList, lang);
};

const extendTimeArr = (meetingList, lang) => {
  // 首先根据每个每个会议的开始时间对会议进行排序
  const newList = meetingList.sort((a, b) => {
    return a.startTime - b.startTime;
  });

  let nowMeetingNext;
  let nowMeeting;
  for (let i = 0; i < newList.length; i++) {
    const v = newList[i];
    const { apptStatus } = v;
    if (apptStatus === 4) {
      nowMeeting = v;
      nowMeetingNext = newList[i + 1];
    }
  }

  if (!nowMeetingNext) {
    // 说明进行中的会议可以随便延长
    return [extend_15, extend_30, extend_60, extend_120].map(v => {
      const modalPromptMsg = getModalPromptMsg(v.duration, lang);
      return {
        ...v,
        modalPromptMsg,
      };
    });
  }
  const { startTime: nextStartTime } = nowMeetingNext;
  const { endTime } = nowMeeting;
  const diffTimeMin = minDiff(endTime, nextStartTime);
  let resArr = getExtendArr(diffTimeMin);
  return resArr.map(v => {
    const modalPromptMsg = getModalPromptMsg(v.duration, lang);
    return {
      ...v,
      modalPromptMsg,
    };
  });
};

const getExtendArr = diffTimeMin => {
  const _last = {
    type: 'submit',
    duration: diffTimeMin,
    text: `${diffTimeMin}\n分钟`,
  };
  if (diffTimeMin < 15) {
    return [_last];
  }
  if (diffTimeMin === 15) {
    return [extend_15];
  }
  if (diffTimeMin > 15 && diffTimeMin < 30) {
    return [extend_15, _last];
  }
  if (diffTimeMin === 30) {
    return [extend_15, extend_30];
  }
  if (diffTimeMin > 30 && diffTimeMin < 60) {
    return [extend_15, extend_30, _last];
  }
  if (diffTimeMin === 60) {
    return [extend_15, extend_30, extend_60];
  }
  if (diffTimeMin > 60 && diffTimeMin < 120) {
    return [extend_15, extend_30, extend_60, _last];
  }
  return [extend_15, extend_30, extend_60, extend_120];
};

const getModalPromptMsg = (duration, lang) => {
  const isCN = lang !== 'en-US';
  return isCN
    ? `您确定要将会议延长${duration}分钟`
    : `Are you sure to extend the meeting ${duration} Mins?`;
};

const minDiff = (start, end) => {
  const minEnd = end / 1000;
  const minStart = start / 1000;
  const res = (minEnd - minStart) / 60;
  console.log('minDiff:', res);
  return Math.round(Math.abs(res));
};

/**
 * 根据duration 得出新的endTime
 */
export const getNewEndTime = (duration, endTime) => {
  return endTime + duration * 60 * 1000;
};

export const getBookingData = (v, otherCompParams) => {
  const { duration } = v;
  const startTime = getMinTimestamp();
  const endTime = startTime + duration * 60 * 1000;
  if (isNumber(duration)) {
    return {
      ...v,
      startTime,
      endTime,
      includeEvents: ['showComps', 'passParams'],
      modalType: v.type,
      ...otherCompParams,
      modalPromptMsg: '确定要预订会议',
      enModalPromptMsg: 'Are you sure to book a meeting',
    };
  }
  // 自定义时间  逻辑
  try {
    const Na = new NativeBridgeAction();
    Na.doAction('openDiyMeeting');
  } catch (err) {
    console.log('openDiyMeeting err', err.message);
  }
};

export const getExtendData = (v, otherCompParams) => {
  const {
    nowMeeting: { endTime },
  } = otherCompParams;
  const { duration } = v;
  const newEndTime = getNewEndTime(duration, endTime);
  return {
    ...v,
    ...otherCompParams,
    modalType: v.type,
    endTime: newEndTime,
    modalPromptMsg: '确定要延长会议',
    enModalPromptMsg: 'Are you sure to extend the meeting',
  };
};

export const getBookDiff = (diff, noWrap) => {
  return {
    type: 'submit',
    duration: diff,
    text: noWrap ? `${diff}分钟` : `${diff}\n分钟`,
    enText: noWrap ? `${diff} Mins` : `${diff}\nMins`,
    modalPromptMsg: `您确定要预定一个${diff}分钟的临时会议`,
    enModalPromptMsg: `Are you sure to book a ${diff} Mins Temporaty meeting`,
  };
};

export const useNoActionAutoClose = ({ isHidden, openAutoClose, autoCloseTime, onChange }) => {
  const callback = () => {
    onChange &&
      onChange({
        includeEvents: ['hiddenComps'],
      });
  };
  useMinNoActionDoSome({
    autoCloseTime,
    callback,
  });
};

export const getMinTimestamp = () => {
  const nowTime = moment().unix() * 1000;
  const sec = moment().get('seconds');
  return nowTime - sec * 1000;
};

export class NativeBridgeAction {
  doAction(type, ...params) {
    if (!window.NativeBridge) {
      return;
    }
    if (!window.NativeBridge[type]) {
      return;
    }
    console.log('doAction type', type);
    console.log('doAction params', params);
    try {
      return window.NativeBridge[type](...params);
    } catch (err) {
      console.log('NativeBridgeAction 。。。。erererer', err.message);
    }
  }
}

/**
 * 打开人脸识别
 */
export const openFaceVerify = (forRepair, haveMeetingNow) => {
  if (window.NativeBridge && window.NativeBridge.openFaceVerify) {
    window.NativeBridge.openFaceVerify();
  }
};

/**
 * 打开管理员界面
 */
export const openSystemManagement = () => {
  const Na = new NativeBridgeAction();
  Na.doAction('openSystemManagement');
};

/**
 * 打开维修界面
 */
export const openRepair = () => {};

/**
 * 打开单独的会议列表
 */
export const openMeetingList = () => {};

/**
 * 打开自定义会议界面
 */
export const openDiyMeeting = () => {};

export const faceVerify = ({ callback, haveMeetingNow = false }) => {
  if (!window.NativeCallback) {
    window.NativeCallback = {};
  }
  window.NativeCallback.faceVerifyResult = res => {
    console.log('人脸识别的结果。22323。。。。', res);
    let data;
    try {
      data = JSON.parse(res);
    } catch (err) {
      return;
    }
    if (isObject(data)) {
      callback && callback(data);
      setLocalUser(data);
      emitter.emit(`faceVerify`, data);
    }
  };
  const Na = new NativeBridgeAction();
  Na.doAction('openFaceVerify', false, haveMeetingNow);
};

/*
 * 获取baseurl
 */
export const baseURL = ({ callback }) => {
  try {
    const Na = new NativeBridgeAction();
    const baseURL = Na.doAction('getBaseURL');
    console.log('获取 base URL ', baseURL);
    return baseURL;
  } catch (err) {
    console.log('getBaseURL err', err.message);
  }
};

/**
 * 安卓页面回到web页面的回调函数
 */
export const onBackCallBack = callback => {
  if (!window.NativeCallback) {
    window.NativeCallback = {};
  }
  window.NativeCallback.onBack = res => {
    callback(res);
  };
};

export const useWindwoUtil = () => {
  useEffect(() => {
    // 把NativeBridgeAction 挂在到window上
    const Na = new NativeBridgeAction();
    window.Na = Na;
    window.baseURL = baseURL;
    window.setLocalUser = setLocalUser;
    window.clearLocalUser = clearLocalUser;
    window.getLocalUser = getLocalUser;
    window.faceVerify = faceVerify;
    window.generateNewRouterByParams = generateNewRouterByParams;
  }, []);
};

export const getActionBtns = ({
  isShowFaceSetting,
  userData,
  isQuckliyBook,
  isExtendEvent,
  isEndEvent,
  click,
  bg,
  setUserData,
  lang,
  btnArr: propsBtnArr,
}) => {
  const isCN = lang !== 'en-US';

  if (isShowFaceSetting) {
    return null;
  }

  const btnArr = propsBtnArr || [
    {
      key: 'booking',
      label: '快速预定',
      enLabel: 'Booking',
      onClick() {
        click('booking');
      },
    },
    {
      key: 'extend',
      label: '延长会议',
      enLabel: 'Extend',
      onClick() {
        click('extend');
      },
    },
    {
      key: 'over',
      label: '结束会议',
      enLabel: 'End',
      onClick() {
        click('over');
      },
    },
  ];

  return btnArr
    .filter(v => {
      const { key } = v;
      if (key === 'booking' && isQuckliyBook) {
        return true;
      }
      if (key === 'extend' && isExtendEvent) {
        return true;
      }
      if (key === 'over' && isEndEvent) {
        return true;
      }
      return false;
    })
    .map(v => {
      const { onClick, label, enLabel, key } = v;
      const imgBg = v.bg || bg;
      return (
        <span type="primary" key={`${key}_action`} id={`${key}_action`} onClick={onClick}>
          <img src={imgBg} id={`${key}_action`} alt=""></img>
          <span id={`${key}_action`}>{isCN ? label : enLabel}</span>
        </span>
      );
    });
};

/**
 * 根据 btnType 和  meetingList  生成数组
 */
export const generateBlueTimeArr = (btnType, meetingList = [], lang) => {
  if (!btnType) {
    return;
  }
  const minStartTime = getMinStartTime(meetingList);
  const nowTime = getMinTimestamp();
  // 现在时间分钟差异
  const diffTimeMin = minDiff(nowTime, minStartTime);
  const diffRes = getBookDiff(diffTimeMin, 'no');
  console.log('btnType------', btnType);
  if (btnType === 'booking') {
    if (diffTimeMin <= 30) {
      return [diffRes];
    }
    if (diffTimeMin > 30 && diffTimeMin < 60) {
      return [booking_30, diffRes];
    }
    return [booking_30, booking_60];
  }
  // 延长会议
  return blueExtendTimeArr(meetingList, lang);
};

const blueExtendTimeArr = (meetingList, lang) => {
  // 首先根据每个每个会议的开始时间对会议进行排序
  const newList = meetingList.sort((a, b) => {
    return a.startTime - b.startTime;
  });

  let nowMeetingNext;
  let nowMeeting;
  for (let i = 0; i < newList.length; i++) {
    const v = newList[i];
    const { apptStatus } = v;
    if (apptStatus === 4) {
      nowMeeting = v;
      nowMeetingNext = newList[i + 1];
    }
  }

  if (!nowMeetingNext) {
    // 说明进行中的会议可以随便延长
    return [extend_30, extend_60].map(v => {
      const modalPromptMsg = getModalPromptMsg(v.duration, lang);
      return {
        ...v,
        modalPromptMsg,
      };
    });
  }
  const { startTime: nextStartTime } = nowMeetingNext;
  const { endTime } = nowMeeting;
  const diffTimeMin = minDiff(endTime, nextStartTime);
  let resArr = getBlueExtendArr(diffTimeMin, lang);
  return resArr.map(v => {
    const modalPromptMsg = getModalPromptMsg(v.duration, lang);
    return {
      ...v,
      modalPromptMsg,
    };
  });
};

const getBlueExtendArr = (diffTimeMin, lang) => {
  const isCN = lang !== 'en-US';
  const _last = {
    type: 'submit',
    duration: diffTimeMin,
    text: isCN ? `${diffTimeMin}分钟` : `${diffTimeMin} Mins`,
  };
  if (diffTimeMin <= 30) {
    return [_last];
  }
  if (diffTimeMin > 30 && diffTimeMin < 60) {
    return [extend_30, _last];
  }
  return [extend_30, extend_60];
};

export const useGoBack = ({ showTime, setTime, autoTime = 60 }) => {
  const timeRef = useRef();
  useEffect(() => {
    if (!showTime) {
      return;
    }
    const setTimer = () => {
      const timerId = setTimeout(() => {
        setTime(false);
      }, 1000 * autoTime);
      timeRef.current = timerId;
    };
    setTimer();

    const func = e => {
      const { id } = e.target;
      if (id.includes('action')) {
        return;
      }
      if (id.includes('timer')) {
        clearTimeout(timeRef.current);
        setTimer();
        return;
      }
      setTime(false);
    };
    document.addEventListener('click', func);
    // 监听
  }, [autoTime, setTime, showTime]);
};

export const restartAppFunc = () => {
  const Na = new NativeBridgeAction();
  Na.doAction('restartApp');
};

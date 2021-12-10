import { useEffect, useState, Fragment } from 'react';
import {
  useGetMeetingBtnsVis,
  faceVerify,
  useWindwoUtil,
  getActionBtns,
  generateBlueTimeArr,
  getBookingData,
  getExtendData,
  useGoBack,
} from '../../../../hooks/meeting';
import bg from '../../../../assets/blueBtn.png';
import signOutBg from '../../../../assets/blue_sign_out_bg.png';
import { setLocalUser, clearLocalUser } from '../../../../helpers/storage';
import emitter from '../../../../helpers/mitt';
import { useMinNoActionDoSome } from '../../../../hooks/util';

import styles from './index.less';

const MeetingBtnBlue = props => {
  const { onChange, data = {}, otherCompParams = {}, lang } = props;
  const { screen, meetings, haveMeetingNow } = data;
  const isCN = lang !== 'en-US';
  const [showTime, setTime] = useState(false);

  const [btnType, setType] = useState(null);

  const arr = generateBlueTimeArr(btnType, meetings, lang);
  const [userData, setUserData] = useState(null);
  useWindwoUtil();

  useGoBack({ showTime, setTime });

  useEffect(() => {
    const doSome = data => {
      setUserData(data);
    };
    emitter.on(`faceVerify`, doSome);
    return () => {
      emitter.off('faceVerify', doSome);
    };
  }, [userData]);

  const signOut = () => {
    setUserData(null);
    setLocalUser(null);
    clearLocalUser();
    setTime(false);
  };
  useMinNoActionDoSome({
    autoCloseTime: 60,
    callback: signOut,
  });

  const {
    isQuckliyBook,
    isExtendEvent,
    isEndEvent,
    nowMeeting,
    isShowFaceSetting,
  } = useGetMeetingBtnsVis(screen, meetings, userData);

  const click = btnType => {
    setType(btnType);
    if (btnType === 'booking' || btnType === 'extend') {
      setTime(true);
      return;
    }
    onChange &&
      onChange({
        includeEvents: ['passParams', 'showComps'],
        btnType,
        nowMeeting,
        modalPromptMsg: isCN ? '请确定要结束会议' : 'Are you sure to end the meeting',
        modalType: 'submit',
      });
  };

  const timeClick = v => {
    let data;
    if (btnType === 'booking') {
      // 预定会议
      data = getBookingData(v, {
        ...otherCompParams,
        btnType,
        modalType: 'submit',
      });
    } else {
      // 延长会议
      data = getExtendData(v, {
        ...otherCompParams,
        nowMeeting,
        btnType,
        modalType: 'submit',
      });
    }

    onChange && data && onChange(data);
  };

  const getTimeRender = () => {
    return (
      <Fragment>
        {arr.map((v, index) => {
          return (
            <span
              type="primary"
              onClick={() => {
                timeClick(v);
              }}
              key={index}
              id={`${index}_timer`}
            >
              <img id={`${index}_timer_img`} src={bg} alt=""></img>
              <span id={`${index}_timer_text`}>{v.text}</span>
            </span>
          );
        })}
      </Fragment>
    );
  };

  const getRender = () => {
    if (isShowFaceSetting) {
      return (
        <span
          type="primary"
          onClick={() => {
            faceVerify({ haveMeetingNow });
          }}
        >
          <img src={bg} alt=""></img>
          <span>{isCN ? '身份验证' : 'Authentication'}</span>
        </span>
      );
    }

    if (showTime) {
      return getTimeRender();
    }

    return getActionBtns({
      isShowFaceSetting,
      userData,
      isQuckliyBook,
      isExtendEvent,
      isEndEvent,
      click,
      bg,
      lang,
    });
  };

  const blueExitBtn = () => {
    const userImg = userData.url;
    return (
      <span className={styles.exitBtn}>
        <img src={signOutBg} alt=""></img>
        <img src={userImg} alt="" className={styles.userImg}></img>
        <span onClick={signOut}>{isCN ? '退出' : 'Exit'}</span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {getRender()} {userData && blueExitBtn()}
    </div>
  );
};

export default MeetingBtnBlue;

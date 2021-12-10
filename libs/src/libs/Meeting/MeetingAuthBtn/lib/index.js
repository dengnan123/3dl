import { useState, useEffect } from 'react';
import styles from './index.less';
import { setLocalUser, clearLocalUser } from '../../../../helpers/storage';
import emitter from '../../../../helpers/mitt';
import {
  useGetMeetingBtnsVis,
  faceVerify,
  useWindwoUtil,
  getActionBtns,
} from '../../../../hooks/meeting';
import { useMinNoActionDoSome } from '../../../../hooks/util';
import bg from '../../../../assets/originBtn.png';

// padConfig pad 上对应的按钮开关配置，meetingList pad对应的会议列表
const MeetingAuthBtn = props => {
  const { onChange, data = {}, lang } = props;
  const { screen, meetings, haveMeetingNow = false } = data;
  const isCN = lang !== 'en-US';

  const [userData, setUserData] = useState(null);

  const signOut = () => {
    setUserData(null);
    setLocalUser(null);
    clearLocalUser();
  };

  useMinNoActionDoSome({
    autoCloseTime: 60,
    callback: signOut,
  });

  useWindwoUtil();

  useEffect(() => {
    const doSome = data => {
      console.warn('data', data);
      setUserData(data);
    };
    emitter.on(`faceVerify`, doSome);
    return () => {
      emitter.off('faceVerify', doSome);
    };
  }, [userData]);

  const {
    isQuckliyBook,
    isExtendEvent,
    isEndEvent,
    nowMeeting,
    isShowFaceSetting,
  } = useGetMeetingBtnsVis(screen, meetings, userData);

  const click = btnType => {
    onChange &&
      onChange({
        includeEvents: ['passParams', 'showComps'],
        btnType,
        nowMeeting,
        modalPromptMsg: isCN ? '请确定要结束会议' : 'Are you sure to end the meeting?',
        modalType: 'submit',
      });
  };

  const blueExitBtn = () => {
    const userImg = userData?.url;
    return (
      <span className={styles.exitBtn}>
        <img src={bg} alt=""></img>
        <img src={userImg} alt="" className={styles.userImg}></img>
        <span onClick={signOut}>{isCN ? '退出' : 'Exit'}</span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.btns}>
        {isShowFaceSetting && (
          <span
            type="primary"
            onClick={() => {
              faceVerify({ haveMeetingNow });
            }}
          >
            <img src={bg} alt=""></img>
            <span>{isCN ? '身份验证' : 'Authentication'}</span>
          </span>
        )}
        {getActionBtns({
          isShowFaceSetting,
          isQuckliyBook,
          isExtendEvent,
          isEndEvent,
          click,
          bg,
          setUserData,
          lang,
        })}
        {userData && blueExitBtn()}
      </div>
    </div>
  );
};

export default MeetingAuthBtn;

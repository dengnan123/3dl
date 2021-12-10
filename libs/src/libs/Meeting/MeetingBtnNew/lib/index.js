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

import { setLocalUser, clearLocalUser } from '../../../../helpers/storage';
import emitter from '../../../../helpers/mitt';
import { useMinNoActionDoSome } from '../../../../hooks/util';
import CustomizeButton from '../../../CustomizeButton/lib';

/*
1. 预定会议button || 延长会议，结束会议button
2. button随状态发生颜色变化
3. button随点击时间发生颜色变化
4. button根据当前会议列表状态发生变化
*/

const MeetingBtnBlue = props => {
  const { onChange, data = {}, otherCompParams = {}, lang } = props;
  const { screen, meetings, haveMeetingNow } = data;
  const isCN = lang !== 'en-US';

  return <CustomizeButton />;
};

export default MeetingBtnBlue;

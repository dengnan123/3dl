import { generateLeftAndBottom } from '../../../../helpers/math';
import MeetingModal from '../../../../components/MeetingModal';
import {
  generateTimeArr,
  // getNewEndTime,
  getBookingData,
  getExtendData,
  useNoActionAutoClose,
  // onBackCallBack,
} from '../../../../hooks/meeting';
// import moment from 'dayjs';
import Portal from '../../../../components/Portal';
import styles from './index.less';

const MeetingDrawer = ({
  onChange,
  pageConfig = {},
  zIndexBak,
  zIndex,
  getContainer,
  isHidden,
  otherCompParams = {},
  data = {},
  style = {},
  lang,
}) => {
  const { meetings } = data;
  const { pageWidth = 400, pageHeight = 400 } = pageConfig;
  const { openAutoClose, autoCloseTime } = style;

  useNoActionAutoClose({
    isHidden,
    openAutoClose,
    autoCloseTime,
    onChange,
  });

  const { btnType } = otherCompParams;

  const arr = generateTimeArr(btnType, meetings, lang);

  const R = 470;
  const r = 90;
  const m = 306;
  const res = generateLeftAndBottom(arr, R, r);

  if (isHidden) {
    return null;
  }

  const meetingModalProps = {
    res,
    m,
    r,
    lang,
    closeModal() {
      // setVis(false);
      onChange &&
        onChange({
          includeEvents: ['hiddenComps'],
        });
    },
    itemClick(v) {
      let data;
      const { btnType } = otherCompParams || {};
      if (btnType === 'booking') {
        // 预定会议
        data = getBookingData(v, otherCompParams);
      }
      if (btnType === 'extend') {
        // 延长会议
        data = getExtendData(v, otherCompParams);
      }
      onChange && data && onChange(data);
    },
    pageWidth,
    pageHeight,
    isHidden,
  };

  return (
    <Portal getContainer={getContainer}>
      <div
        className={styles.modal}
        style={{
          backgroundColor: 'rgba(66, 66, 66, 0.85)',
        }}
      >
        <MeetingModal {...meetingModalProps}></MeetingModal>
      </div>
    </Portal>
  );
};

export default MeetingDrawer;

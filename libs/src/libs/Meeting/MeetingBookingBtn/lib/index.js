import { generateLeftAndBottom } from '../../../../helpers/math';
import { generateTimeArr, useNoActionAutoClose } from '../../../../hooks/meeting';

import { useState, useEffect } from 'react';
import Portal from '../../../../components/Portal';
import classnames from 'classnames';
import { isNumber } from 'lodash';
import styles from './index.less';
import Close from '../../../../assets/close.svg';

const MeetingBookingBtn = ({
  onChange,
  pageConfig = {},
  getContainer,
  isHidden,
  otherCompParams = {},
  data = {},
  style = {},
  lang,
}) => {
  const isCN = lang !== 'en-US';
  const { meetings = [] } = data;
  const { pageWidth = 400, pageHeight = 400 } = pageConfig;
  const { openAutoClose, autoCloseTime } = style;

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
  }, [setShow]);

  useNoActionAutoClose({
    isHidden,
    openAutoClose,
    autoCloseTime,
    onChange,
  });

  const { btnType } = otherCompParams;

  const timeArrayBtn = generateTimeArr(btnType, meetings, lang);

  const R = 470;
  const r = 90;
  const m = 306;
  const res = generateLeftAndBottom(timeArrayBtn, R, r);

  const [show, setShow] = useState(false);
  const [clickInfo, setClick] = useState(null);

  const closeModal = () => {
    onChange &&
      onChange({
        includeEvents: ['hiddenComps'],
      });
  };

  const itemOnclick = (e, v) => {
    e.preventDefault();
    e.stopPropagation();
    setClick(v);
    let data;
    const { duration } = v;
    const { btnType } = otherCompParams || {};
    data = { duration, btnType };
    onChange && data && onChange(data);
  };

  const getBtnUI = ({ text, duration }) => {
    if (isNumber(duration)) {
      return (
        <div className={styles.itemDiv}>
          <div className={styles.number}>{duration}</div>
          <div className={styles.min}>{isCN ? '分钟' : 'Mins'}</div>
        </div>
      );
    }
    return (
      <div className={styles.itemDiv}>
        {isCN ? (
          <>
            <div className={styles.text}>自定</div>
            <div className={styles.text}>时间</div>
          </>
        ) : (
          <>
            <div className={styles.text}>Book</div>
            <div className={styles.text}>ing</div>
          </>
        )}
      </div>
    );
  };

  if (isHidden) {
    return null;
  }

  return (
    <Portal getContainer={getContainer}>
      <div
        className={styles.modal}
        style={{
          backgroundColor: 'rgba(66, 66, 66, 0.85)',
        }}
      >
        <div className={classnames(!isHidden ? styles.bg : styles.drawerModalHidden)}>
          <div
            className={classnames(styles.drawerModal, show ? styles.showClass : '')}
            style={{
              width: pageWidth,
              height: pageHeight,
            }}
            onClick={closeModal}
          >
            {res.map((v, index) => {
              return (
                <div
                  key={index}
                  onClick={itemOnclick}
                  style={{
                    left: v.left,
                    bottom: v.bottom,
                    position: 'absolute',
                    width: 2 * r,
                    height: 2 * r,
                    borderRadius: r,
                    background: 'red',
                    whiteSpace: 'break-spaces',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      clickInfo && clickInfo.duration === v.duration ? '#FE5529' : '#f0f2f5',
                  }}
                >
                  {getBtnUI(v)}
                </div>
              );
            })}
            <div
              style={{
                left: -m,
                bottom: -m,
                position: 'absolute',
                width: m * 2,
                height: m * 2,
                borderRadius: m,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1e233b',
              }}
            />
            <div
              style={{
                left: 94,
                bottom: 94,
                position: 'absolute',
              }}
              onClick={closeModal}
            >
              <img src={Close} alt=""></img>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default MeetingBookingBtn;

// import '' from 'class'
import { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { isNumber } from 'lodash';
import Close from '../../assets/close.svg';
// import

const MeetingModal = ({
  res,
  r,
  m,
  closeModal,
  bookingDrawerVis,
  itemClick,
  pageWidth,
  pageHeight,
  isHidden,
  lang,
}) => {
  const [clickInfo, setClick] = useState(null);

  const [show, setShow] = useState(false);
  const isCN = lang !== 'en-US';
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
  }, [setShow]);

  const getItem = ({ text, duration }) => {
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

  return (
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
          // const { text } = v;
          return (
            <div
              key={index}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setClick(v);
                itemClick && itemClick(v);
              }}
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
              {getItem(v)}
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
        ></div>
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
  );
};

export default MeetingModal;

import { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import styles from './index.less';
import {
  useGetMeetingBtnsVis,
  faceVerify,
  useWindwoUtil,
  getActionBtns,
} from '../../../hooks/meeting';

function NewThemeModal(props) {
  const { style = {}, data, onChange, isHidden, getContainer } = props;
  useWindwoUtil();

  const { autoClose, delay = 5 } = style || {};

  const [visible, setVisible] = useState(!isHidden || false);

  const isEmptyData = Object.keys(data).length === 0;

  const { status, message, reason } = !isEmptyData && data;

  const onCancel = () => {
    onChange && onChange(setVisible(false));
  };

  useEffect(() => {
    setVisible(!isHidden);
  }, [isHidden]);

  useEffect(() => {
    if (!autoClose) return;
    if (!visible) return;

    let timer = setTimeout(() => {
      setVisible(false);
      onChange && onChange({});
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [autoClose, delay, visible, onChange]);

  //  $$$ 根据状态改变Content
  const successContent = useMemo(() => {
    return <div>{message}</div>;
  }, [message]);

  const failedContent = useMemo(() => {
    return (
      <>
        <div style={{ marginBottom: '35px' }}>{message}</div>
        <div style={{ fontSize: '30px', color: 'rgba(235, 75, 25, 0.7)' }}>{reason}</div>
      </>
    );
  }, [message, reason]);
  // #$$$ 是否需要隐藏
  if (!visible) return null;

  return (
    <Modal
      className={styles.modalWrapper}
      visible={true}
      centered={true}
      onCancel={onCancel}
      footer={null}
      title={null}
      getContainer={getContainer()}
    >
      {!isEmptyData && (
        <div className={styles.modalContainer}>
          <Icon
            type={`${status === 1 ? 'close' : 'check'}-circle`}
            style={{ width: '60px', height: '60px', fontSize: '60px' }}
            theme="twoTone"
            twoToneColor="#fc721e"
          />
          {status === 1 ? failedContent : successContent}
        </div>
      )}
    </Modal>
  );
}

NewThemeModal.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default NewThemeModal;

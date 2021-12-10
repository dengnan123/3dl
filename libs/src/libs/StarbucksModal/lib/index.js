import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { Modal, Input, Icon, Button } from 'antd';
import _ from 'lodash';

import closeIcon from '../../../assets/close-icon.png';
import { useMinNoActionDoSome } from '../../../hooks/util';
import { fillText } from './helper';
import styles from './index.less';

let timer = null;

function StarbucksModal(props) {
  const {
    // className,
    onChange,
    style,
    data,
    isHidden,
    otherCompParams,
    // shouldClearParams,
  } = props;
  const { spaceId, userName, isBooking, errorCode } = data || {};
  const {
    width = 550,
    height = 320,
    top = 10,
    contentBgColor = '#006242',
    contentRadius = 10,
    isZh = true,
    // visible = false,
  } = style || {};
  const { name: deskName } = otherCompParams || {};
  const [tel, setTel] = useState(null);
  const [seconds, setSeconds] = useState(10);
  const [telError, setTelError] = useState('');

  const onCancel = useCallback(() => {
    onChange &&
      onChange({
        includeEvents: ['hiddenComps', 'clearApiData', 'fetchApi'],
        type: 1,
      });
    setTelError('');
    setTel(null);
    if (timer) {
      clearInterval(timer);
      setSeconds(10);
    }
  }, [onChange]);

  /******页面无操作，倒计20s自动关闭******/
  useMinNoActionDoSome({
    autoCloseTime: 20,
    callback: onCancel,
    eventName: ['touchstart', 'keyup'],
  });

  /******预订成功，倒计时10s无操作自动关闭******/
  useEffect(() => {
    if (isBooking !== false) return;
    timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 0) {
          clearInterval(timer);
          onCancel && onCancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [isBooking, onCancel]);

  /******Input框一些方法===START******/
  const onInputChange = useCallback(
    event => {
      const { value } = event.target;
      const telText = (value || '').trim();
      if (telText && telText.length > 20) {
        setTelError(fillText(isZh, 'ERROR_CODE_MAX_LENGTH'));
        onChange({
          includeEvents: ['clearApiData'],
        });
      } else {
        setTelError('');
      }
      setTel(telText);
    },
    [isZh, onChange],
  );

  const handleOnFocus = useCallback(() => {}, []);

  const handleOnPressEnter = useCallback(() => {
    if (!tel || !tel.length) {
      setTelError(fillText(isZh, 'ERROR_CODE_EMPTY'));
      onChange({
        includeEvents: ['clearApiData'],
      });
      return;
    }
    if (tel && tel.length > 20) {
      return;
    }
    onChange &&
      onChange({
        includeEvents: ['fetchApi'],
        formParams: { ...otherCompParams, mobile: tel },
      });
  }, [isZh, onChange, otherCompParams, tel]);
  /******Input框一些方法===END******/

  /******判断是否为上午===START******/
  const fortyFiveMins = 45 * 60 * 1000;
  const middleDay = moment()
    .startOf('day')
    .add(11, 'hours')
    .valueOf();
  const isAM = moment().valueOf() < middleDay + fortyFiveMins;
  /******判断是否为上午===END******/

  const RenderTimeRange = useMemo(() => {
    if (isAM) {
      return fillText(isZh, 'TIME_AM');
      // return `${fillText(isZh, 'TIME_AM')}(${fillText(isZh, 'TIME_UNTIL')}12:00)`;
    }
    return fillText(isZh, 'TIME_PM');
    // return `${fillText(isZh, 'TIME_PM')}(${fillText(isZh, 'TIME_UNTIL')}17:30)`;
  }, [isAM, isZh]);

  const RenderUsageTimeRange = useMemo(() => {
    if (isZh) {
      const dueTiem = isAM ? '上午' : '下午';
      return (
        <p>
          您可在今天<span>{dueTiem}</span>使用工位<span>{deskName || spaceId}。</span>
        </p>
      );
    }

    const dueTiem = isAM ? 'morning' : 'afternoon';
    return (
      <p>
        You can use the Desk <span>{deskName || spaceId}</span> in this <span>{dueTiem}.</span>
      </p>
    );
  }, [deskName, isAM, isZh, spaceId]);

  /******预订成功的弹框内容******/
  const SuccessContent = useMemo(() => {
    const contentStyle = { width: 340 };
    return (
      <>
        <h2>
          <Icon type="check-circle" />
          {fillText(isZh, 'BOOKING_SUCCESS')}
        </h2>
        <div className={styles.successContent} style={contentStyle}>
          <p>
            {fillText(isZh, 'BOOKING_VISITOR_TEXT')}
            {userName}
          </p>
          {RenderUsageTimeRange}
          <p className={styles.successTips}>
            <Icon type="info-circle" />
            {fillText(isZh, 'BOOKING_SUCCESS_TIPS')}
          </p>
        </div>
        <div
          className={styles.closeContent}
          style={{ borderRadius: `0 0 ${contentRadius}px ${contentRadius}px` }}
          onClick={onCancel}
        >
          {fillText(isZh, 'BOOKING_SUCCESS_OK')}
          <span>({seconds}s)</span>
        </div>
      </>
    );
  }, [RenderUsageTimeRange, contentRadius, isZh, userName, onCancel, seconds]);

  /******错误提示信息******/
  const RenderErrorTips = useMemo(() => {
    if (telError) {
      return (
        <p className={styles.errorTips}>
          <Icon type="info-circle" />
          {telError}
        </p>
      );
    }

    const ERROR_TIPS = {
      301: fillText(isZh, 'BOOKING_ERROR_TIPS'),
      302: fillText(isZh, 'BOOKING_ERROR_TIPS_302'),
      303: fillText(isZh, 'BOOKING_ERROR_TIPS_303'),
      304: fillText(isZh, 'BOOKING_ERROR_TIPS_304'),
    };

    if (errorCode) {
      return (
        <p className={styles.errorTips}>
          <Icon type="info-circle" />
          {ERROR_TIPS[errorCode] || fillText(isZh, 'BOOKING_ERROR_TIPS')}
        </p>
      );
    }

    // 空标签占位
    return <p className={styles.errorTips}></p>;
  }, [errorCode, isZh, telError]);
  /******预订中的弹框内容******/
  const BookingContent = useMemo(() => {
    const contentStyle = { width: 340 };
    if (!isZh && isAM) {
      contentStyle.width = 360;
    }
    const isError = !!telError || !!errorCode;
    return (
      <>
        <h2>{fillText(isZh, 'QUICKLY_BOOKING')}</h2>
        <section className={styles.formContent} style={contentStyle}>
          <div className={styles.content}>
            <p>
              {fillText(isZh, 'SPACE_ID')}：{deskName || spaceId}
            </p>
            <p>
              {fillText(isZh, 'BOOKING_TIME')}：{RenderTimeRange}
            </p>
            {isAM && (
              <p className={styles.timeTips}>
                {isZh && <span>{fillText(isZh, 'WANT_BOOKING_LONGER')}</span>}
                {fillText(isZh, 'WANT_BOOKING_PM_TIPS')}
              </p>
            )}
          </div>
          <div className={styles.verifyContent}>
            <p>{fillText(isZh, 'TEL_INPUT_TIPS')}</p>
            <div className={styles.mobileDiv}>
              <Input
                className={classnames(styles.numberInput, { [styles.inputError]: isError })}
                onChange={onInputChange}
                onFocus={handleOnFocus}
                onPressEnter={_.debounce(handleOnPressEnter, 400)}
              />
              <Button className={styles.submitBtn} onClick={_.debounce(handleOnPressEnter, 400)}>
                {fillText(isZh, 'INPUT_CONFIRM')}
              </Button>
            </div>

            {RenderErrorTips}
          </div>
        </section>
      </>
    );
  }, [
    RenderErrorTips,
    RenderTimeRange,
    deskName,
    errorCode,
    handleOnFocus,
    handleOnPressEnter,
    isAM,
    isZh,
    onInputChange,
    spaceId,
    telError,
  ]);

  if (isHidden) return null;
  return (
    <Modal
      className={styles.modaleWrapper}
      wrapClassName="wrapper"
      footer={null}
      maskClosable={false}
      width={width}
      height={height}
      title={null}
      closable={false}
      visible={!isHidden}
      centered={false}
      getContainer={props.getContainer()}
      style={{ top }}
      onCancel={onCancel}
    >
      <div
        className={styles.modalContainer}
        style={{ width, height, backgroundColor: contentBgColor, borderRadius: contentRadius }}
      >
        {isBooking !== false && (
          <div className={styles.closeIcon} onClick={onCancel}>
            <img src={closeIcon} alt=""></img>
          </div>
        )}
        {isBooking !== false ? BookingContent : SuccessContent}
      </div>
    </Modal>
  );
}

StarbucksModal.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.object,
  style: PropTypes.object,
  data: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default StarbucksModal;

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import styles from './index.less';

function ModalComponent(props) {
  const {
    style = {},
    data = {},
    onChange,
    otherCompParams = {},
    loadingOverRes = {},
    setLoadingOver,
  } = props;

  const { spaceStatus } = otherCompParams;
  const { autoClose, delay = 2, delayAfter, propty, onlyShowSvg } = style;
  const { fetchStatus = 'default', contentTitle, content, footer } = data;
  const [JsxTitle, setContentTitle] = useState(contentTitle);
  const [JsxContent, setContent] = useState(content);
  const [JsxFooter, setFooter] = useState(footer);
  const [bgStatus, setBgStatus] = useState(fetchStatus || 'default');
  const inputEl = useRef(null);
  const Timer = useRef();
  const autoCloseTimer = useRef(null);

  const bgSvgObj = {
    default: style.fullSvg,
    success: style.successSvg,
    error: style.failSvg,
  };

  useEffect(() => {
    setTimeout(() => {
      inputEl.current && inputEl.current.focus();
    }, 200);
  }, []);
  useEffect(() => {
    if (!loadingOverRes) {
      setBgStatus(() => 'default');
    } else {
      setBgStatus(() => fetchStatus);
    }
  }, [fetchStatus, loadingOverRes]);

  useEffect(() => {
    setContentTitle(() => (loadingOverRes ? contentTitle : style.contentTitle));
    setContent(() => (loadingOverRes ? content : style.content));
    setFooter(() => (loadingOverRes ? footer : ''));
  }, [content, footer, contentTitle, loadingOverRes, style.contentTitle, style.content]);

  useEffect(() => {
    if (autoClose && !props.isHidden) {
      setTimeout(() => {
        inputEl.current && inputEl.current.focus();
      }, 500);
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
      autoCloseTimer.current = setTimeout(() => {
        onChange && onChange({ includeEvents: ['hiddenComps'] });
      }, Number(delay || 2) * 1000);
    }
  }, [autoClose, delay, onChange, props.isHidden]);

  const handleCancle = () => {
    setLoadingOver && setLoadingOver(null);
    onChange && onChange({ includeEvents: ['hiddenComps'] });
  };

  useEffect(() => {
    if (data?.closable && loadingOverRes && !props.isHidden) {
      setTimeout(() => {
        setLoadingOver && setLoadingOver(null);
        onChange &&
          onChange({ includeEvents: ['hiddenComps', 'fetchApi'], ...otherCompParams, type: 2 });
      }, Number(delayAfter || 2) * 1000);
    }
  }, [
    data,
    data.closable,
    delayAfter,
    loadingOverRes,
    onChange,
    otherCompParams,
    props.isHidden,
    setLoadingOver,
  ]);

  const handleOnInputChange = event => {
    const value = event.target.value;
    if (Timer.current) {
      clearTimeout(Timer.current);
    }
    Timer.current = setTimeout(() => {
      onChange &&
        onChange({
          includeEvents: ['hiddenComps', 'fetchApi'],
          ...otherCompParams,
          idCard: value,
          type: 1,
        });
    }, 300);
  };

  if (props.isHidden) return null;
  return (
    <div className={styles.ModalWarpper}>
      <Modal
        className={styles.wrapper}
        wrapClassName="wrapper"
        footer={null}
        maskClosable={style.maskClosable}
        centered
        width={style.width}
        title={style.title}
        closable={style.closable || false}
        visible={true}
        onCancel={handleCancle}
        getContainer={props.getContainer()}
      >
        <>
          {spaceStatus && Number(spaceStatus) === 2 ? (
            <div className={styles.showWarper}>
              <div className={styles.bg} dangerouslySetInnerHTML={{ __html: onlyShowSvg }} />
              <div className={styles.deskName}>{otherCompParams[propty] || ''} 工位</div>
              {/* <div className={styles.deskItem}>工位编号：2-D12789</div> */}
              <div className={styles.deskItem}>员工姓名：Alex</div>
              <div className={styles.deskItem}>员工工号：DF2020001</div>
              <div className={styles.deskItem}>员工所属部门：产品研发部</div>
            </div>
          ) : (
            <div className={styles.content} style={{ height: style.height }}>
              <Input
                ref={inputEl}
                className={styles.inputEl}
                onChange={handleOnInputChange}
                style={{ opacity: 0 }}
              />
              <div className={styles.bg} dangerouslySetInnerHTML={{ __html: bgSvgObj[bgStatus] }} />
              <div>
                <div
                  dangerouslySetInnerHTML={{ __html: Compile(JsxTitle, otherCompParams[propty]) }}
                />
                <div
                  dangerouslySetInnerHTML={{ __html: Compile(JsxContent, otherCompParams[propty]) }}
                />
                {fetchStatus !== 'default' && (
                  <div
                    dangerouslySetInnerHTML={{ __html: Compile(JsxFooter, '2020.08.01 下午2点') }}
                  />
                )}
              </div>
            </div>
          )}
        </>
      </Modal>
    </div>
  );
}

ModalComponent.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default ModalComponent;

function Compile(oldVal, val) {
  if (!val) return oldVal;
  const Temp = /\{(.*?)\}/;
  const newVal = oldVal.replace(Temp, val);
  return newVal;
}

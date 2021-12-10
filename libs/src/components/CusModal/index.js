import { Modal, Button } from 'antd';
import { useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { filterDataFunc } from '../../helpers/utils';
import * as uuid from 'uuid';

const modalId = uuid.v4();
const CusModal = props => {
  const { loading, visible, getContainer, onCancel, onOk, modalProps, lang } = props;
  // const [] = useState()
  const isCN = lang !== 'en-US';
  const {
    modalPromptMsg,
    modalType,
    modalTitle,
    width = 540,
    footer,
    // content,
    openHighConfig,
    maskClosable,
    hiddenFooterTopLine,
    hiddenCloseX,
    // modalBodyBottom,
    confirmBtnColor = 'rgba(255,255,255,1)',
    confirmBtnBgColor = 'rgba(255,77,79,1)',
    confirmBtnBorderColor = 'rgba(255,77,79,1)',
    cancelBtnColor = 'rgba(254,100,58,1)',
    cancelBtnBgColor = 'rgba(255,255,255,1)',
    cancelBtnBorderColor = 'rgba(217,217,217,1)',
  } = modalProps;

  useEffect(() => {}, []);

  const submitRenderFooter = () => {
    return (
      <div className={styles.submitRenderFooter}>
        <Button
          onClick={onCancel}
          shape="round"
          style={{
            color: cancelBtnColor,
            backgroundColor: cancelBtnBgColor,
            borderColor: cancelBtnBorderColor,
          }}
        >
          {isCN ? '取消' : 'Cancel'}
        </Button>
        <Button
          shape="round"
          style={{
            color: confirmBtnColor,
            backgroundColor: confirmBtnBgColor,
            borderColor: confirmBtnBorderColor,
          }}
          onClick={onOk}
        >
          {isCN ? '是的' : 'Yes'}
        </Button>
      </div>
    );
  };
  const promptRenderFooter = () => {
    return (
      <div className={styles.promptRenderFooter}>
        <Button
          shape="round"
          style={{
            color: confirmBtnColor,
            backgroundColor: confirmBtnBgColor,
            borderColor: confirmBtnBorderColor,
          }}
          onClick={onCancel}
        >
          {isCN ? '确定' : 'Sure'}
        </Button>
      </div>
    );
  };

  const getFooter = () => {
    if (footer && openHighConfig) {
      return filterDataFunc({
        data: props,
        filterFunc: footer,
      });
    }
    if (modalType === 'submit') {
      return submitRenderFooter();
    }
    return promptRenderFooter();
  };
  const getContent = () => {
    return modalPromptMsg;
  };

  return (
    <div>
      <Modal
        id={modalId}
        title={modalTitle}
        confirmLoading={loading}
        visible={visible}
        width={width}
        destroyOnClose={true}
        className={classnames(
          hiddenFooterTopLine && styles.hiddenFooterTopLine,
          hiddenCloseX && styles.hiddenCloseX,
          styles.modalBodyBottom,
        )}
        getContainer={getContainer()}
        maskClosable={maskClosable}
        footer={getFooter()}
        onCancel={onCancel}
        centered={true}
      >
        <div className={styles.content}>{getContent()}</div>
      </Modal>
    </div>
  );
};

export default CusModal;

import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'react-use';
import { Button, Modal } from 'antd';
import Demo from './Demo';
import LoadingForm from './LoadingForm';

import styles from './index.less';

function LoadingModal(props, ref) {
  const {
    form,
    value = {},
    visible = false,
    title = '自定义loading',
    onOk,
    onCancel,
    ...restProps
  } = props;
  const { validateFieldsAndScroll } = form;

  const [{ stateStyleConfig }, setState] = useState({
    stateStyleConfig: {},
  });
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })));

  const handleView = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      updateState({ stateStyleConfig: values });
    });
  }, [validateFieldsAndScroll]);

  const handleCancel = useCallback(() => {
    onCancel && onCancel();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      onOk && onOk(values);
    });
  }, [onOk, validateFieldsAndScroll]);

  useDeepCompareEffect(() => {
    updateState({ stateStyleConfig: value });
  }, [value]);

  return (
    <>
      <Modal
        title={title}
        width={960}
        {...restProps}
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose={true}
      >
        <div className={styles.container}>
          <Button className={styles.viewBtn} onClick={handleView}>
            预览
          </Button>
          <div className={styles.left}>
            <Demo value={stateStyleConfig?.loadingStyle} />
          </div>
          <div className={styles.right}>
            <LoadingForm form={form} value={stateStyleConfig} />
          </div>
        </div>
      </Modal>
    </>
  );
}

LoadingModal.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  value: PropTypes.object,
  visible: PropTypes.bool,
  title: PropTypes.string,
};

LoadingModal.Demo = Demo;

export default LoadingModal;

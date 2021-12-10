import React, { useState, Fragment, useCallback, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, InputNumber, Switch } from 'antd';
import AnimateFormModal from './AnimateFormModal';

const AnimateConfig = forwardRef((props, ref) => {
  const {
    onChange,
    value,
    formLabel,
    btnText = '设置页面脚本',
    btnSize = 'default',
    animationType,
  } = props;
  const [{ visible }, setState] = useState({ visible: false });

  /** 更新状态 */
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  /** 提交 */
  const handleOk = useCallback(
    values => {
      onChange && onChange(values);
      updateState({ visible: false });
    },
    [updateState, onChange],
  );

  /** 取消 */
  const handleCancel = useCallback(() => {
    updateState({ visible: false });
  }, [updateState]);

  /** 编辑 */
  const handleEdit = useCallback(() => {
    updateState({ visible: true });
  }, [updateState]);

  return (
    <Fragment>
      <Button ref={ref} type="primary" onClick={handleEdit} size={btnSize}>
        {btnText}
      </Button>

      <AnimateFormModal
        visible={visible}
        title={formLabel}
        data={value}
        animationType={animationType}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </Fragment>
  );
});

AnimateConfig.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  formLabel: PropTypes.string,
  btnText: PropTypes.string,
  btnSize: PropTypes.string,
  animationType: PropTypes.string,
};

export default AnimateConfig;

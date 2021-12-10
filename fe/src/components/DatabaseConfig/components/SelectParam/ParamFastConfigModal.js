import React, { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import AceEditor from '@/components/AceEditor';

function ParamFastConfigModal(props) {
  const { onOk, onCancel, visible, value: PropsValue = {} } = props;

  const [value, setValue] = useState(JSON.stringify(PropsValue || {}));

  const onChange = useCallback(v => {
    setValue(v);
  }, []);

  const handleOk = useCallback(() => {
    console.log('value', value);
    const newValue = JSON.parse(JSON.stringify(value));
    onOk && onOk(newValue);
  }, [value, onOk]);

  useDeepCompareEffect(() => {
    setValue(JSON.stringify(PropsValue || {}));
  }, [PropsValue]);

  return (
    <Modal
      width={760}
      title="编辑变量配置"
      visible={visible}
      maskClosable={false}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <AceEditor
        language="json"
        value={value}
        onChange={onChange}
        titleFiledArr={[]}
        showFooter={false}
      />
    </Modal>
  );
}

ParamFastConfigModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  value: PropTypes.object,
};

export default ParamFastConfigModal;

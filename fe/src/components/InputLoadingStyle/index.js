import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import LoadingModal from './LoadingModal';

function InputLoadingStyle(props, ref) {
  const { form, onChange, value } = props;
  const { validateFields } = form;

  const [{ visible }, setState] = useState({
    visible: false,
  });
  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })));

  const handleSet = useCallback(() => {
    updateState({ visible: true });
  }, []);

  const handleSubmit = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) return;
      onChange && onChange(values);
      updateState({ visible: false });
    });
  }, [onChange]);

  return (
    <>
      <Button type="primary" onClick={handleSet}>
        设置
      </Button>

      <LoadingModal
        form={form}
        title="自定义loading"
        visible={visible}
        value={value}
        onCancel={() => updateState({ visible: false })}
        onOk={handleSubmit}
      />
    </>
  );
}

InputLoadingStyle.propTypes = {
  form: PropTypes.object,
  onChange: PropTypes.func,
  value: PropTypes.object,
};

export default Form.create()(InputLoadingStyle);

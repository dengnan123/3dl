import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';

import styles from './index.less';

function CustomizeForm(props) {
  const { form } = props;
  const { validateFields } = form;

  const onFormSubmit = useCallback(() => {
    validateFields((errors, values) => {});
  }, [validateFields]);

  return (
    <div className={styles.container}>
      <div>sds </div>
      <Button onClick={onFormSubmit}>提交</Button>
    </div>
  );
}

CustomizeForm.propTypes = {
  onChange: PropTypes.func,
  form: PropTypes.object,
  style: PropTypes.object,
  data: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default Form.create()(CustomizeForm);

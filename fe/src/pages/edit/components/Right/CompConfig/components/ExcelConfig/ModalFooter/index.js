import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from './index.less';

function ModalFooter(props) {
  const { onCancel, onOk, okBtnProps, cancelBtnProps } = props;
  return (
    <div className={styles.footer}>
      <Button onClick={onCancel} {...cancelBtnProps}>
        取消
      </Button>
      <Button onClick={onOk} type="primary" {...okBtnProps}>
        确定
      </Button>
    </div>
  );
}

ModalFooter.propTypes = {
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  okBtnProps: PropTypes.object,
  cancelBtnProps: PropTypes.object,
};

export default ModalFooter;

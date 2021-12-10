import { Button } from 'antd';
import styles from './index.less';
export default props => {
  const { onOk, onCancel, children, ...restProps } = props;
  const submit = () => {
    onOk && onOk();
  };
  return (
    <div className={styles.modalWarp}>
      {children}

      <div className={styles.modalFooter}>
        <Button onClick={onCancel}>取消</Button>
        <Button className={styles.lastBtn} type="primary" onClick={submit} {...restProps}>
          提交
        </Button>
      </div>
    </div>
  );
};

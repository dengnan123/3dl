import { Icon } from 'antd';
import styles from './index.less';
export default props => {
  const { onClick, disabled, type } = props;
  const _onClick = () => {
    if (disabled) {
      return;
    }
    onClick();
  };
  return <Icon type={type} onClick={_onClick} className={disabled ? styles.dis : styles.icon} />;
};

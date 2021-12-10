import { Icon } from 'antd';
import styles from './index.less';
export default props => {
  const { onClick, disabled } = props;
  const _onClick = () => {
    if (disabled) {
      return;
    }
    onClick();
  };
  return <Icon type="left" onClick={_onClick} className={disabled ? styles.dis : styles.icon} />;
};

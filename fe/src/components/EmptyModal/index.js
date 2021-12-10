import { Button } from 'antd';
import styles from './index.less';

export default ({ valueText, loading, markSureEmptyPage }) => {
  return (
    <div>
      <div>{valueText}</div>
      <div className={styles.btnDiv}>
        <Button type="primary" loading={loading} onClick={markSureEmptyPage}>
          确认清空
        </Button>
      </div>
    </div>
  );
};

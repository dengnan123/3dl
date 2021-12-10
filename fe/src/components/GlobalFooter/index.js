import { Row } from 'antd';

import styles from './index.less';

function GlobalFooter(props) {
  return (
    <div className={styles.footer}>
      <Row type="flex" justify="center">
        DM V4.0.1
      </Row>
      <Row type="flex" justify="center">
        Copyright © DFocus Co.,Ltd. 保留所有权利 沪ICP备16054689号
      </Row>
    </div>
  );
}

export default GlobalFooter;

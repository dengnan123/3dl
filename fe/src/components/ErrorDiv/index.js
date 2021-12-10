import { Component } from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';
import { Button } from 'antd';
import styles from './index.less';

export default class ErrorPage extends Component {
  static propTypes = {
    errorContent: PropTypes.any,
  };

  render() {
    const { errorContent } = this.props;

    return (
      <div className={styles.promptPage}>
        <div className={styles.textBox}>
          <p className="expect-title">500</p>
          <p className="expect-text">页面出错了</p>
          <p className="expect-desc">{errorContent}</p>
          <div className={styles.btnDiv}>
            <Button
              type="primary"
              onClick={() => {
                window.location.reload();
              }}
            >
              刷新页面
            </Button>
            <Button
              type="primary"
              onClick={() => {
                router.push('/');
                setTimeout(() => {
                  window.location.reload();
                }, 300);
              }}
            >
              回到首页
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

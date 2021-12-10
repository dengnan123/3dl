import React, { useCallback } from 'react';
import router from 'umi/router';
import { Layout } from 'antd';
import logo from '@/assets/logo.png';
import styles from './index.less';

const { Header } = Layout;

function OverviewHeader(props) {
  const goHome = useCallback(() => {
    router.push('/screen/page');
  }, []);

  return (
    <Header className={styles.header}>
      <img src={logo} alt="logo" className={styles.logo} onClick={goHome} />
      <h1 className={styles.title} onClick={goHome}>
        DFocus 3DL
      </h1>
    </Header>
  );
}

OverviewHeader.propTypes = {};

export default OverviewHeader;

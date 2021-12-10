import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import router from 'umi/router';

import { Layout, Icon } from 'antd';
import UserProfile from '../UserProfile';

import logo from '../../assets/logo.png';
import styles from './index.less';

const { Header } = Layout;

function GlobalHeader(props) {
  const { collapsed, setCollapsed } = props;

  const goHome = useCallback(() => {
    router.push('/screen/page');
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  return (
    <Header className={styles.header}>
      <img src={logo} alt="logo" className={styles.logo} onClick={goHome} />
      <h1 className={styles.title} onClick={goHome}>
        DFocus 3DL
      </h1>

      <Icon
        className={styles.toggle}
        type={collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={toggleCollapsed}
      />

      <div className={styles.right}>
        <UserProfile />
      </div>
    </Header>
  );
}

GlobalHeader.propTypes = {
  toggleCollapsed: PropTypes.func,
  collapsed: PropTypes.bool,
  locationPathname: PropTypes.string,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ app, users }) => ({
  locationPathname: app.locationPathname,
  currentUser: users.currentUser,
});

export default connect(mapStateToProps)(GlobalHeader);

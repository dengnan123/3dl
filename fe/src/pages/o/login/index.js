/**
 * title: Login
 */
import { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { getLocale } from 'umi-plugin-react/locale';

// import { getToken } from '../../../helpers/storage';
// import { redirectTo } from '../../../helpers/view';

import LanguageSwitch from '../../../components/LanguageSwitch';
import GlobalFooter from '../../../components/GlobalFooter';
import AccountLogin from './components/AccountLogin';
import Register from './components/Register';
// import ForgetPassword from './components/ForgetPassword'
import Image from '../../../components/Image';
// import ParticleInit from './particle';
import logo from '../../../assets/logo.png';
import styles from './index.less';
// const PARTICLE_ID = 'particle-bg';

const { TabPane } = Tabs;
class Login extends Component {
  static propTypes = {
    imageInfo: PropTypes.string,
    bgImageInfo: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      loginType: 'LOGIN',
    };
  }

  // componentDidMount() {
  //   // redirect to default page if token was received
  //   // if (getToken()) {
  //   //   return redirectTo('/');
  //   // }
  //   ParticleInit(PARTICLE_ID);
  // }

  gotoForgetPassword = () => {
    this.setState({
      loginType: 'PASSWORD',
    });
  };

  gotoRegister = () => {
    this.setState({
      loginType: 'REGISTER',
    });
  };

  gotoLogin = () => {
    this.setState({
      loginType: 'LOGIN',
    });
  };

  render() {
    const { imageInfo, bgImageInfo } = this.props;
    const { url } = bgImageInfo;
    const { loginType } = this.state;
    return (
      <div className={styles.login} style={{ backgroundImage: url ? `url(${url})` : '' }}>
        <div className={styles.darkBg}></div>
        {/* <div
          id={PARTICLE_ID}
          style={{ top: 0, right: 0, bottom: 0, left: 0, position: 'absolute' }}
        /> */}
        <div className={styles.header}>
          <LanguageSwitch currentLang={getLocale()} />
        </div>

        <div className={styles.formBox}>
          <div className={styles.welcomeTitle}>
            <div className={styles.loginTitle}>
              <div className={styles.logo}>
                <Image alt="logo" className={styles.logo} src={imageInfo ? imageInfo : logo} />
              </div>
              <div className={styles.borderLine}></div>
              <div className={styles.sysTitle}>3DL</div>
            </div>
          </div>
          <Tabs className={styles.loginTabs} activeKey={loginType}>
            <TabPane tab={null} key="LOGIN">
              <AccountLogin
                gotoForgetPassword={this.gotoForgetPassword}
                gotoRegister={this.gotoRegister}
              />
            </TabPane>
            <TabPane tab={null} key="REGISTER">
              <Register gotoLogin={this.gotoLogin} />
            </TabPane>
          </Tabs>
        </div>
        <GlobalFooter />
      </div>
    );
  }
}

const mapStateToProps = ({ login: { imageInfo, bgImageInfo } }) => {
  return {
    imageInfo,
    bgImageInfo,
  };
};

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Login);

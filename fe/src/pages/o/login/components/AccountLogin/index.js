import { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Row, Button, Col, Input, Checkbox } from 'antd';

import {
  getToken,
  setDoNotRememberme,
  removeDoNotRememberme,
} from '../../../../../helpers/storage';

import { redirectTo } from '../../../../../helpers/view';
import IconFont from '../../../../../components/IconFont';
import { Unvisible, Visible } from '../../../../../assets/svg/login';

import styles from './index.less';

// eslint-disable-next-line no-useless-escape
// eslint-disable-next-line max-len
// const myreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class AccountLogin extends Component {
  static propTypes = {
    form: PropTypes.shape({
      getFieldValue: PropTypes.func,
      getFieldDecorator: PropTypes.func,
      validateFieldsAndScroll: PropTypes.func,
      resetFields: PropTypes.func,
    }),
    app: PropTypes.object,
    loading: PropTypes.object,
    goLogin: PropTypes.func,
    gotoForgetPassword: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      rememberme: false,
      passwordType: 'password',
    };
  }

  componentDidMount() {
    // 进入登录页默认不记住密码
    setDoNotRememberme();
    // redirect to default page if token was received
    if (getToken()) {
      return redirectTo('/');
    }
  }

  login = e => {
    e.preventDefault();
    const {
      form: { validateFieldsAndScroll },
      goLogin,
    } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      goLogin && goLogin(values);
    });
  };

  handleRememberme = e => {
    if (e.target.checked) {
      this.setState({
        rememberme: true,
      });
      return removeDoNotRememberme();
    }
    this.setState({
      rememberme: false,
    });
    return setDoNotRememberme();
  };

  changePasswordState = () => {
    const { passwordType } = this.state;
    this.setState({
      passwordType: passwordType === 'password' ? 'text' : 'password',
    });
  };

  // 点击忘记密码
  gotoPassword = () => {
    const {
      gotoForgetPassword,
      form: { resetFields },
    } = this.props;
    resetFields();
    gotoForgetPassword && gotoForgetPassword();
  };

  // 注册
  gotoRegister = () => {
    const {
      gotoRegister,
      form: { resetFields },
    } = this.props;
    resetFields();
    gotoRegister && gotoRegister();
  };

  render() {
    const { form, loading } = this.props;

    const { passwordType } = this.state;

    const { getFieldDecorator } = form;

    const isLoading = loading.effects['login/login'];
    return (
      <div className={styles.form}>
        <Form onSubmit={this.login}>
          <div className={styles.formTitle}>登录账号</div>
          <Form.Item className={styles.formItem} hasFeedback>
            {getFieldDecorator('userName', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '账号不能为空',
                },
                // {
                //   type: 'email',
                //   message: '请输入合法邮箱',
                // },
                {
                  max: 50,
                  message: '账号不能超过50个字符',
                },
              ],
            })(<Input placeholder="账号" className={styles.input} />)}
          </Form.Item>
          <Form.Item className={styles.formItem}>
            {getFieldDecorator('password', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '密码不能为空',
                },
              ],
            })(
              <Input
                autoComplete="new-password"
                type={passwordType}
                placeholder="密码"
                className={styles.input}
                suffix={
                  <IconFont
                    colorful
                    style={{ fontSize: 20 }}
                    type="svg"
                    renderSvg={passwordType === 'password' ? Unvisible : Visible}
                    onClick={this.changePasswordState}
                  />
                }
              />,
            )}
          </Form.Item>
          <Row type="flex" justify="space-between" className={styles.remembermeLine}>
            <Checkbox
              checked={this.state.rememberme}
              className={styles.remembermeCheckbox}
              onChange={this.handleRememberme}
            >
              记住我
            </Checkbox>
            {/* <Button type="link" className={styles.forgetPassword} onClick={this.gotoPassword}>
              忘记密码?
            </Button> */}
            {/* <Button type="link" className={styles.register} onClick={this.gotoRegister}>
              注册
            </Button> */}
          </Row>
          <Row type="flex" justify="center">
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.login}
              loading={isLoading}
              className={styles.submitBtn}
            >
              登录
            </Button>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ app, loading }) => {
  return {
    loading,
    app,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goLogin: payload => {
      return dispatch({
        type: 'login/login',
        payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AccountLogin));

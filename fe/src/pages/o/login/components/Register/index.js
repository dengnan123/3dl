import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { Form, Row, Button, Col, Input } from 'antd';

import IconFont from '../../../../../components/IconFont';
import { Unvisible, Visible } from '../../../../../assets/svg/login';

import styles from './index.less';

const namespace_login = 'login';

const Register = props => {
  const { registerUser, gotoLogin, form, loading } = props;
  const { getFieldDecorator, resetFields, validateFieldsAndScroll } = form;

  const [passwordType, setPasswordType] = useState('password');

  const changePasswordState = useCallback(() => {
    const type = passwordType === 'password' ? 'text' : 'password';
    setPasswordType(type);
  }, [passwordType]);

  const goBack = useCallback(() => {
    resetFields();
    gotoLogin && gotoLogin();
  }, [gotoLogin, resetFields]);

  const register = useCallback(
    e => {
      e.preventDefault();
      validateFieldsAndScroll((errors, values) => {
        if (errors) {
          return;
        }

        const { registerName, registerPassword } = values;

        const payload = {
          userName: registerName,
          password: registerPassword,
        };

        registerUser(payload).then(success => {
          if (success) {
            resetFields();
            goBack();
          }
        });
      });
    },
    [validateFieldsAndScroll, goBack, registerUser, resetFields],
  );

  return (
    <div className={styles.form}>
      <Form onSubmit={register}>
        <div className={styles.formTitle}>
          注册账号
          <Button type="link" className={styles.back} onClick={goBack}>
            返回
          </Button>
        </div>
        <Form.Item className={styles.formItem} hasFeedback>
          {getFieldDecorator('registerName', {
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
          })(<Input placeholder="请输入账号" className={styles.input} />)}
        </Form.Item>
        <Form.Item className={styles.formItem}>
          {getFieldDecorator('registerPassword', {
            validateTrigger: 'onBlur',
            rules: [
              {
                required: true,
                message: '密码不能为空',
              },
            ],
          })(
            <Row type="flex" justify="space-between">
              <Col span={20}>
                <Input
                  autoComplete="new-password"
                  type={passwordType}
                  placeholder="请输入密码"
                  className={styles.input}
                  suffix={
                    <IconFont
                      colorful
                      style={{ fontSize: 20 }}
                      type="svg"
                      renderSvg={passwordType === 'password' ? Unvisible : Visible}
                      onClick={changePasswordState}
                    />
                  }
                />
              </Col>
            </Row>,
          )}
        </Form.Item>

        <Row type="flex" justify="center">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading.effects[`${namespace_login}/registerUser`]}
            className={styles.submitBtn}
          >
            注册
          </Button>
        </Row>
      </Form>
    </div>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func,
  loading: PropTypes.object,
};

const mapStateToProps = ({ loading }) => ({ loading });

const mapDispatchToProps = dispatch => ({
  registerUser: payload => dispatch({ type: `${namespace_login}/registerUser`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Register));

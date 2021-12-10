import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Button } from 'antd';

import { queryRoleList } from '@/service';
import styles from './index.less';

function AddForm(props) {
  const { form, item, onClose, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields } = form;
  const [roleList, setRoleList] = useState([]);
  const { id, userName, email, roleList: itemRoles = [] } = item || {};
  useEffect(() => {
    queryRoleList().then(res => {
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        const { list } = data;
        setRoleList(list || []);
      }
    });
  }, []);

  const onFormSave = () => {
    validateFields((errors, values) => {
      if (!errors) {
        onSubmit && onSubmit({ ...values, id });
      }
    });
  };

  return (
    <React.Fragment>
      <Form className={styles.formMain}>
        <Form.Item label="用户名">
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名!',
              },
            ],
            initialValue: userName || null,
          })(<Input placeholder="请输入用户名" disabled={!!id} />)}
        </Form.Item>
        <Form.Item label="用户邮箱">
          {getFieldDecorator('email', {
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入用户邮箱!',
            //   },
            // ],
            initialValue: email || null,
          })(<Input placeholder="请输入用户邮箱" />)}
        </Form.Item>
        {!id && (
          <Form.Item label="初始密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入用户初始密码!',
                },
              ],
            })(<Input.Password placeholder="请输入用户初始密码" />)}
          </Form.Item>
        )}
        <Form.Item label="用户角色">
          {getFieldDecorator('roleIdList', {
            rules: [
              {
                required: true,
                message: '请选择用户所属角色!',
              },
            ],
            initialValue: itemRoles.map(i => i.id) || undefined,
          })(
            <Select placeholder="请选择用户所属角色" mode="multiple">
              {roleList.map(item => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
      </Form>
      <div className={styles.formBtns}>
        <Button type="default" onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onFormSave} loading={submitLoading}>
          保存
        </Button>
      </div>
    </React.Fragment>
  );
}

AddForm.propTypes = {
  form: PropTypes.object,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLoading: PropTypes.bool,
};

export default Form.create()(AddForm);

import React, { useState, Fragment } from 'react';
import CodeEdit from '../CodeEdit';
import { getFormDefValue } from '../../helpers/utils';
import { reap } from '../SafeReaper';
import { Form, Modal, Button, Input } from 'antd';
import styles from './index.less'
const FormItem = Form.Item;
export default ({
  form: { setFieldsValue, getFieldDecorator, getFieldsValue },
  style,
  form,
  formItemLayout,
  field,
  data,
  docLink,
  btnText = '数据格式配置'
}) => {
  const [vis, setVis] = useState(false);
  const handleCancel = () => {
    setVis(false);
  };
  const editProps = {
    update: v => {
      setFieldsValue({
        [field]: v || null, // 防止被过滤掉
      });
      setVis(false);
    },
    code: getFormDefValue(style, form, field),
    language: 'javascript',
    validateCallback(v) {
      let ok = true;
      try {
        // eslint-disable-next-line no-new-func
        const a = new Function('params', v);
        console.log('aaa', a);
        // a();
      } catch (err) {
        console.log('12313', err.message);
        ok = false;
      }
      return ok;
    },
  };

  const bthClick = () => {
    docLink && window.open(docLink);
  };

  return (
    <Fragment>
      <FormItem
        label=""
        {...formItemLayout}
        style={{
          display: 'none',
        }}
      >
        {getFieldDecorator(field, {
          initialValue: reap(data, field, null),
        })(<Input />)}
      </FormItem>
      <Button
        type="primary"
        onClick={() => {
          setVis(true);
        }}
      >
        {btnText}
      </Button>
      <Modal
        visible={vis}
        footer={null}
        onCancel={handleCancel}
        width={850}
        destroyOnClose={true}
        maskClosable={false}
      >
        <div className={styles.btnDiv}>
          <Button onClick={bthClick} type="primary">
            查看formatter开发文档
          </Button>
        </div>
        <CodeEdit {...editProps}></CodeEdit>
      </Modal>
    </Fragment>
  );
};

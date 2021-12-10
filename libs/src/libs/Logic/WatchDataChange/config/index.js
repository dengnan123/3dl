import React, { useState } from 'react';
import { debounce } from 'lodash';
import { checkAndTransformCode } from '../../../../helpers/compile';

import { Form, Switch, Modal, notification, Button } from 'antd';

import AnotherEditor from '../../../../components/CodeEdit';

const WatchDataChangeConfig = props => {
  const { updateStyle, style = {}, formItemLayout } = props;

  const [visible, setVisible] = useState(false);

  const onChangeSwitch = checked => {
    updateStyle({ ...style, openEqualFunc: checked });
  };

  const onCancelModal = () => {
    setVisible(false);
  };

  const update = equalFuncStr => {
    if (!equalFuncStr) {
      notification.open({
        message: 'Error',
        description: '请输入函数',
      });
      return;
    }
    const es5Code = checkAndTransformCode(equalFuncStr);
    if (!es5Code) {
      notification.open({
        message: 'Error',
        description: '函数有误',
      });
      return;
    }
    updateStyle({ ...style, equalFunc: equalFuncStr, equalFuncEs5Code: es5Code });
    onCancelModal();
  };

  const editProps = { update, disCode: false, language: 'javascript', code: style?.equalFunc };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="开启自定义数据变化比较函数" {...formItemLayout}>
        <Switch onChange={onChangeSwitch} checked={style?.openEqualFunc} />
      </Form.Item>
      {style?.openEqualFunc && (
        <Button
          onClick={() => {
            setVisible(true);
          }}
        >
          使用配置
        </Button>
      )}
      <Modal
        title={'比较函数'}
        width={1000}
        visible={visible}
        footer={null}
        onCancel={onCancelModal}
      >
        {visible && <AnotherEditor {...editProps} />}
      </Modal>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(WatchDataChangeConfig);

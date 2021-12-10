import React, { Fragment } from 'react';
import { Form, Switch, Button } from 'antd';
import ModalCodeEdit from '@/components/ModalCodeEdit';

const { Item } = Form;

export default ({
  form,
  form: { getFieldDecorator, setFieldsValue },
  formItemLayout,
  openHighConfig,
  data,
  options,
  setVis,
  _key,
  keyLabel,
  openKey,
  openKeyLabel,
  funcKey,
  funcKeyLabel,
  btnLabel,
  children,
}) => {
  const basicProps = {
    form,
    formItemLayout,
    data,
    btnText: '配置',
    btnSize: 'small',
  };
  const editProps = {
    ...basicProps,
    field: funcKey,
    formLabel: '配置函数',
    titleFiledArr: [
      {
        key: 'data',
        des: '组件传递的数据',
      },
    ],
  };

  const getButton = () => {
    if (!btnLabel) {
      return null;
    }
    return (
      <Item {...formItemLayout} label={btnLabel}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setVis(_key);
          }}
        >
          点击查看
        </Button>
      </Item>
    );
  };

  return (
    <Fragment>
      {!Boolean(openHighConfig) && children}

      <Item {...formItemLayout} label={openKeyLabel}>
        {getFieldDecorator(openKey, {
          initialValue: data?.[openKey],
          valuePropName: 'checked',
        })(<Switch />)}
      </Item>

      {openHighConfig ? (
        <Fragment>
          {getButton()}
          <ModalCodeEdit {...editProps}></ModalCodeEdit>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

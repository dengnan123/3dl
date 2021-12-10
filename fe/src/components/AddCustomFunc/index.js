import { Button, Modal, Form, Spin, Input, Icon, message, Select } from 'antd';
import React, { useState, useCallback } from 'react';
import { useDoApi } from '@/hooks/apihost';
import { add, update, del, findList } from '@/service/customFunc';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import { types } from '@/helpers/const';
import { copyToClip } from '@/helpers/utils';
import styles from './index.less';
import { loadCumtomFuncToWindow } from '@/hooks/usePreviewModal';
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const { Option } = Select;
const { TextArea } = Input;
const AddCustomFunc = ({
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields, resetFields },
  tagId,
  pageId,
}) => {
  const [modalVis, setVis] = useState(false);
  const [nowClick, setNow] = useState(null);

  const { state, doApi: fetchList } = useDoApi(findList, true, {
    tagId,
    pageId,
  });
  const list = state?.value?.data || [];

  loadCumtomFuncToWindow(list);
  const getListloading = state.loading;

  const { doApi } = useDoApi(del);
  const handleCancel = () => {
    setVis(false);
    resetFields();
    setNow(null);
  };
  const { state: addState, doApi: addFunc } = useDoApi(add);
  const addLoading = addState.loading;

  const { state: updateState, doApi: updateFunc } = useDoApi(update);
  const updateLoading = updateState.loading;

  const handleOk = () => {
    validateFields(async (errors, values) => {
      if (errors) {
        message.warning('请确认信息填写是否正确！');
        return;
      }
      console.log('valuesvaluesvalues', values);
      let res;
      if (nowClick) {
        // 更新
        const updateData = {
          ...values,
          tagId,
          pageId,
          id: nowClick?.funcId,
        };
        const oldEnName = nowClick.enName;
        if (values.enName === oldEnName) {
          delete updateData.enName;
        }
        res = await updateFunc(updateData);
      } else {
        // 新增
        res = await addFunc({
          ...values,
          tagId,
          pageId,
        });
      }
      if (res.errorCode !== 200) {
        message.error(res.message);
        return;
      }
      handleCancel();
      fetchList({
        tagId,
        pageId,
      });
    });
  };

  const delConfirm = v => {
    Modal.confirm({
      title: '确认！',
      content: '是否删除该数据源',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const { errorCode, message: msg } = await doApi(v);
        if (errorCode !== 200) {
          message.error(msg);
          return;
        }
        fetchList({
          tagId,
        });
      },
      onCancel() {},
    });
  };

  const basicProps = {
    form,
    formItemLayout,
    data: nowClick || {},
    btnText: '设置',
    btnSize: 'small',
  };
  const headerEditProps = {
    ...basicProps,
    field: 'customFunc',
    formLabel: '函数体',
    titleFiledArr: [],
  };

  const renderChildren = useCallback(arr => {
    return (arr || []).map(n => {
      const { enName, des } = n || {};
      return (
        <div className={styles.box} key={enName}>
          <h3>
            <span onClick={() => copyToClip(enName)}>{enName}</span>
            <Icon
              type="edit"
              onClick={() => {
                setNow(n);
                setVis(true);
              }}
            ></Icon>
          </h3>
          <p>描述：{des}</p>
        </div>
      );
    });
  }, []);

  return (
    <div className={styles.list}>
      <Button
        onClick={() => {
          setVis(true);
        }}
        className={styles.topDiv}
        type="primary"
        size="small"
      >
        新增
      </Button>
      <Spin spinning={getListloading}>{renderChildren(list)}</Spin>
      <Modal
        title="添加"
        confirmLoading={addLoading || updateLoading}
        visible={modalVis}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
        destroyOnClose={true}
      >
        <Form {...formItemLayout}>
          <Form.Item label="函数名">
            {getFieldDecorator('enName', {
              rules: [
                {
                  required: true,
                  message: '请填写函数名',
                },
              ],
              initialValue: nowClick?.enName,
            })(<Input placeholder="请填写函数名" />)}
          </Form.Item>
          {/* <Form.Item label="中文名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请填写中文名称',
                },
              ],
              initialValue: nowClick?.name,
            })(<Input placeholder="请填写中文名称" />)}
          </Form.Item> */}

          <Form.Item label="入参类型">
            {getFieldDecorator('inputType', {
              rules: [
                {
                  required: true,
                  message: '请选择入参类型',
                },
              ],
              initialValue: nowClick?.inputType,
            })(
              <Select style={{ width: 120 }}>
                {types.map(v => {
                  return <Option value={v.type}>{v.label}</Option>;
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="返回值类型">
            {getFieldDecorator('returnType', {
              rules: [
                {
                  required: true,
                  message: '请选择返回值类型',
                },
              ],
              initialValue: nowClick?.returnType,
            })(
              <Select style={{ width: 120 }}>
                {types.map(v => {
                  return <Option value={v.type}>{v.label}</Option>;
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="描述">
            {getFieldDecorator('des', {
              rules: [
                {
                  required: true,
                  message: '请填写函数描述',
                },
              ],
              initialValue: nowClick?.des,
            })(<TextArea placeholder="请填写函数描述" />)}
          </Form.Item>
          <ModalCodeEdit {...headerEditProps}></ModalCodeEdit>
        </Form>
      </Modal>
    </div>
  );
};

export default Form.create()(AddCustomFunc);

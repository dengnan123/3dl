import { Button, Modal, Form, Spin, Input, Icon, message } from 'antd';
import React, { useState, Fragment, useEffect } from 'react';
import { useDoApi } from '@/hooks/apihost';
import { addEnv, updateEnv, deleteEnv, findEnvList, updateEnvChecked } from '@/service/apiHost';
import { getParseSearch } from '@/helpers/utils';
import styles from './index.less';
import HoverList from '@/components/HoverList';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const EnvConfig = ({
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields, resetFields },
  tagId,
}) => {
  const { pageId } = getParseSearch();
  const [modalVis, setVis] = useState(false);
  const [nowClick, setNow] = useState(null);

  const { state: findEnvListState, doApi: fetchList } = useDoApi(findEnvList);
  const envList = findEnvListState?.value?.data || [];
  const fetchListLoading = findEnvListState?.loading;
  const {
    doApi: addFunc,
    state: { loading: addLoading },
  } = useDoApi(addEnv);
  const {
    doApi: updateFunc,
    state: { loading: updateLoading },
  } = useDoApi(updateEnv);
  const { doApi: delFunc } = useDoApi(deleteEnv);
  const { doApi: updateEnvCheckedFunc } = useDoApi(updateEnvChecked);

  useEffect(() => {
    fetchList({
      pageSize: 999,
      tagId,
    });
  }, [fetchList, tagId]);

  const handleCancel = () => {
    setVis(false);
    resetFields();
    setNow(null);
  };

  const handleOk = () => {
    validateFields(async (errors, values) => {
      if (errors) {
        message.warning('请确认信息填写是否正确！');
        return;
      }

      if (nowClick) {
        // 更新
        await updateFunc({
          ...nowClick,
          ...values,
        });
      } else {
        // 新增
        await addFunc({
          ...values,
          tagId,
        });
      }
      handleCancel();
      fetchList({
        pageSize: 999,
        tagId,
      });
    });
  };

  const checkClick = async v => {
    await updateEnvCheckedFunc({
      ...v,
      checked: 1,
    });
    fetchList({
      pageSize: 999,
      tagId,
    });
  };

  const delConfirm = v => {
    Modal.confirm({
      title: '确认！',
      content: '是否删除该数据源',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const { errorCode, message: msg } = await delFunc(v);
        if (errorCode !== 200) {
          message.error(msg);
          return;
        }
        fetchList({
          pageSize: 999,
          tagId,
        });
      },
      onCancel() {},
    });
  };

  const hoverListProps = {
    list: envList,
    renderContent({ v, nowHover, index, hoverIndex }) {
      return (
        <div key={v.id}>
          <Button
            type="link"
            onClick={() => {
              setNow(v);
              setVis(true);
            }}
          >
            {v.name}
          </Button>
          <span className={styles.icon}>
            {v.checked ? <Icon type="check-circle" className={styles.checked} /> : null}
            {index === hoverIndex && !v.checked && (
              <Fragment>
                <Icon
                  type="delete"
                  onClick={() => {
                    delConfirm(v);
                  }}
                ></Icon>
                <Icon
                  className={styles.lastIcon}
                  onClick={() => {
                    checkClick(v);
                  }}
                  type="check"
                />
              </Fragment>
            )}
          </span>
        </div>
      );
    },
  };
  return (
    <div>
      <Button
        onClick={() => {
          setVis(true);
        }}
        className={styles.topDiv}
      >
        新增
      </Button>
      <Spin spinning={fetchListLoading}>
        <HoverList {...hoverListProps}></HoverList>
      </Spin>
      <Modal
        title="添加"
        confirmLoading={addLoading || updateLoading}
        visible={modalVis}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        destroyOnClose={true}
      >
        <Form {...formItemLayout}>
          <Form.Item label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请填写名称',
                },
              ],
              initialValue: nowClick?.name,
            })(<Input placeholder="请填写名称" />)}
          </Form.Item>
          <Form.Item label="ENV_KEY">
            {getFieldDecorator('envKey', {
              rules: [
                {
                  required: true,
                  message: '请填写ENV_KEY',
                },
              ],
              initialValue: nowClick?.envKey,
            })(<Input placeholder="请填写ENV_KEY" />)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Form.create()(EnvConfig);

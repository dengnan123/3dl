import React, { useState, useEffect } from 'react';
import { Select, Radio, Form, Switch } from 'antd';
import { updateTagPageDefault } from '@/service';
import { useDoApi } from '@/hooks/apiHost';
import ModalWrapFooter from '@/components/ModalWrapFooter';

const { Option } = Select;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const PageSwitchConfig = ({
  tagId,
  getProjectPageList,
  onCancel,
  form,
  form: { getFieldDecorator, getFieldsValue, validateFields },
}) => {
  const [pageList, updateState] = useState([]);
  const [defPage, setDefPage] = useState({});

  const {
    state: { loading: updateLoading },
    doApi,
  } = useDoApi(updateTagPageDefault);

  useEffect(() => {
    if (!tagId) {
      return;
    }
    getProjectPageList({ tagId, current: 1, pageSize: 999 }).then(data => {
      const list = data?.list || [];
      updateState(list);
      const defData = list.filter(v => v.isDefault)[0];
      if (defData) {
        setDefPage(defData);
      }
    });
  }, [tagId, updateState, setDefPage, getProjectPageList]);

  // const highConfigProps = {
  //   form,
  //   formItemLayout,
  //   field: 'pageSwitchFunc',
  //   data: defPage,
  //   formLabel: '触发器函数',
  //   btnText: '设置',
  // };
  const wrapProps = {
    onCancel,
    onOk() {
      validateFields(async (errors, values) => {
        if (errors) return;
        const newData = {
          ...values,
          isDefault: 1,
          tagId,
        };
        await doApi(newData);
        onCancel();
      });
    },
    loading: updateLoading,
  };
  return (
    <ModalWrapFooter {...wrapProps}>
      <Form {...formItemLayout}>
        <Form.Item label="默认页面">
          {getFieldDecorator('id', {
            rules: [
              {
                required: true,
                message: '请选择项目默认页面',
              },
            ],
            initialValue: defPage?.id,
          })(
            <Radio.Group>
              {pageList.map(v => {
                return (
                  <Radio value={v.id} key={v.id}>
                    {v.name}
                  </Radio>
                );
              })}
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item label="页面切换动画">
          {getFieldDecorator('openPageSwitchAnimate', {
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
        <Form.Item label="进场动画">
          {getFieldDecorator('pageInAnimate')(
            <Select width={200}>
              {[].map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    123123
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="退场动画">
          {getFieldDecorator('pageOutAnimate', {
            initialValue: '',
          })(
            <Select width={200}>
              {[].map(v => {
                return (
                  <Option key={v.id} value={v.id}>
                    123123
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>
        {/* <ModalCodeEdit {...highConfigProps}></ModalCodeEdit> */}
      </Form>
    </ModalWrapFooter>
  );
};

export default Form.create()(PageSwitchConfig);

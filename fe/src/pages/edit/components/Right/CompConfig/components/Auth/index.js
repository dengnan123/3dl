import { Form, Switch, Select } from 'antd';
import { reap } from '@/components/SafeReaper';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import { Fragment, useEffect } from 'react';
import { debounce } from 'lodash';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const { Option } = Select;

const Auth = ({
  form,
  form: { getFieldDecorator, resetFields },
  data,
  dataSourceList = [],
  updateMockData,
}) => {
  const exampleEditProps = {
    form,
    formItemLayout,
    field: 'authFunc',
    data,
    formLabel: '权限函数',
    btnText: '点击设置',
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, data.id]);
  const openAuthFunc = data.openAuthFunc;

  return (
    <div style={{ padding: '0 10px' }}>
      <Form.Item label="开启权限" {...formItemLayout}>
        {getFieldDecorator('openAuthFunc', {
          initialValue: openAuthFunc,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openAuthFunc ? (
        <Fragment>
          <Form.Item label="数据源" {...formItemLayout}>
            {getFieldDecorator('authApiId', {
              initialValue: reap(data, 'authApiId', ''),
            })(
              <Select style={{ width: 120 }} placeholder="请选择权限数据源">
                {dataSourceList.map(v => {
                  return (
                    <Option value={v.id} key={v.id}>
                      {v.dataSourceName}
                    </Option>
                  );
                })}
              </Select>,
            )}
          </Form.Item>
          <ModalCodeEdit {...exampleEditProps}></ModalCodeEdit>
        </Fragment>
      ) : null}
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      attributeUpdate,
      isSelectCompInfo,
    } = props;
    const { id } = isSelectCompInfo;
    const newFields = getFieldsValue();
    attributeUpdate({
      id,
      data: newFields,
    });
  }, 200),
})(Auth);

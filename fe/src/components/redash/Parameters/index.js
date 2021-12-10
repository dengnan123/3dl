import { Form, Input, Select, DatePicker, InputNumber, Modal, Icon, Switch } from 'antd';
import { useState } from 'react';
import moment from 'moment';

import styles from './index.less';
const dateArr = [
  'datetime-local',
  'date',
  'datetime-with-seconds',
  'YYYYMMDD',
  'YYYYMM',
  'timestamp',
];
const { OptGroup } = Select;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const typeArr = [
  {
    label: 'String',
    value: 'String',
  },
  {
    label: 'Number',
    value: 'Number',
  },
  {
    label: 'Date',
    value: 'Date',
    children: [
      {
        label: 'YYYYMMDD',
        value: 'YYYYMMDD',
      },
      {
        label: 'YYYYMM',
        value: 'YYYYMM',
      },
      {
        label: '时间戳',
        value: 'timestamp',
      },
    ],
  },
];

const Parameters = ({
  value = [],
  form: { getFieldDecorator, validateFields, resetFields },
  form,
  onChange,
}) => {
  const [vis, setVis] = useState(false);
  const [nowV, setV] = useState();
  const onOk = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const { name } = values;
      const newValue = value.map(v => {
        if (v.name === name) {
          if (dateArr.includes(v?.type)) {
            return {
              ...v,
              ...values,
              value: v?.value && moment(v?.value).isValid() ? v?.value : undefined,
            };
          }
          return {
            ...v,
            ...values,
          };
        }
        return v;
      });
      onChange(newValue);
      setVis(false);
    });
  };
  const change = ({ name, value: nv }) => {
    const newValue = value.map(v => {
      if (v.name === name) {
        return {
          ...v,
          value: nv,
        };
      }
      return v;
    });
    onChange(newValue);
  };
  const getRenderByType = ({ type, value, name }) => {
    if (type === 'String') {
      return (
        <Input
          value={value}
          onChange={e => {
            change({
              name,
              value: e.target.value,
            });
          }}
        ></Input>
      );
    }
    if (type === 'Number') {
      return (
        <InputNumber
          onChange={v => {
            change({
              name,
              value: v,
            });
          }}
          value={value}
        ></InputNumber>
      );
    }
    if (dateArr.includes(type)) {
      return (
        <DatePicker
          onChange={(date, dateString) => {
            console.log('dateString', dateString);
            const value =
              type === 'timestamp' ? moment(dateString).valueOf() : moment(dateString).format(type);
            console.log('valuevaluevalue', value);
            change({
              name,
              value,
            });
          }}
          value={value && moment(value).isValid() ? moment(value) : undefined}
        ></DatePicker>
      );
    }
  };
  return (
    <div className={styles.wrap}>
      {value?.map(v => {
        const isRequired = v.isRequired ?? true;
        return (
          <div key={v.name}>
            <div className={styles.title}>
              <p>
                {isRequired && <span className={styles.required}>*</span>}
                <span className={styles.name}>{v.name}</span>
              </p>
              <div className={styles.icon}>
                <Icon
                  type="setting"
                  onClick={() => {
                    setV(v);
                    setVis(true);
                  }}
                />
              </div>
            </div>
            {getRenderByType(v)}
          </div>
        );
      })}
      {value?.length === 0 && '暂无变量'}
      <Modal
        visible={vis}
        title="参数设置"
        onCancel={() => {
          setVis(false);
        }}
        onOk={onOk}
        destroyOnClose={true}
      >
        <Form>
          <Form.Item label="名称" {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: nowV?.title || nowV?.name,
              rules: [{ required: true, message: '请输入查询名称' }],
            })(<Input placeholder="请输入接口名称" />)}
          </Form.Item>
          <Form.Item label="key" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: nowV?.name,
              rules: [{ required: true, message: '请输入查询名称' }],
            })(<Input placeholder="请输入接口名称" disabled />)}
          </Form.Item>
          <Form.Item label="类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: nowV?.type,
              rules: [{ required: true, message: '请输入查询名称' }],
            })(
              <Select>
                {typeArr.map(v => {
                  const { children } = v;
                  if (children?.length) {
                    return (
                      <OptGroup label={v.label}>
                        {children.map(v => {
                          return <Select.Option key={v.value}>{v.label}</Select.Option>;
                        })}
                      </OptGroup>
                    );
                  }
                  return <Select.Option key={v.value}>{v.label}</Select.Option>;
                })}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="是否必传" {...formItemLayout}>
            {getFieldDecorator('isRequired', {
              initialValue: nowV?.isRequired ?? true,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Form.create()(Parameters);

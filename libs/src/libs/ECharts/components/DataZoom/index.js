import React, { useCallback, useEffect } from 'react';
import { Form, Select, Switch, InputNumber, Button, Icon } from 'antd';

import { reap } from '../../../../components/SafeReaper';

import styles from './index.less';

const FormItem = Form.Item;

const DataZoom = props => {
  const {
    style,
    form: { getFieldDecorator, getFieldValue, setFieldsValue, resetFields },
    formItemLayout,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const handleAdd = useCallback(() => {
    const keys = getFieldValue('keys') || [];
    const newKeys = [
      ...keys,
      { type: 'slider', show: true, rangeMode: 'percent', start: 0, end: 100, realtime: true },
    ];
    setFieldsValue({ keys: newKeys });
  }, [getFieldValue, setFieldsValue]);

  const handleDelete = useCallback(
    index => {
      const keys = getFieldValue('keys') || [];
      const newKeys = keys.filter((n, i) => i !== index);
      setFieldsValue({ keys: newKeys });
    },
    [getFieldValue, setFieldsValue],
  );

  const dataZoom = reap(style, 'dataZoom', []);

  getFieldDecorator('keys', { initialValue: dataZoom });

  const initialKeys = getFieldValue('keys');

  return (
    <div>
      {initialKeys.map((n, index) => {
        const type = reap(n, `type`, 'inside');
        const show = reap(n, `show`, true);
        const rangeMode = reap(n, `rangeMode`, 'percent');
        const start = reap(n, `start`, 0);
        const end = reap(n, `end`, 100);
        const startValue = reap(n, `startValue`, 0);
        const endValue = reap(n, `endValue`, 100);
        const realtime = reap(n, `realtime`, true);
        const preventDefaultMouseMove = reap(n, `preventDefaultMouseMove`, false);
        const throttle = reap(n, `throttle`, 100);

        return (
          <div key={index} className={styles.box}>
            <span className={styles.count}>{index + 1}</span>
            <Icon className={styles.delete} type="close" onClick={() => handleDelete(index)} />
            <FormItem label="图表滚动类型" {...formItemLayout}>
              {getFieldDecorator(`dataZoom[${index}].type`, {
                initialValue: type,
              })(
                <Select>
                  <Select.Option value="inside">图表内滑动</Select.Option>
                  <Select.Option value="slider">滚动条</Select.Option>
                </Select>,
              )}
            </FormItem>

            {type === 'slider' && (
              <FormItem label="显示滚动条" {...formItemLayout}>
                {getFieldDecorator(`dataZoom[${index}].show`, {
                  initialValue: show,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            )}

            <FormItem label="滚动判断模式" {...formItemLayout}>
              {getFieldDecorator(`dataZoom[${index}].rangeMode`, {
                initialValue: rangeMode,
              })(
                <Select>
                  <Select.Option value="value">x轴数值</Select.Option>
                  <Select.Option value="percent">百分比</Select.Option>
                </Select>,
              )}
            </FormItem>

            {rangeMode === 'value' ? (
              <>
                <FormItem label="起点" {...formItemLayout}>
                  {getFieldDecorator(`dataZoom[${index}].startValue`, {
                    initialValue: startValue,
                  })(<InputNumber />)}
                </FormItem>

                <FormItem label="终点" {...formItemLayout}>
                  {getFieldDecorator(`dataZoom[${index}].endValue`, {
                    initialValue: endValue,
                  })(<InputNumber />)}
                </FormItem>
              </>
            ) : (
              <>
                <FormItem label="起点(百分比)" {...formItemLayout}>
                  {getFieldDecorator(`dataZoom[${index}].start`, {
                    initialValue: start,
                  })(<InputNumber min={0} max={100} />)}
                </FormItem>

                <FormItem label="终点(百分比)" {...formItemLayout}>
                  {getFieldDecorator(`dataZoom[${index}].end`, {
                    initialValue: end,
                  })(<InputNumber min={0} max={100} />)}
                </FormItem>
              </>
            )}

            {type === 'inside' && (
              <FormItem label="是否阻止 mousemove 事件的默认行为" {...formItemLayout}>
                {getFieldDecorator(`dataZoom[${index}].preventDefaultMouseMove`, {
                  initialValue: preventDefaultMouseMove,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            )}
            <FormItem label="滚动实时渲染图形" {...formItemLayout}>
              {getFieldDecorator(`dataZoom[${index}].realtime`, {
                initialValue: realtime,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>

            <FormItem label="渲染防抖时间(毫秒)" {...formItemLayout}>
              {getFieldDecorator(`dataZoom[${index}].throttle`, {
                initialValue: throttle,
              })(<InputNumber min={0} step={1} />)}
            </FormItem>
          </div>
        );
      })}

      {initialKeys.length < 2 && (
        <Button type="primary" block={true} onClick={handleAdd}>
          添加
        </Button>
      )}
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const { keys = [], dataZoom = [] } = getFieldsValue();
    console.log('keys', keys);
    console.log('dataZoom', dataZoom);
    updateStyle({
      ...style,
      dataZoom: keys.length !== dataZoom.length ? keys : keys.map((n, i) => dataZoom[i]),
    });
  },
})(DataZoom);

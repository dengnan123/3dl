import React, { useEffect } from 'react';
// import { SketchPicker } from 'react-color';
import InputColor from '../../../../components/InputColor';
import { Form, InputNumber, Switch, Select } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import { dealWithData } from '../../../../helpers/utils';
import { reap } from '../../../../components/SafeReaper';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const Legend = props => {
  const {
    style,
    form: { getFieldDecorator, getFieldsValue, setFieldsValue, resetFields },
    formItemLayout,
    updateStyle,
  } = props;

  // const _color = reap(style, 'legend.textStyle.color', '#fff');

  const { run } = useDebounceFn(() => {
    updateX();
  }, 500);

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  const updateX = () => {
    let newFields = getFieldsValue();
    const copyData = {
      ...newFields,
    };

    // 处理数据 把lineStyle_width 变成 lineStyle.width
    let finlData = dealWithData(copyData);

    updateStyle({
      ...style,
      legend: finlData,
    });
  };

  //   const axisLabel_interval = getFieldValue('axisLabel_interval');

  //   let axisLabel_interval_dis = false;

  //   if (axisLabel_interval) {
  //     axisLabel_interval_dis = true;
  //   }

  const handleChange = v => {
    setFieldsValue({ textAlign: v });
  };

  return (
    <div className={styles.textDiv}>
      <FormItem label="显示图例(legend)" {...formItemLayout}>
        {getFieldDecorator('show', {
          initialValue: reap(style, 'legend.show', true),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem>
      <FormItem label="图例字号" {...formItemLayout}>
        {getFieldDecorator('textStyle.fontSize', {
          initialValue: reap(style, 'legend.textStyle.fontSize', 12),
        })(<InputNumber onBlur={run} min={12} />)}
      </FormItem>
      <FormItem label="图例位置" {...formItemLayout}>
        {getFieldDecorator('position', {
          initialValue: reap(style, 'legend.position', 'bottom'),
        })(
          <Select style={{ width: 120 }} onChange={handleChange} onBlur={run}>
            <Option value="top">顶部</Option>
            <Option value="left">左侧</Option>
            <Option value="right">右侧</Option>
            <Option value="bottom">底部</Option>
          </Select>,
        )}
      </FormItem>
      {/* <FormItem label="图例高度" {...formItemLayout}>
        {getFieldDecorator('inverse', {
          initialValue: reap(style, 'legend.inverse', false),
          valuePropName: 'checked',
        })(<Switch onBlur={run} />)}
      </FormItem> */}
      {/* <FormItem label="图例过多时使用滚动条" {...formItemLayout}>
        {getFieldDecorator('axisLabel_fontSize', {
          initialValue: reap(style, 'legend.axisLabel.fontSize', 12),
        })(<InputNumber onBlur={run} min={12} />)}
      </FormItem> */}
      <FormItem label="图例对齐方式" {...formItemLayout}>
        {getFieldDecorator('align', {
          initialValue: reap(style, 'legend.align', 'auto'),
        })(
          <Select style={{ width: 120 }} onChange={handleChange} onBlur={run}>
            <Option value="auto">自动</Option>
            <Option value="left">居左</Option>
            <Option value="right">居右</Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label="图例字体颜色" {...formItemLayout}>
        {getFieldDecorator('textStyle.color', {
          initialValue: reap(style, 'legend.textStyle.color', ''),
        })(<InputColor onBlur={run} />)}
      </FormItem>
    </div>
  );
};

export default Form.create()(Legend);

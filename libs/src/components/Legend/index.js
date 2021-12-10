import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Form, InputNumber, Switch, Input, Select } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import { reap } from '../SafeReaper';
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

  const _color = reap(style, 'legend.textStyle.color', '#fff');

  const [selfColor, setColor] = useState(_color);
  const [{ top }, setLocaltion] = useState({});

  const { run } = useDebounceFn(() => {
    updateX();
  }, 500);

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  //   const fields = [
  //     {
  //       field: 'show',
  //       fieldType: 'Boolen',
  //     },
  //     {
  //       field: 'axisLabel_interval',
  //       fieldType: 'Boolen',
  //     },
  //     {
  //       field: 'axisLabel_rotate',
  //       fieldType: 'Number',
  //     },
  //     {
  //       field: 'axisLabel_fontSize',
  //       fieldType: 'Number',
  //     },
  //   ];

  const dealWithData = data => {
    let newData = {
      ...data,
    };
    const keys = Object.keys(data);
    if (!keys.length) {
      return {};
    }
    console.log('keys', keys);
    for (const key of keys) {
      const arr = key.split('_');
      if (arr.length === 2) {
        if (!newData[arr[0]]) {
          newData[arr[0]] = {};
        }
        newData[arr[0]][arr[1]] = newData[key];
        delete newData[key];
      }
    }
    return newData;
  };

  const updateX = () => {
    setLocaltion({
      left: null,
      top: null,
    });
    let newFields = getFieldsValue();
    const copyData = {
      ...newFields,
    };

    // for (const item of fields) {
    //   const { fieldType, field } = item;
    //   if (!newFields[field]) {
    //     continue;
    //   }
    //   if (fieldType === 'Number') {
    //     copyData[field] = parseFloat(copyData[field]);
    //   }
    // }

    // 处理数据 把lineStyle_width 变成 lineStyle.width
    let finlData = dealWithData(copyData);

    updateStyle({
      ...style,
      legend: finlData,
    });
  };

  const onChangeComplete = color => {
    const bgc = color.hex;
    setColor(bgc);
    setFieldsValue({ axisLabel_color: bgc });
  };

  const onClick = ({ left, top }) => {
    setLocaltion({
      left,
      top,
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
        {getFieldDecorator('textStyle_fontSize', {
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
        {getFieldDecorator('textStyle_color', {
          initialValue: selfColor,
        })(
          <Input
            onBlur={run}
            onClick={e => {
              onClick({
                left: e.pageX,
                top: e.pageY,
              });
            }}
          />,
        )}
      </FormItem>

      {top && (
        <div
          style={{ top, position: 'absolute', backgroundColor: '#ffff', zIndex: 100 }}
          id="SketchPicker"
        >
          <SketchPicker color={selfColor} onChangeComplete={onChangeComplete}></SketchPicker>
        </div>
      )}
    </div>
  );
};

export default Form.create()(Legend);

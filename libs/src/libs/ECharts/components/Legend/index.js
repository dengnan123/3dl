import React from 'react';
import InputColor from '../../../../components/InputColor';
import { Form, InputNumber, Switch, Select, Input, Tooltip, Icon } from 'antd';
import FormaterItem from '../../../../components/FormaterItem';
import { reap } from '../../../../components/SafeReaper';
import { legendFormatter } from '../../utils/const';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const Legend = props => {
  const {
    style,
    form,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;

  const legend = reap(style, 'legend', {});

  const formaterItemProps = {
    form,
    style,
    formItemLayout,
    field: 'formatter',
    data: legend,
    docLink: legendFormatter,
  };

  const Dom = (
    <span>
      <span>图例布局( horizontal / vertical )</span>
      <Tooltip placement="topLeft" title="在饼图中只有 ‘顶部’, ‘底部’, 水平属性才会生效">
        <Icon type="exclamation-circle" />
      </Tooltip>
    </span>
  );

  return (
    <div className={styles.textDiv}>
      <FormItem label="显示图例(legend)" {...formItemLayout}>
        {getFieldDecorator('show', {
          initialValue: reap(legend, 'show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="图例间距" {...formItemLayout}>
        {getFieldDecorator('itemGap', {
          initialValue: reap(legend, 'itemGap', 10),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="图例字号" {...formItemLayout}>
        {getFieldDecorator('textStyle.fontSize', {
          initialValue: reap(legend, 'textStyle.fontSize', 12),
        })(<InputNumber min={12} />)}
      </FormItem>

      <FormItem label="图例图标设置" {...formItemLayout}>
        {getFieldDecorator(`data.icon`, {
          initialValue: reap(legend, `data.icon`, ''),
        })(<TextArea />)}
      </FormItem>

      <FormItem label="图例位置" {...formItemLayout}>
        {getFieldDecorator('position', {
          initialValue: reap(legend, 'position', 'top'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="top">顶部</Option>
            <Option value="left">左侧</Option>
            <Option value="right">右侧</Option>
            <Option value="bottom">底部</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="图例距离边框距离" {...formItemLayout}>
        {getFieldDecorator('distance', {
          initialValue: reap(legend, 'distance', 0),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label={Dom} {...formItemLayout}>
        {getFieldDecorator('orient', {
          initialValue: reap(legend, 'orient', 'horizontal'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="horizontal">水平</Option>
            <Option value="vertical">竖直</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="图例对齐方式" {...formItemLayout}>
        {getFieldDecorator('align', {
          initialValue: reap(legend, 'align', 'auto'),
        })(
          <Select style={{ width: 120 }}>
            <Option value="auto">自动</Option>
            <Option value="left">右侧文字</Option>
            <Option value="right">左侧文字</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="图例字体颜色" {...formItemLayout}>
        {getFieldDecorator('textStyle.color', {
          initialValue: reap(legend, 'textStyle.color', '#1d1818'),
        })(<InputColor />)}
      </FormItem>
      <FormaterItem {...formaterItemProps} />
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
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      legend: newFields,
    });
  },
})(Legend);

import React, { Fragment } from 'react';
import InputColor from '../../../../components/InputColor';
import { Form, InputNumber, Switch, Select } from 'antd';
import FormaterItem from '../../../../components/FormaterItem';
import { reap } from '../../../../components/SafeReaper';
import { filterObj, getFormDefValue } from '../../../../helpers/utils';
import { tooltipFormatter } from '../../utils/const';
import styles from './index.less';
const FormItem = Form.Item;
const { Option } = Select;
const Tooltip = props => {
  const {
    form,
    style,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;
  const tooltip = reap(style, 'tooltip', {});
  const doTimer = getFormDefValue(tooltip, form, 'doTimer');
  const show = getFormDefValue(tooltip, form, 'show', true);
  const formaterItemProps = {
    form,
    style,
    formItemLayout,
    field: 'formatter',
    data: tooltip,
    docLink: tooltipFormatter,
  };

  return (
    <div className={styles.textDiv}>
      <FormItem label="开启浮动提示" {...formItemLayout}>
        {getFieldDecorator('show', {
          initialValue: reap(tooltip, 'show', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      {show && (
        <Fragment>
          <FormItem label="背景色" {...formItemLayout}>
            {getFieldDecorator('backgroundColor', {
              initialValue: reap(tooltip, 'backgroundColor', 'rgba(50,50,50,0.7)'),
            })(<InputColor />)}
          </FormItem>

          <FormItem label="浮动类型" {...formItemLayout}>
            {getFieldDecorator('trigger', {
              initialValue: reap(tooltip, 'trigger', 'item'),
            })(
              <Select style={{ width: 120 }}>
                <Option value="item">item</Option>
                <Option value="axis">axis</Option>
              </Select>,
            )}
          </FormItem>
          <FormaterItem {...formaterItemProps}></FormaterItem>
          <FormItem label="开启提示轮播" {...formItemLayout}>
            {getFieldDecorator('doTimer', {
              initialValue: reap(tooltip, 'doTimer', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>

          {doTimer && (
            <FormItem label="轮播间隔秒数" {...formItemLayout}>
              {getFieldDecorator('timer', {
                initialValue: reap(tooltip, 'timer', 3),
              })(<InputNumber min={0} />)}
            </FormItem>
          )}
        </Fragment>
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
    const newFields = getFieldsValue();
    const _obj = filterObj(newFields, [undefined, 0]);
    updateStyle({
      ...style,
      tooltip: _obj,
    });
  },
})(Tooltip);

import React from 'react';
import { Form, Input, Select } from 'antd';

import { reap } from '../../../../components/SafeReaper';
import styles from './index.less';
const FormItem = Form.Item;

function getValueFromEvent(e) {
  return e.target.value.replace(/[^0-9\\.\\^0-9]/gi, '');
}

const Gird = props => {
  const {
    style,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;

  const leftAddon = getFieldDecorator('leftType', {
    initialValue: reap(style, 'grid.leftType', '%'),
  })(
    <Select>
      <Select.Option value="%">%</Select.Option>
      <Select.Option value="px">px</Select.Option>
    </Select>,
  );

  const topAddon = getFieldDecorator('topType', {
    initialValue: reap(style, 'grid.topType', 'px'),
  })(
    <Select>
      <Select.Option value="%">%</Select.Option>
      <Select.Option value="px">px</Select.Option>
    </Select>,
  );

  const rightAddon = getFieldDecorator('rightType', {
    initialValue: reap(style, 'grid.rightType', '%'),
  })(
    <Select>
      <Select.Option value="%">%</Select.Option>
      <Select.Option value="px">px</Select.Option>
    </Select>,
  );

  const bottomAddon = getFieldDecorator('bottomType', {
    initialValue: reap(style, 'grid.bottomType', 'px'),
  })(
    <Select>
      <Select.Option value="%">%</Select.Option>
      <Select.Option value="px">px</Select.Option>
    </Select>,
  );

  return (
    <div className={styles.textDiv}>
      <FormItem label="左边距" {...formItemLayout}>
        {getFieldDecorator('left', {
          initialValue: reap(style, 'grid.left', 0),
          getValueFromEvent,
        })(<Input addonAfter={leftAddon} />)}
      </FormItem>
      <FormItem label="顶边距" {...formItemLayout}>
        {getFieldDecorator('top', {
          initialValue: reap(style, 'grid.top', 0),
          getValueFromEvent,
        })(<Input addonAfter={topAddon} />)}
      </FormItem>

      <FormItem label="右边距" {...formItemLayout}>
        {getFieldDecorator('right', {
          initialValue: reap(style, 'grid.right', 0),
          getValueFromEvent,
        })(<Input addonAfter={rightAddon} />)}
      </FormItem>

      <FormItem label="底边距" {...formItemLayout}>
        {getFieldDecorator('bottom', {
          initialValue: reap(style, 'grid.bottom', 0),
          getValueFromEvent,
        })(<Input addonAfter={bottomAddon} />)}
      </FormItem>
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
      grid: newFields,
    });
  },
})(Gird);

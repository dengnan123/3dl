import React, { Component } from 'react';

import { debounce } from 'lodash';
import { reap } from '../../../../components/SafeReaper';

import { Form, InputNumber, Switch } from 'antd';
import InputColor from '../../../../components/InputColor';

import FilterFormItem from '../../../../components/FilterFormItem';
import styles from './index.less';

class RankTableConfig extends Component {
  render() {
    const {
      style,
      formItemLayout,
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
    } = this.props;

    return (
      <div>
        <Form.Item label="自定义内容">
          {getFieldDecorator('customizedContent', {
            valuePropName: 'checked',
            initialValue: style?.customizedContent || false,
          })(<Switch />)}
        </Form.Item>
        <Form.Item label="rawHTML">
          <FilterFormItem
            form={{ getFieldDecorator, getFieldValue, setFieldsValue }}
            formFieldName="rawHTML"
            initialValue={style?.rawHTML || ''}
            fieldLabel=""
            disabled={!style?.customizedContent}
          />
        </Form.Item>

        <Form.Item label="自动滚动" {...formItemLayout}>
          {getFieldDecorator('autoScroll', {
            initialValue: reap(style, 'autoScroll', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
        {reap(style, 'autoScroll', false) && (
          <Form.Item label="滚动速度" {...formItemLayout}>
            {getFieldDecorator('speed', {
              initialValue: reap(style, 'speed', 200),
            })(<InputNumber min={100} max={1000} step={100} />)}
          </Form.Item>
        )}
        <Form.Item label="排名前三字体颜色" {...formItemLayout}>
          {getFieldDecorator('rankFontColor', {
            initialValue: reap(style, 'rankFontColor', '#ffffff'),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="排名前三图标颜色" {...formItemLayout}>
          <div className={styles.item}>
            <Form.Item>
              {getFieldDecorator('rank1', {
                initialValue: reap(style, 'rank1', '#ff8e36'),
              })(<InputColor placeholder="第一名" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('rank2', {
                initialValue: reap(style, 'rank2', '#ffaf36'),
              })(<InputColor placeholder="第二名" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('rank3', {
                initialValue: reap(style, 'rank3', '#ffd736'),
              })(<InputColor placeholder="第三名" />)}
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item label="排名前三图标大小" {...formItemLayout}>
          {getFieldDecorator('rankIconWidth', {
            initialValue: reap(style, 'rankIconWidth', 19),
          })(<InputNumber min={0} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="显示排名变化图标" {...formItemLayout}>
          {getFieldDecorator('showRankIcon', {
            initialValue: reap(style, 'showRankIcon', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="排名变动上升颜色" {...formItemLayout}>
          {getFieldDecorator('rankUpColor', {
            initialValue: reap(style, 'rankUpColor', '#31c58d'),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="排名变动下降颜色" {...formItemLayout}>
          {getFieldDecorator('rankDownColor', {
            initialValue: reap(style, 'rankDownColor', '#eb4b19'),
          })(<InputColor />)}
        </Form.Item>
      </div>
    );
  }
}

RankTableConfig.propTypes = {};

export default Form.create({
  onFieldsChange: debounce((props, changeFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  }),
})(RankTableConfig);

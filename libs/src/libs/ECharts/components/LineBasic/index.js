import React from 'react';
import { merge } from 'lodash';
import { Form, InputNumber, Switch, Select } from 'antd';
import { reap } from '../../../../components/SafeReaper';
import { filterObj, getFormDefValue } from '../../../../helpers/utils';
import styles from './index.less';
import InputColor from '../../../../components/InputColor';
const FormItem = Form.Item;
const LineBasic = props => {
  const {
    style,
    form,
    form: { getFieldDecorator, getFieldValue },
    formItemLayout,
  } = props;

  // const
  const series = reap(style, 'series', {});
  const areaStyle = getFieldValue('areaStyle.openAreaStyle');
  const step = getFieldValue('step');
  const smooth = getFieldValue('smooth');

  let areaStyle_opacity_dis = false;
  let step_dis = false;
  let smooth_dis = false;
  if (areaStyle) {
    areaStyle_opacity_dis = true;
  }

  if (step) {
    smooth_dis = true;
  }

  if (smooth) {
    step_dis = true;
  }

  const openAreaStyle = getFormDefValue(style, form, 'areaStyle.openAreaStyle', false);

  console.log('openAreaStyleopenAreaStyle', openAreaStyle);

  return (
    <div className={styles.textDiv}>
      <FormItem label="阶梯线图" {...formItemLayout}>
        {getFieldDecorator('step', {
          initialValue: reap(series, 'step', false),
          valuePropName: 'checked',
        })(<Switch disabled={step_dis} />)}
      </FormItem>
      <FormItem label="线条平滑" {...formItemLayout}>
        {getFieldDecorator('smooth', {
          initialValue: reap(series, 'smooth', false),
          valuePropName: 'checked',
        })(<Switch disabled={smooth_dis} />)}
      </FormItem>
      <FormItem label="折线/柱状体上展示数据" {...formItemLayout}>
        {getFieldDecorator('showSymbol', {
          initialValue: reap(series, 'showSymbol', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="标记图形" {...formItemLayout}>
        {getFieldDecorator('symbol', {
          initialValue: reap(series, 'symbol', 'emptyCircle'),
        })(
          <Select>
            {[
              'emptyCircle',
              'circle',
              'rect',
              'roundRect',
              'triangle',
              'diamond',
              'pin',
              'arrow',
              'none',
            ].map(n => {
              return (
                <Select.Option key={n} value={n}>
                  {n}
                </Select.Option>
              );
            })}
          </Select>,
        )}
      </FormItem>

      <FormItem label="图形尺寸" {...formItemLayout}>
        {getFieldDecorator('symbolSize', {
          initialValue: reap(series, 'symbolSize', 4),
        })(<InputNumber step={1} min={0} />)}
      </FormItem>

      <FormItem label="设置为面积图" {...formItemLayout}>
        {getFieldDecorator('areaStyle.openAreaStyle', {
          initialValue: reap(series, 'areaStyle.openAreaStyle', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {reap(series, 'areaStyle.openAreaStyle', false) && (
        <FormItem label="是否开启渐变色" {...formItemLayout}>
          {getFieldDecorator('areaStyle.isOpenGradient', {
            initialValue: reap(series, 'areaStyle.isOpenGradient', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </FormItem>
      )}

      {areaStyle_opacity_dis && (
        <FormItem label="面积透明度" {...formItemLayout}>
          {getFieldDecorator('areaStyle.opacity', {
            initialValue: reap(series, 'areaStyle.opacity', 0.5),
          })(<InputNumber />)}
        </FormItem>
      )}

      <FormItem label="线条粗度" {...formItemLayout}>
        {getFieldDecorator('lineStyle.width', {
          initialValue: reap(series, 'lineStyle.width', 1),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="暂无数据颜色" {...formItemLayout}>
        {getFieldDecorator('notDataColor', {
          initialValue: reap(series, 'notDataColor', '#0089e9'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="暂无数据字体" {...formItemLayout}>
        {getFieldDecorator('notDataFontSize', {
          initialValue: reap(series, 'notDataFontSize', 20),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="暂无数据上边距" {...formItemLayout}>
        {getFieldDecorator('notDataPadding', {
          initialValue: reap(series, 'notDataPadding', 20),
        })(<InputNumber />)}
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
    const _obj = filterObj(newFields, ['', undefined]);

    const newSeries = merge({}, style.series, _obj);
    updateStyle({
      ...style,
      series: newSeries,
    });
  },
})(LineBasic);

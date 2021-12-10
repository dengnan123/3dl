import React, { Fragment } from 'react';
import { merge } from 'lodash';
import { Form, Switch, InputNumber, Select, Icon, Button } from 'antd';
import { filterObj, getFormDefValue } from '../../../../helpers/utils';
import InputColor from '../../../../components/InputColor';
import FormaterItem from '../../../../components/FormaterItem';
import { reap } from '../../../../components/SafeReaper';
import { barFormatter } from '../../utils/const';
import styles from './index.less';
const FormItem = Form.Item;
// const { Option } = Select;
const { Option } = Select;
const BarBasic = props => {
  const {
    style,
    form,
    form: { getFieldDecorator, getFieldValue, setFieldsValue },
    formItemLayout,
    mockData = {},
  } = props;

  const { series = [] } = mockData;

  const seriesConfig = reap(style, 'series', {});

  // const openCustomColor = getFormDefValue(seriesConfig, form, 'openCustomColor');
  const barGap = getFormDefValue(seriesConfig, form, 'barGap');
  const stack = getFormDefValue(seriesConfig, form, 'stack');
  const position = getFormDefValue(seriesConfig, form, 'label.position');
  const labelShow = getFormDefValue(seriesConfig, form, 'label.show');

  const formaterItemProps = {
    form,
    style,
    formItemLayout,
    field: 'label.formatter',
    data: seriesConfig,
    docLink: barFormatter,
  };

  const handleAdd = () => {
    const newKeys = getFieldValue('barWidthKeys') || [];
    const lastCount = newKeys.length ? newKeys[newKeys.length - 1].count || 0 : 0;
    const minCount = newKeys.length ? lastCount + 1 : 0;
    newKeys.push({ count: minCount, width: 20 });
    setFieldsValue({ barWidthKeys: newKeys });
  };

  const handleRemove = curIndex => {
    const newKeys = getFieldValue('barWidthKeys').filter((n, index) => index !== curIndex);
    setFieldsValue({ barWidthKeys: newKeys });
  };

  const initialKeys = reap(style, 'series.barWithList', []);

  getFieldDecorator('barWidthKeys', {
    initialValue: initialKeys,
  });

  const newKeys = getFieldValue('barWidthKeys');

  return (
    <div className={styles.textDiv}>
      <FormItem label="X/Y轴翻转" {...formItemLayout}>
        {getFieldDecorator('xyInverse', {
          initialValue: reap(style, 'xyInverse', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="柱状宽度比例(%)" {...formItemLayout}>
        {getFieldDecorator('barWidth', {
          initialValue: reap(seriesConfig, 'barWidth', 0),
        })(<InputNumber max={100} min={5} />)}
      </FormItem>

      <FormItem label="圆角(左上)" {...formItemLayout}>
        {getFieldDecorator('barBorderLTRadius', {
          initialValue: reap(seriesConfig, 'barBorderLTRadius', 0),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="圆角(右上)" {...formItemLayout}>
        {getFieldDecorator('barBorderRTRadius', {
          initialValue: reap(seriesConfig, 'barBorderRTRadius', 0),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="圆角(左下)" {...formItemLayout}>
        {getFieldDecorator('barBorderRBRadius', {
          initialValue: reap(seriesConfig, 'barBorderRBRadius', 0),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="圆角(右下)" {...formItemLayout}>
        {getFieldDecorator('barBorderLBRadius', {
          initialValue: reap(seriesConfig, 'barBorderLBRadius', 0),
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="是否开启自定义柱状宽度比例" {...formItemLayout}>
        {getFieldDecorator('customizeBarWidth', {
          initialValue: reap(seriesConfig, 'customizeBarWidth', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {reap(seriesConfig, 'customizeBarWidth', false) && (
        <>
          {newKeys.map((item, index) => {
            const lastCount = index === 0 ? 0 : newKeys[index - 1].count || 0;
            const minCount = index === 0 ? 0 : lastCount + 1;
            return (
              <div className={styles.item} key={index}>
                小于
                <Form.Item>
                  {getFieldDecorator(`barWithList[${index}].count`, {
                    initialValue: item.count,
                  })(<InputNumber min={minCount} />)}
                </Form.Item>
                条，宽度比例(%)为：
                <Form.Item>
                  {getFieldDecorator(`barWithList[${index}].width`, {
                    initialValue: item.width,
                  })(<InputNumber min={0} max={100} />)}
                </Form.Item>
                {newKeys.length > 1 && (
                  <Icon type="minus-circle" onClick={() => handleRemove(index)} />
                )}
              </div>
            );
          })}

          <Form.Item>
            <Button type="primary" onClick={handleAdd}>
              +添加
            </Button>
          </Form.Item>
        </>
      )}

      <FormItem label="柱状是否展示数据" {...formItemLayout}>
        {getFieldDecorator('label.show', {
          initialValue: reap(seriesConfig, 'label.show', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {labelShow && (
        <Fragment>
          <FormItem label="数据颜色" {...formItemLayout}>
            {getFieldDecorator('label.color', {
              initialValue: reap(seriesConfig, 'label.color'),
            })(<InputColor />)}
          </FormItem>

          <FormItem label="数据字体大小" {...formItemLayout}>
            {getFieldDecorator('label.fontSize', {
              initialValue: reap(seriesConfig, 'label.fontSize'),
            })(<InputNumber min={0} step={1} />)}
          </FormItem>

          <FormItem label="数据位置类型" {...formItemLayout}>
            {getFieldDecorator('label.position', {
              initialValue: reap(seriesConfig, 'label.position', 'inside'),
            })(
              <Select style={{ width: 120 }}>
                <Option value="inside">inside</Option>
                <Option value="insideTop">insideTop</Option>
              </Select>,
            )}
          </FormItem>

          {position === 'insideTop' && (
            <FormItem label="到顶部距离" {...formItemLayout}>
              {getFieldDecorator('label.distance', {
                initialValue: reap(seriesConfig, 'label.distance', 5),
              })(<InputNumber mix={0} />)}
            </FormItem>
          )}
          <FormaterItem {...formaterItemProps} />
        </Fragment>
      )}

      {/* <FormItem label="开启图表自定义配色" {...formItemLayout}>
        {getFieldDecorator('openCustomColor', {
          initialValue: reap(seriesConfig, 'openCustomColor', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      {openCustomColor &&
        series.map((v, index) => {
          return (
            <FormItem label={`数据${index + 1}颜色设置`} {...formItemLayout}>
              {getFieldDecorator(`customColor${index}`, {
                initialValue: reap(seriesConfig, `colors[${index}].customColor`, ''),
              })(<InputColor />)}
            </FormItem>
          );
        })} */}
      <FormItem label="数据堆叠显示" {...formItemLayout}>
        {getFieldDecorator('stack', {
          initialValue: reap(seriesConfig, 'stack', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      {stack && (
        <Fragment>
          <FormItem label="数据堆叠间隔" {...formItemLayout}>
            {getFieldDecorator('stackInterval', {
              initialValue: reap(seriesConfig, 'stackInterval', 0),
            })(<InputNumber mix={0} />)}
          </FormItem>

          <FormItem label="数据堆叠间隔背景色" {...formItemLayout}>
            {getFieldDecorator('stackIntervalBgc', {
              initialValue: reap(seriesConfig, 'stackIntervalBgc', '#fffff'),
            })(<InputColor />)}
          </FormItem>
        </Fragment>
      )}

      <FormItem label="数据重合显示" {...formItemLayout}>
        {getFieldDecorator('barGap', {
          initialValue: reap(seriesConfig, 'barGap', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      {barGap &&
        series.map((v, index) => {
          return (
            <FormItem label={`柱状体${index + 1}level设置`} {...formItemLayout}>
              {getFieldDecorator(`zlevel${index}`, {
                initialValue: reap(seriesConfig, `zlevels[${index}]`, 0),
              })(<InputNumber mix={0} />)}
            </FormItem>
          );
        })}

      <FormItem label="暂无数据颜色" {...formItemLayout}>
        {getFieldDecorator('notDataColor', {
          initialValue: reap(seriesConfig, 'notDataColor', '#0089e9'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="暂无数据字体" {...formItemLayout}>
        {getFieldDecorator('notDataFontSize', {
          initialValue: reap(seriesConfig, 'notDataFontSize', 20),
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="暂无数据上边距" {...formItemLayout}>
        {getFieldDecorator('notDataPadding', {
          initialValue: reap(seriesConfig, 'notDataPadding', 20),
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
      mockData = {},
      style,
    } = props;
    const { series = [] } = mockData;
    const newFields = getFieldsValue();

    const barWithList = newFields.barWithList || [];
    delete newFields['barWidthKeys'];

    const _obj = filterObj(newFields);

    if (_obj.barGap) {
      // 数据重叠开启后，数据堆积失效
      _obj.stack = false;
    }

    const zlevels = series.map((v, index) => {
      const key = `zlevel${index}`;
      return _obj[key];
    });

    const newSeries = merge({}, style.series, {
      ..._obj,
      barWithList: [...barWithList],
      zlevels,
    });

    updateStyle({
      ...style,
      series: newSeries,
    });
  },
})(BarBasic);

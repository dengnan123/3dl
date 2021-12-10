import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Button, Icon, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const OccupancyDistributionConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue },
    id,
    style,
    mockData,
    updateStyle,
  } = props;

  const { dataSource = [] } = mockData || {};

  const {
    iconWidth,
    iconHeight,
    iconMarginRight,
    legendMarginBottom,
    legendSpacing,
    legendFontSize,
    legendColor,
    legendList,
    percentFontSize,
    percentColor,
    percentBarHeight,
    notDataContainer = 'Not Data',
    notDataColor = '#0089e9',
    notDataFontSize = 20,
    isHiddenLed = false,
    Threshold = 5,
  } = style || {};

  const handleLegendAdd = () => {
    const newLegendList = getFieldValue('legendKeys');
    newLegendList.push({ iconBgColor: undefined, label: undefined });
    updateStyle({ legendList: newLegendList });
  };

  const handleLegendRemove = curIndex => {
    const newLegendList = getFieldValue('legendKeys').filter((n, index) => index !== curIndex);
    updateStyle({ legendList: newLegendList });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const initialLegendList = legendList
    ? legendList
    : (dataSource || []).map((n, index) => ({ iconBgColor: undefined, label: undefined }));

  getFieldDecorator('legendKeys', {
    initialValue: initialLegendList,
  });
  const newLegendList = getFieldValue('legendKeys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconWidth', {
          initialValue: iconWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标高度" {...formItemLayout}>
        {getFieldDecorator('iconHeight', {
          initialValue: iconHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图标右边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginRight', {
          initialValue: iconMarginRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图例下边距" {...formItemLayout}>
        {getFieldDecorator('legendMarginBottom', {
          initialValue: legendMarginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图例间距" {...formItemLayout}>
        {getFieldDecorator('legendSpacing', {
          initialValue: legendSpacing,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图例字体大小" {...formItemLayout}>
        {getFieldDecorator('legendFontSize', {
          initialValue: legendFontSize,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="图例字体颜色" {...formItemLayout}>
        {getFieldDecorator('legendColor', {
          initialValue: legendColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="图例" {...formItemLayout} style={{ marginBottom: 0 }}></Form.Item>
      {(newLegendList || []).map((item, index) => {
        return (
          <div className={styles.legendItem} key={index}>
            <Form.Item>
              {getFieldDecorator(`legendList[${index}].iconBgColor`, {
                initialValue: item.iconBgColor,
              })(<InputColor />)}
            </Form.Item>
            :
            <Form.Item>
              {getFieldDecorator(`legendList[${index}].label`, {
                initialValue: item.label,
              })(<Input />)}
            </Form.Item>
            <Icon type="minus-circle" onClick={() => handleLegendRemove(index)} />
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleLegendAdd}>
          +添加
        </Button>
      </Form.Item>

      <Form.Item label="百分比占用率字体大小" {...formItemLayout}>
        {getFieldDecorator('percentFontSize', {
          initialValue: percentFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="百分比占用率字体颜色" {...formItemLayout}>
        {getFieldDecorator('percentColor', {
          initialValue: percentColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="百分比占用率栏高度" {...formItemLayout}>
        {getFieldDecorator('percentBarHeight', {
          initialValue: percentBarHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="设置区间太小不限时的阀值" {...formItemLayout}>
        {getFieldDecorator('Threshold', {
          initialValue: Threshold,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="暂无数据内容" {...formItemLayout}>
        {getFieldDecorator('notDataContainer', {
          initialValue: notDataContainer,
        })(<Input min={0} />)}
      </Form.Item>

      <Form.Item label="暂无数据颜色" {...formItemLayout}>
        {getFieldDecorator('notDataColor', {
          initialValue: notDataColor,
        })(<InputColor min={0} />)}
      </Form.Item>

      <Form.Item label="暂无数据字体" {...formItemLayout}>
        {getFieldDecorator('notDataFontSize', {
          initialValue: notDataFontSize,
        })(<InputNumber min={0} />)}
      </Form.Item>
      <Form.Item label="是否隐藏图例" {...formItemLayout}>
        {getFieldDecorator('isHiddenLed', {
          valuePropName: 'checked',
          initialValue: isHiddenLed,
        })(<Switch />)}
      </Form.Item>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    delete newFields['legendKeys'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(OccupancyDistributionConfig);

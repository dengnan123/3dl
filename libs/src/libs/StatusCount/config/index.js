import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Button, Icon, Switch } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const StatusCountConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    id,
    style,
    mockData,
  } = props;

  const { dataSource = [] } = mockData || {};

  const {
    title,
    titleEn,
    isShowTotal = true,
    titleFontSize = 18,
    titleFontWeight = 400,
    titleFontColor = '#424242',
    titleMarginBottom = 10,
    iconWidth = 8,
    iconHeight = 8,
    iconRadius = 4,
    iconMarginRight = 5,
    statusItemHeight = 45,
    statusItemFontColor = '#424242',
    statusItemPaddingLeft = 15,
    oddStatusItemBgColor,
    statusItemBgColor,
    statusList = [
      { label: 'Available', labelEn: 'Available', iconBgColor: '#80BA01' },
      { label: 'Occupied', labelEn: 'Occupied', iconBgColor: '#F25022' },
      { label: 'Waiting', labelEn: 'Waiting', iconBgColor: '#FFB902' },
      { label: 'Invalid Occupied', labelEn: 'Invalid Occupied', iconBgColor: '#0240EF' },
    ],
  } = style || {};

  const handleLegendAdd = () => {
    const newStatusKeys = getFieldValue('statusKeys');
    newStatusKeys.push({ iconBgColor: undefined, label: undefined, labelEn: undefined });
    setFieldsValue({ statusKeys: newStatusKeys });
  };

  const handleLegendRemove = curIndex => {
    const newStatusKeys = getFieldValue('statusKeys').filter((n, index) => index !== curIndex);
    setFieldsValue({ statusKeys: newStatusKeys });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const initialStatusList = statusList
    ? statusList
    : dataSource.map((n, index) => ({
        iconBgColor: undefined,
        label: undefined,
        labelEn: undefined,
      }));

  getFieldDecorator('statusKeys', {
    initialValue: initialStatusList,
  });
  const newStatusList = getFieldValue('statusKeys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="标题(中)" {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: title,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="标题(英)" {...formItemLayout}>
        {getFieldDecorator('titleEn', {
          initialValue: titleEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="开启状态数量统计" {...formItemLayout}>
        {getFieldDecorator('isShowTotal', {
          valuePropName: 'checked',
          initialValue: isShowTotal,
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('titleFontSize', {
          initialValue: titleFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="标题字体粗细" {...formItemLayout}>
        {getFieldDecorator('titleFontWeight', {
          initialValue: titleFontWeight,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="标题字体颜色" {...formItemLayout}>
        {getFieldDecorator('titleFontColor', {
          initialValue: titleFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="标题下边距" {...formItemLayout}>
        {getFieldDecorator('titleMarginBottom', {
          initialValue: titleMarginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态图标宽度" {...formItemLayout}>
        {getFieldDecorator('iconWidth', {
          initialValue: iconWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态图标高度" {...formItemLayout}>
        {getFieldDecorator('iconHeight', {
          initialValue: iconHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态图标圆角" {...formItemLayout}>
        {getFieldDecorator('iconRadius', {
          initialValue: iconRadius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态图标右边距" {...formItemLayout}>
        {getFieldDecorator('iconMarginRight', {
          initialValue: iconMarginRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态栏高度" {...formItemLayout}>
        {getFieldDecorator('statusItemHeight', {
          initialValue: statusItemHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态栏左边距" {...formItemLayout}>
        {getFieldDecorator('statusItemPaddingLeft', {
          initialValue: statusItemPaddingLeft,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="状态栏字体颜色" {...formItemLayout}>
        {getFieldDecorator('statusItemFontColor', {
          initialValue: statusItemFontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="状态栏单行背景颜色" {...formItemLayout}>
        {getFieldDecorator('oddStatusItemBgColor', {
          initialValue: oddStatusItemBgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="状态栏背景颜色" {...formItemLayout}>
        {getFieldDecorator('statusItemBgColor', {
          initialValue: statusItemBgColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="状态列表" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newStatusList.map((item, index) => {
        return (
          <div className={styles.item} key={index}>
            <Form.Item>
              {getFieldDecorator(`statusList[${index}].iconBgColor`, {
                initialValue: item.iconBgColor,
              })(<InputColor placeholder="状态图标颜色" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`statusList[${index}].label`, {
                initialValue: item.label,
              })(<Input placeholder="状态名(中)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`statusList[${index}].labelEn`, {
                initialValue: item.labelEn,
              })(<Input placeholder="状态名(英)" />)}
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
    delete newFields['statusKeys'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(StatusCountConfig);

import React, { useEffect } from 'react';
import { Form, InputNumber, Input, Button, Icon, Switch, Select } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const AirDataPanelConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    id,
    style,
    mockData,
  } = props;

  const { dataSource = [] } = mockData || {};

  const {
    title = 'Environmental',
    titleEn = 'Environmental',
    titleFontSize = 18,
    titleFontColor = '#424242',
    titleMarginBottom = 10,
    airItemTitleColor = '#424242',
    airItemTitleSize = 14,
    airItemAlginType = 'space-between',
    descMarginLeft = 0,
    airMarginBottom = 0,
    airItemMarginBottom = 20,
    progressUndoneColor,
    progressStrokeWidth = 8,
    showInfo = false,
    airList = [
      { label: 'PM2.5', labelEn: 'PM2.5', progressColor: '#52c41a', airUnit: 'μg/m³', max: 100 },
      { label: 'CO2', labelEn: 'CO2', progressColor: '#52c41a', airUnit: 'ppm', max: 1000 },
      {
        label: 'Temperature',
        labelEn: 'Temperature',
        progressColor: '#02a4ef',
        airUnit: '°C',
        max: 100,
      },
      { label: 'Humidity', labelEn: 'Humidity', progressColor: '#02a4ef', airUnit: '%', max: 100 },
    ],
  } = style || {};

  const handleAirAdd = () => {
    const newAirKeys = getFieldValue('airKeys');
    newAirKeys.push({
      label: undefined,
      labelEn: undefined,
      progressColor: undefined,
      airUnit: undefined,
      max: 100,
    });
    setFieldsValue({ airKeys: newAirKeys });
  };

  const handleAirRemove = curIndex => {
    const newAirKeys = getFieldValue('airKeys').filter((n, index) => index !== curIndex);
    setFieldsValue({ airKeys: newAirKeys });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const initialAirList = airList
    ? airList
    : dataSource.map((n, index) => ({
        iconBgColor: undefined,
        label: undefined,
        labelEn: undefined,
      }));

  getFieldDecorator('airKeys', {
    initialValue: initialAirList,
  });
  const newAirList = getFieldValue('airKeys');

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

      <Form.Item label="标题字体大小" {...formItemLayout}>
        {getFieldDecorator('titleFontSize', {
          initialValue: titleFontSize,
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

      <Form.Item label="空气质量字体颜色" {...formItemLayout}>
        {getFieldDecorator('airItemTitleColor', {
          initialValue: airItemTitleColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="空气质量字体大小" {...formItemLayout}>
        {getFieldDecorator('airItemTitleSize', {
          initialValue: airItemTitleSize,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>

      <Form.Item label="空气质量内容对齐方式" {...formItemLayout}>
        {getFieldDecorator('airItemAlginType', {
          initialValue: airItemAlginType,
        })(
          <Select>
            <Select.Option value={'space-between'}>两端对齐</Select.Option>
            <Select.Option value={'start'}>左对齐</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="空气质量内容描述左边距" {...formItemLayout}>
        {getFieldDecorator('descMarginLeft', {
          initialValue: descMarginLeft,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>

      <Form.Item label="空气质量下边距" {...formItemLayout}>
        {getFieldDecorator('airMarginBottom', {
          initialValue: airMarginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="空气质量栏间距" {...formItemLayout}>
        {getFieldDecorator('airItemMarginBottom', {
          initialValue: airItemMarginBottom,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="进度条未完成进度颜色" {...formItemLayout}>
        {getFieldDecorator('progressUndoneColor', {
          initialValue: progressUndoneColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="进度条线的宽度" {...formItemLayout}>
        {getFieldDecorator('progressStrokeWidth', {
          initialValue: progressStrokeWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="是否显示进度数值" {...formItemLayout}>
        {getFieldDecorator('showInfo', {
          initialValue: showInfo,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="空气质量列表" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newAirList.map((item, index) => {
        return (
          <div className={styles.item} key={index}>
            <Form.Item>
              {getFieldDecorator(`airList[${index}].label`, {
                initialValue: item.label,
              })(<Input placeholder="空气指标名(中)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`airList[${index}].labelEn`, {
                initialValue: item.labelEn,
              })(<Input placeholder="空气指标名(英)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`airList[${index}].airUnit`, {
                initialValue: item.airUnit,
              })(<Input placeholder="空气指标单位" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`airList[${index}].max`, {
                initialValue: item.max,
              })(<Input placeholder="空气指标最大值" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`airList[${index}].progressColor`, {
                initialValue: item.progressColor,
              })(<InputColor placeholder="进度条颜色" />)}
            </Form.Item>
            <Icon type="minus-circle" onClick={() => handleAirRemove(index)} />
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleAirAdd}>
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
    delete newFields['airKeys'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(AirDataPanelConfig);

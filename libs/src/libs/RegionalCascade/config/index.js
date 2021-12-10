import React, { useEffect } from 'react';
// import { debounce } from 'lodash';
import { Form, InputNumber, Input, Button, Icon, Select, Switch } from 'antd';
import InputColor from '../../../components/InputColor';
import RequestFilter from '../../../components/RequestFilter';

import styles from './index.less';

const RegionalCascadeConfig = props => {
  const { formItemLayout, form, id, style } = props;

  const { getFieldDecorator, resetFields, getFieldValue, setFieldsValue } = form;

  const {
    label = '选择区域',
    labelEn = 'Select Area',
    labelColor = '#4a4a4a',
    labelFontSize = 16,
    labelMarginRight = 10,
    fontColor = '#424242',
    fontSize = 14,
    opFontSize = 14,
    optionColor = 'rgba(0, 0, 0, 0.65)',
    optionBg,
    paddingTB = 5,
    paddingLR = 12,
    borderColor = '#D8D8D8',
    borderSize = 1,
    borderRadius = 4,
    cascadeWidthIsAverage = false,
    cascadeWidth = 120,
    cascadeMinWidth = 120,
    cascadeHeight = 32,
    cascadeSpacing = 10,
    method = 'get',
    defaultHeaderParams = [],
    apiHostEnvKey = 'API_HOST_COMP_PLACEHOLDER__',
    apiHost = 'https://www.fastmock.site/mock/29adb8c7e763fd69d52f9c23f533f21e/test',
    apiPath = '/list',
    cascadeLevels = [
      {
        label: '请选择省份',
        labelEn: '',
        nameKey: 'name',
        valueKey: 'id',
        defaultNameKey: 'provinceName',
        defaultValueKey: 'provinceId',
        compKey: 'province',
      },
      {
        label: '请选择城市',
        labelEn: '',
        nameKey: 'name',
        valueKey: 'id',
        defaultNameKey: 'cityName',
        defaultValueKey: 'cityId',
        compKey: 'city',
      },
      {
        label: '请选择行政区',
        labelEn: '',
        nameKey: 'name',
        valueKey: 'id',
        defaultNameKey: 'administrativeName',
        defaultValueKey: 'administrativeId',
        compKey: 'administrative',
      },
      {
        label: '请选择物业点',
        labelEn: '',
        nameKey: 'name',
        valueKey: 'id',
        defaultNameKey: 'propertyName',
        defaultValueKey: 'propertyId',
        compKey: 'property',
      },
    ],
    compKey = '',
  } = style || {};

  const handleLevelAdd = () => {
    const newCascadeLevelsKeys = getFieldValue('cascadeLevelsKeys') || [];
    newCascadeLevelsKeys.push({
      label: '',
      labelEn: '',
      nameKey: '',
      valueKey: '',
      defaultNameKey: '',
      defaultValueKey: '',
      compKey: '',
      api: '',
    });
    setFieldsValue({ cascadeLevelsKeys: newCascadeLevelsKeys });
  };

  const handleLevelRemove = curIndex => {
    const newCascadeLevelsKeys = getFieldValue('cascadeLevelsKeys').filter(
      (n, index) => index !== curIndex,
    );
    setFieldsValue({ cascadeLevelsKeys: newCascadeLevelsKeys });
  };

  const handleParamAdd = () => {
    const newDefaultHeaderParamsKeys = getFieldValue('defaultHeaderParamsKeys') || [];
    newDefaultHeaderParamsKeys.push({ paramKey: '', paramValue: '' });
    setFieldsValue({ defaultHeaderParamsKeys: newDefaultHeaderParamsKeys });
  };

  const handleParamRemove = curIndex => {
    const newDefaultHeaderParamsKeys = getFieldValue('defaultHeaderParamsKeys').filter(
      (n, index) => index !== curIndex,
    );
    setFieldsValue({ defaultHeaderParamsKeys: newDefaultHeaderParamsKeys });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  getFieldDecorator('cascadeLevelsKeys', {
    initialValue: cascadeLevels || [],
  });
  getFieldDecorator('defaultHeaderParamsKeys', {
    initialValue: defaultHeaderParams || [],
  });
  const newCascadeLevels = getFieldValue('cascadeLevelsKeys');
  const newDefaultHeaderParams = getFieldValue('defaultHeaderParamsKeys');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="级联选择宽度均分" {...formItemLayout}>
        {getFieldDecorator('cascadeWidthIsAverage', {
          initialValue: cascadeWidthIsAverage,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      <Form.Item label="级联选择宽度" {...formItemLayout}>
        {getFieldDecorator('cascadeWidth', {
          initialValue: cascadeWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="级联选择宽度最小值" {...formItemLayout}>
        {getFieldDecorator('cascadeMinWidth', {
          initialValue: cascadeMinWidth,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="级联选择高度" {...formItemLayout}>
        {getFieldDecorator('cascadeHeight', {
          initialValue: cascadeHeight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="级联选择间距" {...formItemLayout}>
        {getFieldDecorator('cascadeSpacing', {
          initialValue: cascadeSpacing,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="label(中)" {...formItemLayout}>
        {getFieldDecorator('label', {
          initialValue: label,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="label(英)" {...formItemLayout}>
        {getFieldDecorator('labelEn', {
          initialValue: labelEn,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="label字体颜色" {...formItemLayout}>
        {getFieldDecorator('labelColor', {
          initialValue: labelColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="label字体大小" {...formItemLayout}>
        {getFieldDecorator('labelFontSize', {
          initialValue: labelFontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="label右边距" {...formItemLayout}>
        {getFieldDecorator('labelMarginRight', {
          initialValue: labelMarginRight,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="内容字体颜色" {...formItemLayout}>
        {getFieldDecorator('fontColor', {
          initialValue: fontColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="内容字体大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>

      <Form.Item label="下拉的列表字体大小" {...formItemLayout}>
        {getFieldDecorator('opFontSize', {
          initialValue: opFontSize,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="下拉的列表字体颜色" {...formItemLayout}>
        {getFieldDecorator('optionColor', {
          initialValue: optionColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="下拉的列表背景颜色" {...formItemLayout}>
        {getFieldDecorator('optionBg', {
          initialValue: optionBg,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="下拉的列表字体上下边距" {...formItemLayout}>
        {getFieldDecorator('paddingTB', {
          initialValue: paddingTB,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="下拉的列表字体左右边距" {...formItemLayout}>
        {getFieldDecorator('paddingLR', {
          initialValue: paddingLR,
        })(<InputNumber />)}
      </Form.Item>

      <Form.Item label="边框颜色" {...formItemLayout}>
        {getFieldDecorator('borderColor', {
          initialValue: borderColor,
        })(<InputColor />)}
      </Form.Item>

      <Form.Item label="边框粗细" {...formItemLayout}>
        {getFieldDecorator('borderSize', {
          initialValue: borderSize,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="边框圆角" {...formItemLayout}>
        {getFieldDecorator('borderRadius', {
          initialValue: borderRadius,
        })(<InputNumber min={0} />)}
      </Form.Item>

      <Form.Item label="API请求方式" {...formItemLayout}>
        {getFieldDecorator('method', {
          initialValue: method,
        })(
          <Select>
            <Select.Option key="get">GET</Select.Option>
            <Select.Option key="post">POST</Select.Option>
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="请求头默认参数" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newDefaultHeaderParams.map((item, index) => {
        return (
          <div className={styles.item} key={index}>
            <Form.Item>
              {getFieldDecorator(`defaultHeaderParams[${index}].paramKey`, {
                initialValue: item.paramKey,
              })(<Input placeholder="参数名" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`defaultHeaderParams[${index}].paramValue`, {
                initialValue: item.paramValue,
              })(<Input placeholder="参数值" />)}
            </Form.Item>
            {newDefaultHeaderParams.length > 1 && (
              <Icon type="minus-circle" onClick={() => handleParamRemove(index)} />
            )}
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleParamAdd}>
          +添加
        </Button>
      </Form.Item>

      <Form.Item label="环境变量key值,用来打包后替换下面接口api_host">
        {getFieldDecorator(`apiHostEnvKey`, {
          initialValue: apiHostEnvKey,
        })(<Input placeholder="打包需要替换的环境变量key值" />)}
      </Form.Item>

      <Form.Item label="接口 api_host">
        {getFieldDecorator(`apiHost`, {
          initialValue: apiHost,
        })(<Input placeholder="打包需要替换的环境变量key值" />)}
      </Form.Item>

      <Form.Item label="接口路径">
        {getFieldDecorator(`apiPath`, {
          initialValue: apiPath,
        })(<Input placeholder="接口路径" />)}
      </Form.Item>

      <Form.Item label="级联选择层级" {...formItemLayout} style={{ marginBottom: 0 }} />
      {newCascadeLevels.map((item, index) => {
        return (
          <div className={styles.item} key={index}>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].label`, {
                initialValue: item.label,
              })(<Input placeholder="提示信息(中)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].labelEn`, {
                initialValue: item.labelEn,
              })(<Input placeholder="提示信息(英)" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].nameKey`, {
                initialValue: item.nameKey,
              })(<Input placeholder="nameKey" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].valueKey`, {
                initialValue: item.valueKey,
              })(<Input placeholder="valueKey" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].defaultNameKey`, {
                initialValue: item.defaultNameKey,
              })(<Input placeholder="url defaultNameKey" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].defaultValueKey`, {
                initialValue: item.defaultValueKey,
              })(<Input placeholder="url defaultValueKey" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator(`cascadeLevels[${index}].compKey`, {
                initialValue: item.compKey,
              })(<Input placeholder="compKey" />)}
            </Form.Item>
            {newCascadeLevels.length > 1 && (
              <Icon type="minus-circle" onClick={() => handleLevelRemove(index)} />
            )}
          </div>
        );
      })}

      <Form.Item>
        <Button type="primary" onClick={handleLevelAdd}>
          +添加
        </Button>
      </Form.Item>

      <Form.Item label="compKey" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: compKey,
        })(<Input />)}
      </Form.Item>

      <RequestFilter form={form} formItemLayout={formItemLayout} data={style} />
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
    delete newFields['cascadeLevelsKeys'];
    delete newFields['defaultHeaderParamsKeys'];

    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  },
})(RegionalCascadeConfig);

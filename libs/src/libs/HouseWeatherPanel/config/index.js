import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Switch, InputNumber, Input, Collapse } from 'antd';
import { debounce } from 'lodash';
import { weatherStyleEmnu } from '../styles';
import InputColor from '../../../components/InputColor';
import { styles } from 'ansi-colors';

const { Panel } = Collapse;

function WeatherConfig(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const {
    showBorder = weatherStyleEmnu['showBorder'],
    BorderColor = weatherStyleEmnu['BorderColor'],
    BorderRaduis = weatherStyleEmnu['BorderRaduis'],
    boxPadding = weatherStyleEmnu['boxPadding'],
    showBackground = weatherStyleEmnu['showBackground'],
    background = weatherStyleEmnu['background'],
    containerStyle = weatherStyleEmnu['containerStyle'],

    showHum = weatherStyleEmnu['showHum'],
    humContainerStyle = weatherStyleEmnu['humContainerStyle'],
    humImgWidth = weatherStyleEmnu['humImgWidth'],
    humImgHeight = weatherStyleEmnu['humImgHeight'],
    humNumStyle = weatherStyleEmnu['humNumStyle'],
    humTextStyle = weatherStyleEmnu['humTextStyle'],
    humUnitStyle = weatherStyleEmnu['humUnitStyle'],
    humRightStyle = weatherStyleEmnu['humRightStyle'],

    showTemp = weatherStyleEmnu['showTemp'],
    weatherContainerStyle = weatherStyleEmnu['weatherContainerStyle'],
    tempImgWidth = weatherStyleEmnu['tempImgWidth'],
    tempImgHeight = weatherStyleEmnu['tempImgHeight'],
    tempNumberStyle = weatherStyleEmnu['temmpNumberStyle'],
    tempTextStyle = weatherStyleEmnu['tempTextStyle'],
    tempUnitStyle = weatherStyleEmnu['tempUnitStyle'],
    tempRightStyle = weatherStyleEmnu['tempRightStyle'],

    showPM = weatherStyleEmnu['showPM'],
    PMContainerStyle = weatherStyleEmnu['PMContainerStyle'],
    PMImgWidth = weatherStyleEmnu['PMImgWidth'],
    PMImgHeight = weatherStyleEmnu['PMImgHeight'],
    PMNumStyle = weatherStyleEmnu['PMNumStyle'],
    PMTextStyle = weatherStyleEmnu['PMTextStyle'],
    PMUnitStyle = weatherStyleEmnu['PMUnitStyle'],
    PMRightStyle = weatherStyleEmnu['PMRightStyle'],

    updateTime = weatherStyleEmnu['updateTime'],
  } = style;

  return (
    <div>
      <Collapse>
        <Panel header={'基础样式'}>
          <Form.Item label="是否显示边框" {...formItemLayout}>
            {getFieldDecorator('showBorder', {
              initialValue: showBorder,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showBorder && (
            <>
              <Form.Item label="边框颜色" {...formItemLayout}>
                {getFieldDecorator('BorderColor', {
                  initialValue: BorderColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="圆角" {...formItemLayout}>
            {getFieldDecorator('BorderRaduis', {
              initialValue: BorderRaduis,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="内边距" {...formItemLayout} className={styles.line}>
            {getFieldDecorator('boxPadding', {
              initialValue: boxPadding,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="容器样式" {...formItemLayout} className={styles.line}>
            {getFieldDecorator('containerStyle', {
              initialValue: containerStyle,
            })(<Input.TextArea />)}
          </Form.Item>
          <Form.Item label="是否显示背景色" {...formItemLayout} className={styles.line}>
            {getFieldDecorator('showBackground', {
              initialValue: showBackground,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showBackground && (
            <>
              <Form.Item label="背景色" {...formItemLayout}>
                {getFieldDecorator('background', {
                  initialValue: background,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header={'温度样式'}>
          <Form.Item label="是否显示温度" {...formItemLayout}>
            {getFieldDecorator('showTemp', {
              initialValue: showTemp,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showTemp && (
            <>
              <Form.Item label="温度容器样式">
                {getFieldDecorator('weatherContainerStyle', {
                  initialValue: weatherContainerStyle,
                })(<Input.TextArea />)}
              </Form.Item>

              <Form.Item label="温度图标宽度">
                {getFieldDecorator('tempImgWidth', {
                  initialValue: tempImgWidth,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="温度图标高度">
                {getFieldDecorator('tempImgHeight', {
                  initialValue: tempImgHeight,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="温度数值样式">
                {getFieldDecorator('tempNumberStyle', {
                  initialValue: tempNumberStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="温度文本样式">
                {getFieldDecorator('tempTextStyle', {
                  initialValue: tempTextStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="温度数值单位样式">
                {getFieldDecorator('tempUnitStyle', {
                  initialValue: tempUnitStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="温度右半区样式">
                {getFieldDecorator('tempRightStyle', {
                  initialValue: tempRightStyle,
                })(<Input.TextArea />)}
              </Form.Item>
            </>
          )}
        </Panel>
        <Panel header={'湿度样式'}>
          <Form.Item label="是否显示湿度" {...formItemLayout}>
            {getFieldDecorator('showHum', {
              initialValue: showHum,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showTemp && (
            <>
              <Form.Item label="湿度容器样式">
                {getFieldDecorator('humContainerStyle', {
                  initialValue: humContainerStyle,
                })(<Input.TextArea />)}
              </Form.Item>

              <Form.Item label="湿度图标宽度">
                {getFieldDecorator('humImgWidth', {
                  initialValue: humImgWidth,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="湿度图标高度">
                {getFieldDecorator('humImgHeight', {
                  initialValue: humImgHeight,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="湿度数值样式">
                {getFieldDecorator('humNumStyle', {
                  initialValue: humNumStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="湿度文本样式">
                {getFieldDecorator('humTextStyle', {
                  initialValue: humTextStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="湿度数值单位样式">
                {getFieldDecorator('humUnitStyle', {
                  initialValue: humUnitStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="湿度右半区样式">
                {getFieldDecorator('humRightStyle', {
                  initialValue: humRightStyle,
                })(<Input.TextArea />)}
              </Form.Item>
            </>
          )}
        </Panel>
        <Panel header={'PM2.5样式'}>
          <Form.Item label="是否显示PM2.5" {...formItemLayout}>
            {getFieldDecorator('showPM', {
              initialValue: showPM,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showTemp && (
            <>
              <Form.Item label="PM2.5容器样式">
                {getFieldDecorator('PMContainerStyle', {
                  initialValue: PMContainerStyle,
                })(<Input.TextArea />)}
              </Form.Item>

              <Form.Item label="PM2.5图标宽度">
                {getFieldDecorator('PMImgWidth', {
                  initialValue: PMImgWidth,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="PM2.5图标高度">
                {getFieldDecorator('PMImgHeight', {
                  initialValue: PMImgHeight,
                })(<InputNumber />)}
              </Form.Item>
              <Form.Item label="PM2.5数值样式">
                {getFieldDecorator('PMNumStyle', {
                  initialValue: PMNumStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="PM2.5文本样式">
                {getFieldDecorator('PMTextStyle', {
                  initialValue: PMTextStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="PM2.5数值单位样式">
                {getFieldDecorator('PMUnitStyle', {
                  initialValue: PMUnitStyle,
                })(<Input.TextArea />)}
              </Form.Item>
              <Form.Item label="PM2.5右半区样式">
                {getFieldDecorator('PMRightStyle', {
                  initialValue: PMRightStyle,
                })(<Input.TextArea />)}
              </Form.Item>
            </>
          )}
        </Panel>
        <Panel header={'更新设置'}>
          <Form.Item label="更新频率(小时)" {...formItemLayout}>
            {getFieldDecorator('updateTime', { initialValue: updateTime })(
              <Select style={{ width: '100%' }}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={6}>6</Select.Option>
                <Select.Option value={12}>12</Select.Option>
                <Select.Option value={24}>24</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
}

WeatherConfig.propTypes = {
  a: PropTypes.array,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const { form, style, updateStyle } = props;

    const newFields = form.getFieldsValue();
    updateStyle({ ...style, ...newFields });
  }),
})(WeatherConfig);

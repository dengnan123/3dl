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
    prominentOne = weatherStyleEmnu['prominentOne'],
    showDays = weatherStyleEmnu['showDays'],
    showPop = weatherStyleEmnu['showPop'],

    showWind = weatherStyleEmnu['showWind'],
    windFontSize = weatherStyleEmnu['windFontSize'],
    windColor = weatherStyleEmnu['windColor'],
    windImgWidth = weatherStyleEmnu['windImgWidth'],

    updateTime = weatherStyleEmnu['updateTime'],

    showWeek = weatherStyleEmnu['showWeek'],
    weekFontSize = weatherStyleEmnu['weekFontSize'],
    weekColor = weatherStyleEmnu['weekColor'],

    showData = weatherStyleEmnu['showData'],
    timeFontSize = weatherStyleEmnu['weekFontSize'],
    timeColor = weatherStyleEmnu['weekColor'],
    MomentForment = weatherStyleEmnu['MomentForment'],

    imgWidth = weatherStyleEmnu['imgWidth'],
    // imgHeight = weatherStyleEmnu['imgHeight'],
    // imgBigWidth = weatherStyleEmnu['imgBigWidth'],
    imgSmallWidth = weatherStyleEmnu['imgSmallWidth'],

    showWeatherText = weatherStyleEmnu['showWeatherText'],
    weatherTextSize = weatherStyleEmnu['weatherTextSize'],
    weatherTextColor = weatherStyleEmnu['weatherTextColor'],

    showPopSize = weatherStyleEmnu['showPopSize'],
    showPopColor = weatherStyleEmnu['showPopColor'],
    showHum = weatherStyleEmnu['showHum'],

    humFontSize = weatherStyleEmnu['humFontSize'],
    humImgWidth = weatherStyleEmnu['humImgWidth'],
    humColor = weatherStyleEmnu['humColor'],

    showTemp = weatherStyleEmnu['showTemp'],
    temmpFontSize = weatherStyleEmnu['temmpFontSize'],
    tempColor = weatherStyleEmnu['tempColor'],

    showBorder = weatherStyleEmnu['showBorder'],
    BorderColor = weatherStyleEmnu['BorderColor'],
    BorderRaduis = weatherStyleEmnu['BorderRaduis'],
    boxPadding = weatherStyleEmnu['boxPadding'],

    showBackground = weatherStyleEmnu['showBackground'],
    background = weatherStyleEmnu['background'],
    useIconfont = false,
    IconfontSize = '30',
    IconfontColor = 'red',
    oneLineToShow = false,
    justifyContent = 'center',
    warperJustify = 'center',
  } = style;

  return (
    <div>
      <Collapse>
        <Panel header={'基础样式'}>
          <Form.Item label="容器justify-content" {...formItemLayout}>
            {getFieldDecorator('warperJustify', { initialValue: warperJustify })(
              <Select style={{ width: '100%' }}>
                <Select.Option value="center">center</Select.Option>
                <Select.Option value="start">start</Select.Option>
                <Select.Option value="end">end</Select.Option>
                <Select.Option value="flex-start">flex-start</Select.Option>
                <Select.Option value="flex-end">flex-end</Select.Option>
                <Select.Option value="left">left</Select.Option>
                <Select.Option value="right">right</Select.Option>

                <Select.Option value="baseline">baseline</Select.Option>
                <Select.Option value="space-between">space between</Select.Option>
                <Select.Option value="space-around">space around</Select.Option>
                <Select.Option value="space-evenly">space evenly</Select.Option>
                <Select.Option value="stretch">stretch</Select.Option>

                <Select.Option value="inherit">inherit</Select.Option>
                <Select.Option value="initial">initial</Select.Option>
                <Select.Option value="unset">unset</Select.Option>
              </Select>,
            )}
          </Form.Item>

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

          <Form.Item label={`Icon大小${prominentOne ? '突出部分' : ''}`}>
            {getFieldDecorator('imgWidth', {
              initialValue: imgWidth,
            })(<InputNumber />)}
          </Form.Item>
          {prominentOne && (
            <Form.Item label={`Icon大小${prominentOne ? '不突出部分' : ''}`}>
              {getFieldDecorator('imgSmallWidth', {
                initialValue: imgSmallWidth,
              })(<InputNumber />)}
            </Form.Item>
          )}

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

        <Panel header={'显示控制'}>
          <Form.Item label="是否突出显示当天天气" {...formItemLayout}>
            {getFieldDecorator('prominentOne', {
              initialValue: prominentOne,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="预报天气天数" {...formItemLayout}>
            {getFieldDecorator('showDays', { initialValue: showDays })(
              <Select style={{ width: '100%' }}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
                <Select.Option value={6}>6</Select.Option>
                <Select.Option value={7}>7</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('justifyContent', { initialValue: justifyContent })(
              <Select style={{ width: '100%' }}>
                <Select.Option value="start">左对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
                <Select.Option value="end">右对齐</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="是否显示Week字段" {...formItemLayout}>
            {getFieldDecorator('showWeek', {
              initialValue: showWeek,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showWeek && (
            <>
              <Form.Item label="week字体大小">
                {getFieldDecorator('weekFontSize', {
                  initialValue: weekFontSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="week字体颜色">
                {getFieldDecorator('weekColor', {
                  initialValue: weekColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="是否显示日期" {...formItemLayout}>
            {getFieldDecorator('showData', {
              initialValue: showData,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showData && (
            <>
              <Form.Item label="日期字体大小">
                {getFieldDecorator('timeFontSize', {
                  initialValue: timeFontSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="日期字体颜色">
                {getFieldDecorator('timeColor', {
                  initialValue: timeColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="日期格式">
                {getFieldDecorator('MomentForment', {
                  initialValue: MomentForment,
                })(<Input placeholder="moment格式 MMM DD ..." />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="是否显示天气(文本)" {...formItemLayout}>
            {getFieldDecorator('showWeatherText', {
              initialValue: showWeatherText,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showWeatherText && (
            <>
              <Form.Item label="天气文本字体大小">
                {getFieldDecorator('weatherTextSize', {
                  initialValue: weatherTextSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="天气文本颜色">
                {getFieldDecorator('weatherTextColor', {
                  initialValue: weatherTextColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="是否显示降水概率 %" {...formItemLayout}>
            {getFieldDecorator('showPop', { initialValue: showPop, valuePropName: 'checked' })(
              <Switch />,
            )}
          </Form.Item>
          {showPop && (
            <>
              <Form.Item label="降水概率字体大小">
                {getFieldDecorator('showPopSize', {
                  initialValue: showPopSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="降水概率字体颜色">
                {getFieldDecorator('showPopColor', {
                  initialValue: showPopColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="是否显示湿度 %" {...formItemLayout}>
            {getFieldDecorator('showHum', { initialValue: showHum, valuePropName: 'checked' })(
              <Switch />,
            )}
          </Form.Item>
          {showHum && (
            <>
              <Form.Item label="湿度字体大小">
                {getFieldDecorator('humFontSize', {
                  initialValue: humFontSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="湿度图片大小">
                {getFieldDecorator('humImgWidth', {
                  initialValue: humImgWidth,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="湿度字体颜色">
                {getFieldDecorator('humColor', {
                  initialValue: humColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="是否显示温度 °C" {...formItemLayout}>
            {getFieldDecorator('showTemp', { initialValue: showTemp, valuePropName: 'checked' })(
              <Switch />,
            )}
          </Form.Item>
          {showTemp && (
            <>
              <Form.Item label="温度字体大小">
                {getFieldDecorator('temmpFontSize', {
                  initialValue: temmpFontSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="温度字体颜色">
                {getFieldDecorator('tempColor', {
                  initialValue: tempColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="天气文字和温度是否一行显示" {...formItemLayout}>
            {getFieldDecorator('oneLineToShow', {
              initialValue: oneLineToShow,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="是否显示风力" {...formItemLayout}>
            {getFieldDecorator('showWind', { initialValue: showWind, valuePropName: 'checked' })(
              <Switch />,
            )}
          </Form.Item>
          {showWind && (
            <>
              <Form.Item label="风力字体大小">
                {getFieldDecorator('windFontSize', {
                  initialValue: windFontSize,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="风力字体颜色">
                {getFieldDecorator('windColor', {
                  initialValue: windColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="湿度图片大小">
                {getFieldDecorator('windImgWidth', {
                  initialValue: windImgWidth,
                })(<InputNumber />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header={'Iconfont'}>
          <Form.Item label="是否使用Iconfont" {...formItemLayout}>
            {getFieldDecorator('useIconfont', {
              initialValue: useIconfont,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="Iconfont大小" {...formItemLayout}>
            {getFieldDecorator('IconfontSize', {
              initialValue: IconfontSize,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Iconfont颜色" {...formItemLayout}>
            {getFieldDecorator('IconfontColor', {
              initialValue: IconfontColor,
            })(<InputColor />)}
          </Form.Item>
        </Panel>
        <Panel header={'更新设置'}>
          <Form.Item label="更新频率(小时)" {...formItemLayout}>
            {getFieldDecorator('updateTime', { initialValue: updateTime })(
              <Select style={{ width: '100%' }}>
                <Select.Option disabled value={1}>
                  1
                </Select.Option>
                <Select.Option disabled value={2}>
                  2
                </Select.Option>
                <Select.Option disabled value={4}>
                  4
                </Select.Option>
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

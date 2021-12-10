import { useEffect } from 'react';
import { Form, InputNumber, Switch, Input, Select, Collapse } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

// import styles from './index.less';
const { Panel } = Collapse;

const CustomizeCardConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields },
    style,
    id,
  } = props;

  const {
    cardBgColor = '#E9E9E9',
    showTitle = false,
    title = '我是标题',
    titleEn = 'I am title',
    headHeight = 45,
    headBgcolor = '#F0F1F5',
    headPadding = 30,
    headFontSize = 16,
    headFontWeight = 600,
    headFontColor = '#454458',
    titleTextAlign = 'left',
    // showMore = false,
    // moreBtnWidth = 20,
    // moreBtnHeight = 20,
    // moreBtnRadius = 4,
    // moreBtnBorderWidth = 1,
    // moreBtnBorderColor = '#F0F1F5',
    // moreBtnBgColor = '#f3f3fb',
    // popoverPosition = 'bottom',
    // popoverContentList = [],
    showBorder = false,
    cardBorderColor = '#F0F1F5',
    borderRadius = 0,

    showBoxShadow = false,
    hShadow = 1,
    vShadow = 1,
    blur = 10,
    spread = 0,
    shadowColor = '#d9dcdf',
    showBar = false,
    barWidth = 8,
    barHeight = 8,
    barTop = 0,
    barLeft = 0,
    barBorderRadius = '0px',
    barColor = '#71daa5',
  } = style || {};

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse accordion>
        <Panel header="基础配置" key="BasicConfig">
          <Form.Item label="卡片背景颜色" {...formItemLayout}>
            {getFieldDecorator('cardBgColor', {
              initialValue: cardBgColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="是否显示边框" {...formItemLayout}>
            {getFieldDecorator('showBorder', {
              initialValue: showBorder,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('cardBorderColor', {
              initialValue: cardBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="卡片圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="是否显示阴影" {...formItemLayout}>
            {getFieldDecorator('showBoxShadow', {
              initialValue: showBoxShadow,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showBoxShadow && (
            <>
              <Form.Item label="水平阴影位置" {...formItemLayout}>
                {getFieldDecorator('hShadow', {
                  initialValue: hShadow,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="垂直阴影位置" {...formItemLayout}>
                {getFieldDecorator('vShadow', {
                  initialValue: vShadow,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="模糊距离" {...formItemLayout}>
                {getFieldDecorator('blur', {
                  initialValue: blur,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="阴影尺寸" {...formItemLayout}>
                {getFieldDecorator('spread', {
                  initialValue: spread,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="阴影颜色" {...formItemLayout}>
                {getFieldDecorator('shadowColor', {
                  initialValue: shadowColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header="标题配置" key="TitleConfig">
          <Form.Item label="是否显示标题" {...formItemLayout}>
            {getFieldDecorator('showTitle', {
              initialValue: showTitle,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showTitle && (
            <>
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

              <Form.Item label="标题高度" {...formItemLayout}>
                {getFieldDecorator('headHeight', {
                  initialValue: headHeight,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="标题高度" {...formItemLayout}>
                {getFieldDecorator('headBgcolor', {
                  initialValue: headBgcolor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="标题左右padding" {...formItemLayout}>
                {getFieldDecorator('headPadding', {
                  initialValue: headPadding,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="标题字体大小" {...formItemLayout}>
                {getFieldDecorator('headFontSize', {
                  initialValue: headFontSize,
                })(<InputNumber min={12} />)}
              </Form.Item>
              <Form.Item label="标题字体粗细" {...formItemLayout}>
                {getFieldDecorator('headFontWeight', {
                  initialValue: headFontWeight,
                })(<InputNumber min={100} step={100} max={900} />)}
              </Form.Item>
              <Form.Item label="标题字体颜色" {...formItemLayout}>
                {getFieldDecorator('headFontColor', {
                  initialValue: headFontColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="标题对齐方式" {...formItemLayout}>
                {getFieldDecorator('titleTextAlign', {
                  initialValue: titleTextAlign,
                })(
                  <Select style={{ width: 120 }}>
                    <Select.Option value="left">左对齐</Select.Option>
                    <Select.Option value="center">居中</Select.Option>
                    <Select.Option value="right">右对齐</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </>
          )}
        </Panel>
        <Panel header="侧边条纹配置" key="BarConfig">
          <Form.Item label="是否显示条纹" {...formItemLayout}>
            {getFieldDecorator('showBar', {
              initialValue: showBar,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showBar && (
            <>
              <Form.Item label="条纹宽度" {...formItemLayout}>
                {getFieldDecorator('barWidth', {
                  initialValue: barWidth,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="条纹高度" {...formItemLayout}>
                {getFieldDecorator('barHeight', {
                  initialValue: barHeight,
                })(<InputNumber min={0} />)}
              </Form.Item>
              <Form.Item label="条纹Top" {...formItemLayout}>
                {getFieldDecorator('barTop', {
                  initialValue: barTop,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="条纹Left" {...formItemLayout}>
                {getFieldDecorator('barLeft', {
                  initialValue: barLeft,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="条纹颜色" {...formItemLayout}>
                {getFieldDecorator('barColor', {
                  initialValue: barColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="条纹圆角" {...formItemLayout}>
                {getFieldDecorator('barBorderRadius', {
                  initialValue: barBorderRadius,
                })(<Input />)}
              </Form.Item>
            </>
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();

    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(CustomizeCardConfig);

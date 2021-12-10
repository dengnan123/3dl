import React from 'react';
import { Form, InputNumber, Collapse, Switch } from 'antd';
import InputColor from '../../../components/InputColor';
import { debounce } from 'lodash';

const { Panel } = Collapse;

const LockersConfig = ({ style, form, formItemLayout }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const {
    color = '#0066CC',
    fontSize = 20,
    width = 20,
    paddingLeft = 15,
    boxWidth = 50,
    borderRadius = 5,
    background = '#ECECEC',
    padding = 15,
    insideMargin = 10,
    height = 20,
    lockerTab = 25,
    titlePadding = 25,
    lockerMarginLeft = 25,
    showTitle = false,
    lockerRow = 4,
    followingSystem = true,
    Chinese,
    English,
  } = style;

  const changeFollow = checked => {
    if (checked) {
      setFieldsValue({ Chinese: false, English: false });
    }
  };

  const changeChinese = checked => {
    if (checked) {
      setFieldsValue({ followingSystem: false, English: false });
    }
  };

  const changeEnglish = checked => {
    if (checked) {
      setFieldsValue({ followingSystem: false, Chinese: false });
    }
  };

  return (
    <div>
      <Collapse accordion>
        <Panel header="语言环境">
          <Form.Item label="跟随系统">
            {getFieldDecorator('followingSystem', {
              valuePropName: 'checked',
              initialValue: followingSystem,
            })(
              <Switch
                onChange={e => {
                  changeFollow(e);
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="中文环境">
            {getFieldDecorator('Chinese', {
              valuePropName: 'checked',
              initialValue: Chinese,
            })(
              <Switch
                onChange={e => {
                  changeChinese(e);
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="英文环境">
            {getFieldDecorator('English', {
              valuePropName: 'checked',
              initialValue: English,
            })(
              <Switch
                onChange={e => {
                  changeEnglish(e);
                }}
              />,
            )}
          </Form.Item>
        </Panel>
        <Panel header="标题">
          <Form.Item label="标题显示(序号/名称)" {...formItemLayout}>
            {getFieldDecorator('showTitle', {
              valuePropName: 'checked',
              initialValue: showTitle,
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="标题外边距" {...formItemLayout}>
            {getFieldDecorator('titlePadding', {
              initialValue: titlePadding,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="标题颜色" {...formItemLayout}>
            {getFieldDecorator('color', {
              initialValue: color,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标题字体大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="标题左边距" {...formItemLayout}>
            {getFieldDecorator('paddingLeft', {
              initialValue: paddingLeft,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="标题Icon大小" {...formItemLayout}>
            {getFieldDecorator('width', {
              initialValue: width,
            })(<InputNumber />)}
          </Form.Item>
        </Panel>
        <Panel header="储物柜">
          <Form.Item label="格子大小" {...formItemLayout}>
            {getFieldDecorator('boxWidth', {
              initialValue: boxWidth,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="背景圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: borderRadius,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="储物柜背景色" {...formItemLayout}>
            {getFieldDecorator('background', {
              initialValue: background,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="储物柜缩进" {...formItemLayout}>
            {getFieldDecorator('lockerTab', {
              initialValue: lockerTab,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="储物柜外间距" {...formItemLayout}>
            {getFieldDecorator('lockerMarginLeft', {
              initialValue: lockerMarginLeft,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="储物柜内边距" {...formItemLayout}>
            {getFieldDecorator('padding', {
              initialValue: padding,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="格子间距" {...formItemLayout}>
            {getFieldDecorator('insideMargin', {
              initialValue: insideMargin,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="柜体底部" {...formItemLayout}>
            {getFieldDecorator('height', {
              initialValue: height,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="柜体行数" {...formItemLayout}>
            {getFieldDecorator('lockerRow', {
              initialValue: lockerRow,
            })(<InputNumber />)}
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce(props => {
    const { style, form, updateStyle } = props;
    const { getFieldsValue } = form;
    const newField = getFieldsValue();
    updateStyle({ ...style, ...newField });
  }, 500),
})(LockersConfig);

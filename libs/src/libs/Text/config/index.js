import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, Input, InputNumber, Select, Switch, Collapse, Icon } from 'antd';

import InputColor from '../../../components/InputColor';
import styles from './index.less';

const { Panel } = Collapse;
const { Option } = Select;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

const TextConfig = props => {
  const {
    style = {},
    form: { getFieldDecorator, resetFields },
    formItemLayout,
    id,
  } = props;

  const {
    fontSize = 12,
    color,
    fontWeight = 400,
    textIndent = 0,
    lineHeight,
    wordSpacing,
    letterSpacing,
    textAlign = 'center',
    dynamicData = false,
    emptyText = '暂无数据',
    text,
    textEn,
    fontFamily,
    showDataChange = false,
    marginLeft = 5,
    marginRight = 5,
    textPosition = 'textLeft',
    upFontColor,
    downFontColor,
    formatter,
    disableLocalStorage = false,
  } = style;

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {/* <Collapse
        className={styles.configCollapse}
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <Icon type="right" rotate={isActive ? 90 : 0} />}
      >
        <Panel header="This is panel header 1" key="1" style={customPanelStyle}>
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 2" key="2" style={customPanelStyle}>
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3" style={customPanelStyle}>
          <p>{text}</p>
        </Panel>
      </Collapse> */}

      <Form.Item label="不使用localStorage环境配置">
        {getFieldDecorator('disableLocalStorage', {
          valuePropName: 'checked',
          initialValue: disableLocalStorage,
        })(<Switch />)}
      </Form.Item>
      <Form.Item label="文字内容(中)" {...formItemLayout}>
        {getFieldDecorator('text', {
          initialValue: text,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="文字内容(英)" {...formItemLayout}>
        {getFieldDecorator('textEn', {
          initialValue: textEn,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="字体" {...formItemLayout}>
        {getFieldDecorator('fontFamily', {
          initialValue: fontFamily,
        })(<Input placeholder="请输入使用的字体" />)}
      </Form.Item>
      <Form.Item label="文字大小" {...formItemLayout}>
        {getFieldDecorator('fontSize', {
          initialValue: fontSize,
        })(<InputNumber min={12} />)}
      </Form.Item>
      <Form.Item label="文字颜色" {...formItemLayout}>
        {getFieldDecorator('color', {
          initialValue: color,
        })(<InputColor />)}
      </Form.Item>
      {/* <Form.Item label="背景颜色" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          initialValue: backgroundColor,
        })(<InputColor />)}
      </Form.Item> */}
      <Form.Item label="文字粗细" {...formItemLayout}>
        {getFieldDecorator('fontWeight', {
          initialValue: fontWeight,
        })(<InputNumber min={100} step={100} max={900} />)}
      </Form.Item>
      <Form.Item label="段落开头空格距离" {...formItemLayout}>
        {getFieldDecorator('textIndent', {
          initialValue: textIndent,
        })(<Input placeholder="10px，2em" />)}
      </Form.Item>
      <Form.Item label="行高" {...formItemLayout}>
        {getFieldDecorator('lineHeight', {
          initialValue: lineHeight,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>
      <Form.Item label="单词间距(wordSpacing)" {...formItemLayout}>
        {getFieldDecorator('wordSpacing', {
          initialValue: wordSpacing,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="字母间距(letterSpacing)" {...formItemLayout}>
        {getFieldDecorator('letterSpacing', {
          initialValue: letterSpacing,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="对齐方式" {...formItemLayout}>
        {getFieldDecorator('textAlign', {
          initialValue: textAlign,
        })(
          <Select style={{ width: 120 }}>
            <Option value="center">居中</Option>
            <Option value="left">左对齐</Option>
            <Option value="right">右对齐</Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="是否开启动态数据" {...formItemLayout}>
        {getFieldDecorator('dynamicData', {
          initialValue: dynamicData,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {dynamicData && (
        <>
          <Form.Item label="数据为空时显示字符" {...formItemLayout}>
            {getFieldDecorator('emptyText', {
              initialValue: emptyText,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="是否展示数据变化" {...formItemLayout}>
            {getFieldDecorator('showDataChange', {
              initialValue: showDataChange,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showDataChange && (
            <>
              <Form.Item label="图标与文字位置" {...formItemLayout}>
                {getFieldDecorator('textPosition', {
                  initialValue: textPosition,
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="textRight">文字右边</Option>
                    <Option value="textLeft">文字左边</Option>
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="数据上升字体颜色" {...formItemLayout}>
                {getFieldDecorator('upFontColor', {
                  initialValue: upFontColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="数据下降字体颜色" {...formItemLayout}>
                {getFieldDecorator('downFontColor', {
                  initialValue: downFontColor,
                })(<InputColor />)}
              </Form.Item>

              {textPosition === 'textLeft' && (
                <Form.Item label="图标与文字间距" {...formItemLayout}>
                  {getFieldDecorator('marginLeft', {
                    initialValue: marginLeft,
                  })(<InputNumber />)}
                </Form.Item>
              )}

              {textPosition === 'textRight' && (
                <Form.Item label="图标与文字间距" {...formItemLayout}>
                  {getFieldDecorator('marginRight', {
                    initialValue: marginRight,
                  })(<InputNumber />)}
                </Form.Item>
              )}

              <Form.Item label="单位formatter" {...formItemLayout}>
                {getFieldDecorator('formatter', {
                  initialValue: formatter,
                })(<Input />)}
              </Form.Item>
            </>
          )}
        </>
      )}
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
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(TextConfig);

import { useEffect } from 'react';
import { Form, InputNumber, Switch, Input, Select, Icon, Button } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const popoverPositionList = [
  'topLeft',
  'top',
  'topRight',
  'tightTop',
  'right',
  'rightBottom',
  'bottomRight',
  'bottom',
  'bottomLeft',
  'leftBottom',
  'left',
  'leftTop',
];

const CustomizeCardConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, getFieldValue, setFieldsValue, resetFields },
    style,
    id,
  } = props;

  const {
    cardBgColor = '#ffffff',
    showTitle = false,
    title = '我是标题',
    titleEn = 'I am title',
    headHeight = 51,
    headPadding = 30,
    headFontSize = 16,
    headFontWeight = 600,
    headFontColor = '#454458',
    titleTextAlign = 'left',
    showMore = false,
    moreBtnWidth = 20,
    moreBtnHeight = 20,
    moreBtnRadius = 4,
    moreBtnBorderWidth = 1,
    moreBtnBorderColor = '#F0F1F5',
    moreBtnBgColor = '#f3f3fb',
    popoverPosition = 'bottom',
    popoverContentList = [],
    showBorder = false,
    cardBorderColor = '#F0F1F5',
    borderRadius = 0,
    showBar = true,
    barWidth = 8,
    barColor = '#71daa5',
    showBoxShadow = true,
    hShadow = 1,
    vShadow = 1,
    blur = 10,
    spread = 0,
    shadowColor = '#d9dcdf',
    cardId = '',
  } = style || {};

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  const handleButtonAdd = () => {
    const newinitialPopoverContentList = getFieldValue('initialPopoverContentList') || [];
    newinitialPopoverContentList.push({
      label: '',
      labelEn: '',
      compKey: '',
      compValue: '',
    });
    setFieldsValue({ initialPopoverContentList: newinitialPopoverContentList });
  };

  const handleButtonRemove = curIndex => {
    const newinitialPopoverContentList = getFieldValue('initialPopoverContentList').filter(
      (n, index) => index !== curIndex,
    );
    setFieldsValue({ initialPopoverContentList: newinitialPopoverContentList });
  };

  getFieldDecorator('initialPopoverContentList', {
    initialValue: popoverContentList,
  });

  const initialPopoverContentList = getFieldValue('initialPopoverContentList');

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="卡片容器ID" {...formItemLayout}>
        {getFieldDecorator('cardId', {
          valuePropName: 'value',
          initialValue: cardId || null,
        })(<Input />)}
      </Form.Item>

      <Form.Item label="卡片背景颜色" {...formItemLayout}>
        {getFieldDecorator('cardBgColor', {
          initialValue: cardBgColor,
        })(<InputColor />)}
      </Form.Item>

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

      <Form.Item label="是否显示更多按钮" {...formItemLayout}>
        {getFieldDecorator('showMore', {
          initialValue: showMore,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>

      {showMore && (
        <>
          <Form.Item label="按钮宽度" {...formItemLayout}>
            {getFieldDecorator('moreBtnWidth', {
              initialValue: moreBtnWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="按钮高度" {...formItemLayout}>
            {getFieldDecorator('moreBtnHeight', {
              initialValue: moreBtnHeight,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="按钮圆角" {...formItemLayout}>
            {getFieldDecorator('moreBtnRadius', {
              initialValue: moreBtnRadius,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="按钮边框尺寸" {...formItemLayout}>
            {getFieldDecorator('moreBtnBorderWidth', {
              initialValue: moreBtnBorderWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="按钮边框颜色" {...formItemLayout}>
            {getFieldDecorator('moreBtnBorderColor', {
              initialValue: moreBtnBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="按钮背景颜色" {...formItemLayout}>
            {getFieldDecorator('moreBtnBgColor', {
              initialValue: moreBtnBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="popover位置" {...formItemLayout}>
            {getFieldDecorator('popoverPosition', {
              initialValue: popoverPosition,
            })(
              <Select>
                {popoverPositionList.map(p => (
                  <Select.Option key={p}>{p}</Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="列表" {...formItemLayout} style={{ marginBottom: 0 }} />
          {initialPopoverContentList.map((item, index) => {
            return (
              <div className={styles.item} key={index}>
                <Form.Item>
                  {getFieldDecorator(`popoverContentList[${index}].label`, {
                    initialValue: item.label,
                  })(<Input placeholder="内容(中)" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`popoverContentList[${index}].labelEn`, {
                    initialValue: item.labelEn,
                  })(<Input placeholder="内容(英)" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`popoverContentList[${index}].compKey`, {
                    initialValue: item.compKey,
                  })(<Input placeholder="compKey" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`popoverContentList[${index}].compValue`, {
                    initialValue: item.compValue,
                  })(<Input placeholder="compValue" />)}
                </Form.Item>
                {initialPopoverContentList.length > 1 && (
                  <Icon type="minus-circle" onClick={() => handleButtonRemove(index)} />
                )}
              </div>
            );
          })}

          <Form.Item>
            <Button type="primary" onClick={handleButtonAdd}>
              +添加
            </Button>
          </Form.Item>
        </>
      )}

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

      <Form.Item label="是否显示左侧条纹" {...formItemLayout}>
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

          <Form.Item label="条纹颜色" {...formItemLayout}>
            {getFieldDecorator('barColor', {
              initialValue: barColor,
            })(<InputColor />)}
          </Form.Item>
        </>
      )}

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

    delete newFields['initialPopoverContentList'];
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(CustomizeCardConfig);

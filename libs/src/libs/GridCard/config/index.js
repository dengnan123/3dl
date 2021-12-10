import { useState, useEffect, useCallback } from 'react';
import { Form, InputNumber, Switch, Input, Select, Collapse, Icon, Button, Radio } from 'antd';
import { debounce } from 'lodash';
import InputColor from '../../../components/InputColor';

import { popoverPositionList } from './const';
import styles from './index.less';

const { Panel } = Collapse;

const CustomizeCardConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    style,
    id,
  } = props;

  const {
    cardBgColor = '#ffffff',
    borderRadius = 0,
    cardBorderColor = '#f0f1f5',
    cardNoBorder = [],
    showBoxShadow = true,
    hShadow = 1,
    vShadow = 1,
    blur = 10,
    spread = 0,
    shadowColor = '#d9dcdf',

    showTitle = true,
    title = '我是标题',
    headHeight = 45,
    headBgcolor = '#ffffff',
    headPadding = 30,
    headFontSize = 16,
    headFontWeight = 400,
    headFontColor = '#606060',
    headBorderWidth = 1,
    headBorderStyle = 'solid',
    headBorderColor = '#f0f1f5',
    titleTextAlign = 'left',

    showMore = false,
    moreBtnRight = 15,
    moreBtnWidth = 20,
    moreBtnHeight = 20,
    moreBtnRadius = 4,
    moreBtnBorderWidth = 1,
    moreBtnBorderColor = '#f0f1f5',
    moreBtnBgColor = '#f3f3fb',
    popoverPosition = 'bottom',
    popoverContentList = [],
    contentPaddingLeft = 0,
    contentPaddingTop = 0,
    contentPaddingRight = 0,
    contentPaddingBottom = 0,

    showHover = false,
    hBgColor = '#ffffff',
    hBorderColor = '#f0f1f5',
    showHShadow = false,
    hXShadow = 1,
    hYShadow = 1,
    hBlur = 10,
    hSpread = 0,
    hShadowColor = '#d9dcdf',

    showIcon = false,
    iconSize = 16,
    titleTip = 'hdjakshkd',
    iconLeft = 10,
    iconColor = '#4A90E2',
  } = style || {};

  // const [styleKey, setKey] = useState(1);

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  // const onChange = useCallback(ev => {
  //   setKey(ev.target.value);
  // }, []);

  const handleButtonAdd = () => {
    const newinitialPopoverContentList = getFieldValue('initialPopoverContentList') || [];
    newinitialPopoverContentList.push({
      label: '',
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
  const isShowBoxShadow = showBoxShadow;
  const isShowTitle = showTitle;
  const isShowMore = showMore;
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {/* <div className={styles.topType}>
        <h3>
          <span>默认样式</span>
          <Icon type="info-circle" />
        </h3>
        <Radio.Group onChange={onChange} value={styleKey}>
          <Radio value={1}>样式1</Radio>
          <Radio value={2}>样式2</Radio>
          <Radio value={3}>样式3</Radio>
        </Radio.Group>
      </div> */}
      <Collapse accordion>
        <Panel header="基础配置" key="BasicConfig">
          <Form.Item label="卡片背景颜色" {...formItemLayout}>
            {getFieldDecorator('cardBgColor', {
              initialValue: cardBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('cardBorderColor', {
              initialValue: cardBorderColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="边框不显示位置" {...formItemLayout}>
            {getFieldDecorator('cardNoBorder', {
              initialValue: cardNoBorder,
            })(
              <Select style={{ width: 120 }} mode="multiple" placeholder="边框不显示部位">
                <Select.Option value="Top">Top</Select.Option>
                <Select.Option value="Right">Right</Select.Option>
                <Select.Option value="Bottom">Bottom</Select.Option>
                <Select.Option value="Left">Left</Select.Option>
              </Select>,
            )}
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

          {isShowBoxShadow && (
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

          {isShowTitle && (
            <>
              <Form.Item label="标题" {...formItemLayout}>
                {getFieldDecorator('title', {
                  initialValue: title,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="标题高度" {...formItemLayout}>
                {getFieldDecorator('headHeight', {
                  initialValue: headHeight,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="标题背景颜色" {...formItemLayout}>
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
                })(<InputNumber min={14} />)}
              </Form.Item>
              <Form.Item label="标题字体粗细" {...formItemLayout}>
                {getFieldDecorator('headFontWeight', {
                  initialValue: headFontWeight,
                })(<InputNumber min={300} step={100} max={900} />)}
              </Form.Item>

              <Form.Item label="标题字体颜色" {...formItemLayout}>
                {getFieldDecorator('headFontColor', {
                  initialValue: headFontColor,
                })(<InputColor />)}
              </Form.Item>

              <Form.Item label="标题下边框线粗细" {...formItemLayout}>
                {getFieldDecorator('headBorderWidth', {
                  initialValue: headBorderWidth,
                })(<InputNumber min={0} step={1} />)}
              </Form.Item>

              <Form.Item label="标题下边框线样式" {...formItemLayout}>
                {getFieldDecorator('headBorderStyle', {
                  initialValue: headBorderStyle,
                })(
                  <Select style={{ width: 120 }}>
                    <Select.Option value="solid">solid</Select.Option>
                    <Select.Option value="dashed">dashed</Select.Option>
                    <Select.Option value="dotted">dotted</Select.Option>
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="标题下边框线颜色" {...formItemLayout}>
                {getFieldDecorator('headBorderColor', {
                  initialValue: headBorderColor,
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

        <Panel header="内容配置" key="ContentConfig">
          <Form.Item label="左边距" {...formItemLayout}>
            {getFieldDecorator('contentPaddingLeft', {
              initialValue: contentPaddingLeft,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="上边距" {...formItemLayout}>
            {getFieldDecorator('contentPaddingTop', {
              initialValue: contentPaddingTop,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="右边距" {...formItemLayout}>
            {getFieldDecorator('contentPaddingRight', {
              initialValue: contentPaddingRight,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="下边距" {...formItemLayout}>
            {getFieldDecorator('contentPaddingBottom', {
              initialValue: contentPaddingBottom,
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Panel>

        <Panel header="更多按钮配置" key="MoreConfig">
          <Form.Item label="是否显示更多按钮" {...formItemLayout}>
            {getFieldDecorator('showMore', {
              initialValue: showMore,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {isShowMore && (
            <>
              <Form.Item label="按钮Right" {...formItemLayout}>
                {getFieldDecorator('moreBtnRight', {
                  initialValue: moreBtnRight,
                })(<InputNumber min={0} />)}
              </Form.Item>

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
                      })(<Input placeholder="内容" />)}
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
        </Panel>

        <Panel header="标题提示Icon" key="IconConfig">
          <Form.Item label="是否显示ICON" {...formItemLayout}>
            {getFieldDecorator('showIcon', {
              initialValue: showIcon,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showIcon && (
            <>
              <Form.Item label="Icon大小" {...formItemLayout}>
                {getFieldDecorator('iconSize', {
                  initialValue: iconSize,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="提示信息" {...formItemLayout}>
                {getFieldDecorator('titleTip', {
                  initialValue: titleTip,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="左侧距离" {...formItemLayout}>
                {getFieldDecorator('iconLeft', {
                  initialValue: iconLeft,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="Icon颜色" {...formItemLayout}>
                {getFieldDecorator('iconColor', {
                  initialValue: iconColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header="Card Hover配置" key="HoverConfig">
          <Form.Item label="是否开启hover" {...formItemLayout}>
            {getFieldDecorator('showHover', {
              initialValue: showHover,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="卡片背景颜色" {...formItemLayout}>
            {getFieldDecorator('hBgColor', {
              initialValue: hBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('hBorderColor', {
              initialValue: hBorderColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="是否显示阴影" {...formItemLayout}>
            {getFieldDecorator('showHShadow', {
              initialValue: showHShadow,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showHShadow && (
            <>
              <Form.Item label="水平阴影位置" {...formItemLayout}>
                {getFieldDecorator('hXShadow', {
                  initialValue: hXShadow,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="垂直阴影位置" {...formItemLayout}>
                {getFieldDecorator('hYShadow', {
                  initialValue: hYShadow,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="模糊距离" {...formItemLayout}>
                {getFieldDecorator('hBlur', {
                  initialValue: hBlur,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="阴影尺寸" {...formItemLayout}>
                {getFieldDecorator('hSpread', {
                  initialValue: hSpread,
                })(<InputNumber />)}
              </Form.Item>

              <Form.Item label="阴影颜色" {...formItemLayout}>
                {getFieldDecorator('hShadowColor', {
                  initialValue: hShadowColor,
                })(<InputColor />)}
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

import React from 'react';
import { debounce } from 'lodash';

import { Form, Input, Tooltip, InputNumber, Select, Collapse, Switch } from 'antd';
import InputColor from '../../../components/InputColor';

const { Panel } = Collapse;

const ToiletCofig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;

  const {
    width = '100%',
    itemBgColor = '#e0e0e0',
    headerHeight = '80px',
    headerFontSize = '24px',
    headerFontColor = '#333333',
    headerAlign = 'center',
    headerBgColor = '',
    floorBg = '#e0e0e0',
    fontColor = '#ffffff',
    floorBr = '0px',
    headerBr = '0px',
    floorFontSize = '24px',
    itemHeight = '120px',
    itemWidth = '100%',
    floorWidth = '160px',
    maleWidth = '740px',
    femaleWidth = '928px',
    headerFloorBg = '#ffffff',
    headeMalerBg = '#ffffff',
    floorLineHeight = '90px',
    headerMarginB = '64px',
    itemMarginB = '48px',
    headeFemalerBg = '#ffffff',
    iconWidth = 45,
    iconHeight = 45,
    iconWrapWidth = 45,
    iconWrapHeight = 45,
    resetWidth = 100,
    resetHeight = 100,
    resetIconWidth = 42,
    resetIconHeight = 40,
    resetTop = 1,
    resetRight = 1,
    resetBoxShadow = '',
    resetBr = 0,
    padding = '0',
    showIcon = false,
    showHeader = false,
    showReset = false,
    showBorderBottom = false,
    toiletIconStyle = 'toilet',
    boxFlexDirection = 'row',
    flexDirection = 'row',
    itemMarginR = '20px',
    genderMarginR = '20px',
    theme = 'dark',
    isLocation = false,
    toiletOrder = 'male',
  } = style;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Tooltip placement="top" title={<span>用法请查看组件ToiletComponent/READMD.md文档</span>}>
        <span>提示</span>
      </Tooltip>

      <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('width', {
          initialValue: width,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="内边距" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('padding', {
          initialValue: padding,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="是否显示男/女Icon" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('showIcon', {
          valuePropsName: 'checked',
          initialValue: showIcon,
        })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
      </Form.Item>
      <Form.Item label="是否显示头部" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('showHeader', {
          valuePropsName: 'checked',
          initialValue: showHeader,
        })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
      </Form.Item>
      <Form.Item label="整体结构横/竖" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('boxFlexDirection', {
          initialValue: boxFlexDirection,
        })(
          <Select>
            {['row', 'column'].map(t => (
              <Select.Option key={t} value={t}>
                {t}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="主题" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('theme', {
          initialValue: theme,
        })(
          <Select>
            {['pure', 'dark'].map(t => (
              <Select.Option key={t} value={t}>
                {t}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="侧位顺序" {...formItemLayout} style={{ marginBottom: 0 }}>
        {getFieldDecorator('toiletOrder', {
          initialValue: toiletOrder,
        })(
          <Select>
            {['male', 'female'].map(t => (
              <Select.Option key={t} value={t}>
                {t}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Collapse accordion>
        <Panel header="头部样式配置" key="header">
          <Form.Item label="楼层宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('floorWidth', {
              initialValue: floorWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="男厕宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('maleWidth', {
              initialValue: maleWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="女厕宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('femaleWidth', {
              initialValue: femaleWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="头部高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headerHeight', {
              initialValue: headerHeight,
            })(<Input />)}
          </Form.Item>

          <Form.Item
            label="头部下边距(margin-bottom)"
            {...formItemLayout}
            style={{ marginBottom: 0 }}
          >
            {getFieldDecorator('headerMarginB', {
              initialValue: headerMarginB,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headerBgColor', {
              initialValue: headerBgColor || '',
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="楼层背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headerFloorBg', {
              initialValue: headerFloorBg,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="男 -- 背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headeMalerBg', {
              initialValue: headeMalerBg,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="女 -- 背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headeFemalerBg', {
              initialValue: headeFemalerBg,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item
            label="头部字体大小(未包含单位)"
            {...formItemLayout}
            style={{ marginBottom: 0 }}
          >
            {getFieldDecorator('headerFontSize', {
              initialValue: headerFontSize,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="头部字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headerFontColor', {
              initialValue: headerFontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item
            label="头部对齐方式(未包含单位)"
            {...formItemLayout}
            style={{ marginBottom: 0 }}
          >
            {getFieldDecorator('headerAlign', {
              initialValue: headerAlign,
            })(
              <Select>
                {['center', 'left', 'right'].map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="头部border-radius" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('headerBr', {
              initialValue: headerBr,
            })(<Input />)}
          </Form.Item>
        </Panel>

        <Panel header="厕位每行配置" key="item">
          <Form.Item label="图标样式" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('toiletIconStyle', {
              initialValue: toiletIconStyle,
            })(
              <Select>
                {['toilet', 'placeholder'].map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="每层样式横/竖" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('flexDirection', {
              initialValue: flexDirection,
            })(
              <Select>
                {['row', 'column'].map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="行高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('itemHeight', {
              initialValue: itemHeight,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="行宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('itemWidth', {
              initialValue: itemWidth,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="icon宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('iconWidth', {
              initialValue: iconWidth,
            })(<InputNumber min={45} />)}
          </Form.Item>
          <Form.Item label="icon高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('iconHeight', {
              initialValue: iconHeight,
            })(<InputNumber min={45} />)}
          </Form.Item>

          <Form.Item label="下边距(margin-bottom)" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('itemMarginB', {
              initialValue: itemMarginB,
            })(<Input />)}
          </Form.Item>

          {boxFlexDirection === 'row' && (
            <>
              <Form.Item
                label="右边距(margin-right)"
                {...formItemLayout}
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator('itemMarginR', {
                  initialValue: itemMarginR,
                })(<Input />)}
              </Form.Item>

              <Form.Item
                label="图标右边距(margin-right)"
                {...formItemLayout}
                style={{ marginBottom: 0 }}
              >
                {getFieldDecorator('genderMarginR', {
                  initialValue: genderMarginR,
                })(<Input />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="icon容器宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('iconWrapWidth', {
              initialValue: iconWrapWidth,
            })(<InputNumber min={45} />)}
          </Form.Item>
          <Form.Item label="icon容器高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('iconWrapHeight', {
              initialValue: iconWrapHeight,
            })(<InputNumber min={45} />)}
          </Form.Item>

          <Form.Item label="背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('itemBgColor', {
              initialValue: itemBgColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="楼层背景色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('floorBg', {
              initialValue: floorBg,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="楼层字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('fontColor', {
              initialValue: fontColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="楼层字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('floorFontSize', {
              initialValue: floorFontSize,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="楼层行高" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('floorLineHeight', {
              initialValue: floorLineHeight,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="楼层border-radius" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('floorBr', {
              initialValue: floorBr,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="是否显示底部线条" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('showBorderBottom', {
              valuePropsName: 'checked',
              initialValue: showBorderBottom,
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
          </Form.Item>

          <Form.Item label="是否显示定位图标" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('isLocation', {
              valuePropsName: 'checked',
              initialValue: isLocation,
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
          </Form.Item>
        </Panel>

        <Panel header="刷新按钮" key="reset">
          <Form.Item label="是否显示头部" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('showReset', {
              valuePropsName: 'checked',
              initialValue: showReset,
            })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
          </Form.Item>

          <Form.Item label="top" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetTop', {
              initialValue: resetTop,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="right" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetRight', {
              initialValue: resetRight,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetWidth', {
              initialValue: resetWidth,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item label="高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetHeight', {
              initialValue: resetHeight,
            })(<InputNumber min={1} />)}
          </Form.Item>

          <Form.Item label="icon宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetIconWidth', {
              initialValue: resetIconWidth,
            })(<InputNumber min={10} />)}
          </Form.Item>
          <Form.Item label="icon高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetIconHeight', {
              initialValue: resetIconHeight,
            })(<InputNumber min={10} />)}
          </Form.Item>
          <Form.Item label="box-shadow" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetBoxShadow', {
              initialValue: resetBoxShadow,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="border-radius" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('resetBr', {
              initialValue: resetBr,
            })(<InputNumber />)}
          </Form.Item>
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
    delete newFields['tabKeys'];

    updateStyle({
      ...style,
      ...newFields,
    });
    // 处理数据
  }, 500),
})(ToiletCofig);

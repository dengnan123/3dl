import React, { useEffect } from 'react';
import { debounce } from 'lodash';

import { Form, Input, InputNumber, Icon, Button, Select, Switch, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';

import styles from './index.less';

const tabTypeList = ['line', 'card', 'none'];
const tabPositionList = ['top', 'right', 'bottom', 'left'];
const tabSizeList = ['large', 'default', 'small'];
const { Panel } = Collapse;

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, resetFields, getFieldValue, setFieldsValue },
    style,
  } = props;

  const {
    id,
    type,
    tabBorderColor,
    tabBorderWidth = 1,
    tabAlign = 'left',
    tabPaddingLeft = 0,
    tabPaddingRight = 0,
    activeBarBgColor,
    activeBarHeight = 2,
    activeBarBorder = 0,
    barWidth,
    barHeight,
    barPadding = '10px 16px',
    contentAlign = 'center',
    contentPadding = '0px',
    contentBorderRadius = '0px',
    tabFontSize,
    tabFontColor,
    tabFontHighlightColor,
    tabBgColor,
    tabBgHighlightColor,
    tabBarGutter,
    tabPosition,
    animated,
    size,
    showIcon,
    iconSize,
    iconMarginRight,
    tabList,
    isRetunToFirst,
    displayMargin,
    delayTime,
    defaultTabKey,
  } = style;

  const handleTabAdd = () => {
    const newTabKeys = getFieldValue('tabKeys') || [];
    newTabKeys.push({ label: '', labelEn: '', svgStr: '', compKey: '', compValue: '' });
    setFieldsValue({ tabKeys: newTabKeys });
  };

  const handleTabRemove = curIndex => {
    const newTabKeys = getFieldValue('tabKeys').filter((n, index) => index !== curIndex);
    setFieldsValue({ tabKeys: newTabKeys });
  };

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  const initialTabList = tabList || [{ lable: '', labelEn: '', compKey: '', compValue: '' }];

  getFieldDecorator('tabKeys', {
    initialValue: initialTabList,
  });
  const newTabList = getFieldValue('tabKeys');
  const isOnlyTab = !newTabList || newTabList.length < 2;

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse accordion>
        <Panel header="Tabs-Bar 配置" key="TabsBar">
          <Form.Item label="标签分隔线颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabBorderColor', {
              initialValue: tabBorderColor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="标签分隔线粗细" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabBorderWidth', {
              initialValue: tabBorderWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="标签选中下划线高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('activeBarHeight', {
              initialValue: activeBarHeight,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="标签选中下划线颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('activeBarBgColor', {
              initialValue: activeBarBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标签选中下划线圆角" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('activeBarBorder', {
              initialValue: activeBarBorder,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>

          <Form.Item label="标签对齐方式" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabAlign', {
              initialValue: tabAlign,
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
          <Form.Item label="标签Nav左边距" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabPaddingLeft', {
              initialValue: tabPaddingLeft,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="标签Nav右边距" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabPaddingRight', {
              initialValue: tabPaddingRight,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Panel>

        <Panel header="标签样式配置" key="TabsStyles">
          <Form.Item label="标签类型" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('type', {
              initialValue: type,
            })(
              <Select>
                {tabTypeList.map(t => (
                  <Select.Option key={t} value={t}>
                    {t}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="标签Padding" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('barPadding', {
              initialValue: barPadding,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="标签宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('barWidth', {
              initialValue: barWidth,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="标签高度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('barHeight', {
              initialValue: barHeight,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="标签内容对齐方式" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentAlign', {
              initialValue: contentAlign,
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

          <Form.Item label="标签页内容Padding" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentPadding', {
              initialValue: contentPadding,
            })(<Input />)}
          </Form.Item>

          {/* <Form.Item label="标签内容border颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentBorderColor', {
              initialValue: contentBorderColor,
            })(<InputColor />)}
          </Form.Item> */}

          <Form.Item label="标签页内容BorderRadius" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('contentBorderRadius', {
              initialValue: contentBorderRadius,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="标签页字体大小" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabFontSize', {
              initialValue: tabFontSize,
            })(<InputNumber min={12} />)}
          </Form.Item>

          <Form.Item label="标签页字体颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabFontColor', {
              initialValue: tabFontColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标签页字体高亮颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabFontHighlightColor', {
              initialValue: tabFontHighlightColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标签页背景颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabBgColor', {
              initialValue: tabBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标签页高亮背景颜色" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabBgHighlightColor', {
              initialValue: tabBgHighlightColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="标签页间距" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabBarGutter', {
              initialValue: tabBarGutter,
            })(<InputNumber min={0} />)}
          </Form.Item>

          <Form.Item label="位置" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('tabPosition', {
              initialValue: tabPosition,
            })(
              <Select>
                {tabPositionList.map(p => (
                  <Select.Option key={p} value={p}>
                    {p}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          {['top', 'bottom'].includes(tabPosition) && (
            <Form.Item label="是否使用动画切换" {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('animated', {
                initialValue: animated,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          )}

          {type !== 'card' && (
            <Form.Item label="标签尺寸" {...formItemLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator('size', {
                initialValue: size,
              })(
                <Select>
                  {tabSizeList.map(s => (
                    <Select.Option key={s} value={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          )}

          <Form.Item label="是否显示图标" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('showIcon', {
              initialValue: showIcon,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showIcon && (
            <>
              <Form.Item label="图标大小" {...formItemLayout}>
                {getFieldDecorator('iconSize', {
                  initialValue: iconSize,
                })(<InputNumber min={0} />)}
              </Form.Item>

              <Form.Item label="图标右边距" {...formItemLayout}>
                {getFieldDecorator('iconMarginRight', {
                  initialValue: iconMarginRight,
                })(<InputNumber />)}
              </Form.Item>
            </>
          )}
        </Panel>

        <Panel header="标签页配置" key="TabsList">
          {newTabList.map((item, index) => {
            return (
              <div className={styles.legendItem} key={index}>
                <Form.Item>
                  {getFieldDecorator(`tabList[${index}].label`, {
                    initialValue: item.label,
                  })(<Input placeholder="内容(中)" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`tabList[${index}].labelEn`, {
                    initialValue: item.labelEn,
                  })(<Input placeholder="内容(英)" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`tabList[${index}].compKey`, {
                    initialValue: item.compKey,
                  })(<Input placeholder="compKey" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`tabList[${index}].compValue`, {
                    initialValue: item.compValue,
                  })(<Input placeholder="compValue" />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`tabList[${index}].svgStr`, {
                    initialValue: item.svgStr,
                  })(<Input placeholder="svg" />)}
                </Form.Item>
                {!isOnlyTab && <Icon type="minus-circle" onClick={() => handleTabRemove(index)} />}
              </div>
            );
          })}

          <Form.Item>
            <Button type="primary" onClick={handleTabAdd}>
              +添加
            </Button>
          </Form.Item>
        </Panel>

        <Panel header="显示内容配置" key="ContentConfig">
          {/* <Form.Item label="显示内容宽度" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('displayWidth', {
              initialValue: displayWidth,
            })(<InputNumber min={0} />)}
          </Form.Item> */}
          <Form.Item label="显示内容边距" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('displayMargin', {
              initialValue: displayMargin || '0px',
            })(<Input />)}
          </Form.Item>
        </Panel>
        <Panel header="显示内容还原配置" key="resetConfig">
          <Form.Item
            label="不操作时，是否回到默认的Tab"
            {...formItemLayout}
            style={{ marginBottom: 0 }}
          >
            {getFieldDecorator('isRetunToFirst', {
              initialValue: isRetunToFirst || false,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="默认的tab" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('defaultTabKey', {
              initialValue: defaultTabKey || '0',
            })(<Input />)}
          </Form.Item>
          <Form.Item label="时间间隔" {...formItemLayout} style={{ marginBottom: 0 }}>
            {getFieldDecorator('delayTime', {
              initialValue: delayTime || 60,
            })(<InputNumber min={0} />)}
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
})(BasicConfig);

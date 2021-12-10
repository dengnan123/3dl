import React from 'react';
import { debounce } from 'lodash';
import { Form, InputNumber, Input, Switch, Collapse } from 'antd';
import InputColor from '../../../components/InputColor';
import Control from './control';
import IndicatorConfig from './IndicatorConfig';

const BasicConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
    form,
  } = props;

  const {
    totalPage,
    margin,
    fontSize,
    padding,
    bgColor,
    disBgColor,
    height,
    width,
    compKey = 'pre',
    defaultActiveIndex = 0,
    leftControl,
    rightControl,
    leftControlData = {},
    rightControlData = {},
    cPadding = '0',
    indicatorData = {},
    autoPlay = false,
    swipeable = true,
    openListCarousel = false,
    listHeight,
    listItemdistance = 10,
    pageSize = 10,
    infiniteLoop = true,
    interval = 2,
  } = style;

  const leftControlProps = {
    form,
    formItemLayout,
    field: 'leftControlData',
    data: leftControlData,
  };

  const rightControlProps = {
    form,
    formItemLayout,
    field: 'rightControlData',
    data: rightControlData,
  };

  const indicatorProps = {
    form,
    formItemLayout,
    data: indicatorData,
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse defaultActiveKey={['basic']}>
        <Collapse.Panel header="基本配置" key="basic">
          <Form.Item label="组件key" {...formItemLayout}>
            {getFieldDecorator('compKey', {
              initialValue: compKey,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="默认展示index" {...formItemLayout}>
            {getFieldDecorator('defaultActiveIndex', {
              initialValue: defaultActiveIndex,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="自动轮播" {...formItemLayout}>
            {getFieldDecorator('autoPlay', {
              valuePropName: 'checked',
              initialValue: autoPlay,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="触摸滑动切换" {...formItemLayout}>
            {getFieldDecorator('swipeable', {
              valuePropName: 'checked',
              initialValue: swipeable,
            })(<Switch />)}
          </Form.Item>
          {autoPlay && (
            <Form.Item label="自动轮播是否循环" {...formItemLayout}>
              {getFieldDecorator('infiniteLoop', {
                valuePropName: 'checked',
                initialValue: infiniteLoop,
              })(<Switch />)}
            </Form.Item>
          )}

          {autoPlay && (
            <Form.Item label="自动轮播间隙(秒)" {...formItemLayout}>
              {getFieldDecorator('interval', {
                initialValue: interval,
              })(<InputNumber min={1} step={1} />)}
            </Form.Item>
          )}

          <Form.Item label="内容padding" {...formItemLayout}>
            {getFieldDecorator('cPadding', {
              initialValue: cPadding,
            })(<Input placeholder="输入内容padding" />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header="控制器" key="control">
          <Form.Item label="左控制器" {...formItemLayout}>
            {getFieldDecorator('leftControl', {
              initialValue: leftControl,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {leftControl && <Control {...leftControlProps}></Control>}
          <Form.Item label="右控制器" {...formItemLayout}>
            {getFieldDecorator('rightControl', {
              initialValue: rightControl,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {rightControl && <Control {...rightControlProps}></Control>}
          <Form.Item label="totalPage" {...formItemLayout}>
            {getFieldDecorator('totalPage', {
              initialValue: totalPage,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="icon大小" {...formItemLayout}>
            {getFieldDecorator('fontSize', {
              initialValue: fontSize,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="图标宽度" {...formItemLayout}>
            {getFieldDecorator('width', {
              initialValue: width,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="图标高度" {...formItemLayout}>
            {getFieldDecorator('height', {
              initialValue: height,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="图标外边距" {...formItemLayout}>
            {getFieldDecorator('margin', {
              initialValue: margin,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="图标内边距" {...formItemLayout}>
            {getFieldDecorator('padding', {
              initialValue: padding,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="图标背景色" {...formItemLayout}>
            {getFieldDecorator('bgColor', {
              initialValue: bgColor,
            })(<InputColor placeholder="请选择背景色颜色" />)}
          </Form.Item>
          <Form.Item label="禁用背景色" {...formItemLayout}>
            {getFieldDecorator('disBgColor', {
              initialValue: disBgColor,
            })(<InputColor placeholder="请选择背景色颜色" />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header="指示器" key="indicator">
          <IndicatorConfig {...indicatorProps} />
        </Collapse.Panel>
        <Collapse.Panel header="轮播列表" key="list">
          <Form.Item label="开启轮播列表" {...formItemLayout}>
            {getFieldDecorator('openListCarousel', {
              valuePropName: 'checked',
              initialValue: openListCarousel,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="每页个数" {...formItemLayout}>
            {getFieldDecorator('pageSize', {
              initialValue: pageSize,
            })(<InputNumber min={0} />)}
          </Form.Item>
          <Form.Item label="列表高度" {...formItemLayout}>
            {getFieldDecorator('listHeight', {
              initialValue: listHeight,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="列表间距" {...formItemLayout}>
            {getFieldDecorator('listItemdistance', {
              initialValue: listItemdistance,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Collapse.Panel>
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

    updateStyle({
      ...style,
      ...newFields,
    });
    // 处理数据
  }, 200),
})(BasicConfig);

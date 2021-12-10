import React from 'react';
import { Form, InputNumber, Select, Row, Col } from 'antd';

// import InputColor from '@/components/InputColor';
import styles from './index.less';

// const formItemLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };

const GridLayoutConfig = props => {
  const {
    config,
    form: { getFieldDecorator },
  } = props;

  const {
    // colsNum,
    rowHeight,
    marginX,
    marginY,
    compactType = 'null',
    // gridBgColor,
    // gridBorderWidth,
    // gridBorderStyle,
    // gridBorderColor,
    // paddingTop,
    // paddingRight,
    // paddingBottom,
    // paddingLeft,
    // gridBorderRadius,
    // gridBoxShadow = {},
    // breakpoints = {},
    // cols = {},
  } = config || {};

  return (
    <React.Fragment>
      {/* <Form.Item label="整体布局" {...formItemLayout}>
        {getFieldDecorator('gridLayout.colsNum', {
          valuePropName: 'value',
          initialValue: colsNum || 2,
        })(
          <Select>
            <Select.Option value={1}>一行一列</Select.Option>
            <Select.Option value={2}>一行二列</Select.Option>
            <Select.Option value={3}>一行三列</Select.Option>
            <Select.Option value={4}>一行四列</Select.Option>
          </Select>,
        )}
      </Form.Item> */}

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="最小高度">
            {getFieldDecorator('gridLayout.rowHeight', {
              initialValue: rowHeight || 50,
            })(<InputNumber placeholder="初始行高" step={10} min={0} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="紧凑类型">
            {getFieldDecorator('gridLayout.compactType', {
              valuePropName: 'value',
              initialValue: compactType || 'null',
            })(
              <Select>
                <Select.Option value={'null'}>不紧凑</Select.Option>
                <Select.Option value={'vertical'}>Y轴紧凑</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="X轴间距">
            {getFieldDecorator('gridLayout.marginX', {
              initialValue: marginX || 8,
            })(<InputNumber placeholder="X轴向间距" step={1} min={0} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Y轴间距">
            {getFieldDecorator('gridLayout.marginY', {
              initialValue: marginY || 8,
            })(<InputNumber placeholder="Y轴向间距" step={1} min={0} />)}
          </Form.Item>
        </Col>
      </Row>

      {/* <Form.Item label="组件内上边距" {...formItemLayout}>
        {getFieldDecorator('gridLayout.paddingTop', {
          initialValue: paddingTop,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>
      <Form.Item label="组件内右边距" {...formItemLayout}>
        {getFieldDecorator('gridLayout.paddingRight', {
          initialValue: paddingRight,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>
      <Form.Item label="组件内下边距" {...formItemLayout}>
        {getFieldDecorator('gridLayout.paddingBottom', {
          initialValue: paddingBottom,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>
      <Form.Item label="组件内左边距" {...formItemLayout}>
        {getFieldDecorator('gridLayout.paddingLeft', {
          initialValue: paddingLeft,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>

      <Form.Item label="背景颜色" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBgColor', {
          initialValue: gridBgColor,
        })(<InputColor />)}
      </Form.Item> */}
      {/* <Form.Item label="边框线粗细" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBorderWidth', {
          initialValue: gridBorderWidth || 0,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>
      <Form.Item label="边框线样式" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBorderStyle', {
          initialValue: gridBorderStyle || 'solid',
        })(
          <Select>
            <Select.Option value="solid">solid</Select.Option>
            <Select.Option value="dashed">dashed</Select.Option>
            <Select.Option value="dotted">dotted</Select.Option>
            <Select.Option value="none">none</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="边框线颜色" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBorderColor', {
          initialValue: gridBorderColor || '#ffffff',
        })(<InputColor />)}
      </Form.Item> */}

      {/* <Form.Item label="组件圆角" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBorderRadius', {
          initialValue: gridBorderRadius || 0,
        })(<InputNumber min={0} step={1} />)}
      </Form.Item>

      <Form.Item label="阴影" {...formItemLayout}>
        {getFieldDecorator('gridLayout.gridBoxShadow', {
          initialValue: gridBoxShadow || 'none',
        })(<Input />)}
      </Form.Item> */}
      {/* <Collapse bordered={false} expandIconPosition="right">
        <Panel header="栅格cols属性" key="cols">
          <Form.Item label="lg" {...formItemLayout}>
            {getFieldDecorator('gridLayout.cols.lg', {
              initialValue: cols.lg || 12,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="md" {...formItemLayout}>
            {getFieldDecorator('gridLayout.cols.md', {
              initialValue: cols.md || 12,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="sm" {...formItemLayout}>
            {getFieldDecorator('gridLayout.cols.sm', {
              initialValue: cols.sm || 6,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="xs" {...formItemLayout}>
            {getFieldDecorator('gridLayout.cols.xs', {
              initialValue: cols.xs || 2,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Panel>

        <Panel header="栅格对应breakpoints属性(单位px)" key="breakpoints">
          <Form.Item label="lg" {...formItemLayout}>
            {getFieldDecorator('gridLayout.breakpoints.lg', {
              initialValue: breakpoints.lg || 1200,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="md" {...formItemLayout}>
            {getFieldDecorator('gridLayout.breakpoints.md', {
              initialValue: breakpoints.md || 996,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="sm" {...formItemLayout}>
            {getFieldDecorator('gridLayout.breakpoints.sm', {
              initialValue: breakpoints.sm || 768,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
          <Form.Item label="xs" {...formItemLayout}>
            {getFieldDecorator('gridLayout.breakpoints.xs', {
              initialValue: breakpoints.xs || 480,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Panel>
      </Collapse> */}
    </React.Fragment>
  );
};

export default GridLayoutConfig;

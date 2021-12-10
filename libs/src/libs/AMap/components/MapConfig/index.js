import { Form, Switch, Select, InputNumber, Input } from 'antd';
import InputColor from '../../../../components/InputColor';

import { reap } from '../../../../components/SafeReaper';

import styles from './index.less';

const FormItem = Form.Item;

const MapConfig = props => {
  const {
    style,
    form: { getFieldDecorator },
    formItemLayout,
  } = props;

  return (
    <div className={styles.container}>
      <FormItem label="组件key" {...formItemLayout}>
        {getFieldDecorator('compKey', {
          initialValue: reap(style, 'compKey', 'amap'),
        })(<Input />)}
      </FormItem>
      <FormItem label="地图样式" {...formItemLayout}>
        {getFieldDecorator('map.style', {
          initialValue: reap(style, 'map.style', 'dark'),
        })(
          <Select>
            <Select.Option value="dark">dark</Select.Option>
            <Select.Option value="light">light</Select.Option>
            <Select.Option value="normal">normal</Select.Option>
            <Select.Option value="blank">blank</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="是否开启下钻地图" {...formItemLayout}>
        {getFieldDecorator('map.drillDown', {
          initialValue: reap(style, 'map.drillDown', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="是否可移动" {...formItemLayout}>
        {getFieldDecorator('map.dragEnable', {
          initialValue: reap(style, 'map.dragEnable', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="是否可缩放" {...formItemLayout}>
        {getFieldDecorator('map.zoomEnable', {
          initialValue: reap(style, 'map.zoomEnable', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="双击放大" {...formItemLayout}>
        {getFieldDecorator('map.doubleClickZoom', {
          initialValue: reap(style, 'map.doubleClickZoom', false),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="图层透明度" {...formItemLayout}>
        {getFieldDecorator('layer.style.opacity', {
          initialValue: reap(style, 'layer.style.opacity', 0.5),
        })(<InputNumber min={0} max={1} />)}
      </FormItem>

      <FormItem label="图层点击是否高亮" {...formItemLayout}>
        {getFieldDecorator('layer.select.open', {
          initialValue: reap(style, 'layer.select.open', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="鼠标移入图层是否高亮" {...formItemLayout}>
        {getFieldDecorator('layer.active.open', {
          initialValue: reap(style, 'layer.active.open', true),
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="图层点击高亮颜色" {...formItemLayout}>
        {getFieldDecorator('layer.activeColor', {
          initialValue: reap(style, 'layer.activeColor', '#FFD591'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="填充图类型" {...formItemLayout}>
        {getFieldDecorator('layer.shape.values', {
          initialValue: reap(style, 'layer.shape.values', 'fill'),
        })(
          <Select>
            <Select.Option value="fill">绘制填充面</Select.Option>
            <Select.Option value="line">绘制填充图描边</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="边界线颜色" {...formItemLayout}>
        {getFieldDecorator('lineLayer.color.values', {
          initialValue: reap(style, 'lineLayer.color.values', '#000000'),
        })(<InputColor />)}
      </FormItem>

      <FormItem label="边界线宽度" {...formItemLayout}>
        {getFieldDecorator('layer.size.values', {
          initialValue: reap(style, 'layer.size.values', 0.5),
        })(<InputNumber min={0} />)}
      </FormItem>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
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
  },
})(MapConfig);
